import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, getRazorpaySecret } from '@/lib/razorpay'
import { fulfillRazorpayPayment } from '@/lib/razorpay-fulfill'
import { resolveUserFromSession } from '@/lib/resolve-session-user'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await resolveUserFromSession(session)
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User account not found. Please sign out and sign in again.' },
        { status: 404 }
      )
    }

    const secret = getRazorpaySecret()
    if (!secret) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const razorpay = getRazorpayClient()
    if (!razorpay) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const order = await razorpay.orders.fetch(razorpay_order_id)
    const notes = order.notes || {}
    const noteUserId = notes.userId ? String(notes.userId) : null
    const planId = notes.planId
    const credits = notes.credits

    if (noteUserId && noteUserId !== dbUser.id) {
      return NextResponse.json({ error: 'Payment does not belong to this account' }, { status: 403 })
    }

    const result = await fulfillRazorpayPayment({
      userId: dbUser.id,
      planId,
      credits,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      amountTotal: payment.amount,
      currency: payment.currency,
      customerEmail: payment.email || dbUser.email,
      paymentStatus: payment.status,
    })

    return NextResponse.json({
      success: true,
      synced: result.fulfilled,
      alreadyRecorded: result.alreadyRecorded,
      creditsAdded: result.fulfilled ? Number(credits) : 0,
    })
  } catch (error) {
    const message =
      error?.message ||
      error?.error?.description ||
      'Failed to verify payment'
    console.error('Razorpay verify error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
