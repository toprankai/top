import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { fulfillRazorpayPayment } from '@/lib/razorpay-fulfill'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Razorpay webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('x-razorpay-signature')

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (expectedSignature !== sig) {
    console.error('Razorpay signature mismatch')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload.payment?.entity || event.payload.order?.entity
    const notes = payment.notes || {}

    const userId = notes.userId
    const planId = notes.planId
    const credits = notes.credits

    if (userId && credits) {
      await fulfillRazorpayPayment({
        userId,
        planId,
        credits,
        razorpayPaymentId: payment.id,
        razorpayOrderId: payment.order_id,
        amountTotal: payment.amount,
        currency: payment.currency,
        customerEmail: payment.email || notes.email,
        paymentStatus: payment.status,
      })
    }
  }

  return NextResponse.json({ received: true })
}
