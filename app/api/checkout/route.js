import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRazorpayClient, isRazorpayConfigured } from '@/lib/razorpay'
import { resolveUserFromSession } from '@/lib/resolve-session-user'

const PLANS = {
  plan_lite: {
    priceINR: 8000,
    credits: 1200,
    name: 'Advance Plan',
    durationMonths: 1,
  },
  plan_pro: {
    priceINR: 40000,
    credits: 2400,
    name: 'Pro Plan',
    durationMonths: 3,
  },
  plan_pro_plus: {
    priceINR: 60000,
    credits: 5000,
    name: 'Pro Plus',
    durationMonths: 3,
  },
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let { planId } = await request.json()

    const id = (planId || '').toLowerCase()
    if (id.includes('lite') || id.includes('advance')) {
      planId = 'plan_lite'
    } else if (id.includes('pro_plus') || id.includes('pro plus')) {
      planId = 'plan_pro_plus'
    } else if (id.includes('pro')) {
      planId = 'plan_pro'
    }

    const plan = PLANS[planId]

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    const dbUser = await resolveUserFromSession(session)
    if (!dbUser) {
      return NextResponse.json({ error: 'User account not found. Please sign out and sign in again.' }, { status: 404 })
    }

    const razorpay = getRazorpayClient()
    // Razorpay receipt max length is 40 characters
    const receipt = `rcpt_${Date.now().toString(36)}_${session.user.id.slice(-6)}`.slice(0, 40)
    const order = await razorpay.orders.create({
      amount: plan.priceINR * 100,
      currency: 'INR',
      receipt,
      notes: {
        userId: dbUser.id,
        planId,
        credits: String(plan.credits),
        email: dbUser.email || '',
      },
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    const message =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      'Failed to create checkout session'
    console.error('Checkout error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
