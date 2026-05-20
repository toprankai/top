import prisma from '@/lib/prisma'
import { sendSubscriptionEmail } from '@/lib/mail'

const PLAN_NAMES = {
  plan_lite: 'Advance',
  plan_pro: 'Pro',
  plan_pro_plus: 'Pro Plus',
  trial: 'Trial',
}

export function planEndsAtFromPlanId(planId, fromDate = new Date()) {
  const endsAt = new Date(fromDate)
  const id = (planId || '').toLowerCase()

  if (id.includes('lite') || id.includes('advance')) {
    endsAt.setMonth(endsAt.getMonth() + 1)
  } else if (id.includes('pro')) {
    endsAt.setMonth(endsAt.getMonth() + 3)
  } else if (id.includes('trial')) {
    endsAt.setDate(endsAt.getDate() + 7)
  } else {
    endsAt.setMonth(endsAt.getMonth() + 1)
  }

  return endsAt
}

/** Idempotent: credits user and records payment if not already stored */
export async function fulfillRazorpayPayment({
  userId,
  planId,
  credits,
  razorpayPaymentId,
  razorpayOrderId,
  amountTotal,
  currency,
  customerEmail,
  paymentStatus = 'captured',
}) {
  if (!userId || !credits || !razorpayPaymentId) {
    throw new Error('Missing required payment fields')
  }

  const existing = await prisma.payment.findFirst({
    where: { razorpayPaymentId },
  })
  if (existing) {
    return { fulfilled: false, alreadyRecorded: true, payment: existing }
  }

  const planEndsAt = planEndsAtFromPlanId(planId)
  const creditNum = Number(credits)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error('User account not found. Please sign out and sign in again.')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: planId,
      planStartedAt: new Date(),
      planEndsAt,
      credits: { increment: creditNum },
      updatedAt: new Date(),
    },
  })

  const payment = await prisma.payment.create({
    data: {
      userId,
      provider: 'razorpay',
      razorpayPaymentId,
      razorpayOrderId,
      planId,
      credits: creditNum,
      amountTotal,
      currency: currency || 'INR',
      customerEmail,
      paymentStatus,
      status: 'completed',
    },
  })

  try {
    await sendSubscriptionEmail(customerEmail, {
      planName: PLAN_NAMES[planId] || planId,
      credits: creditNum,
      amount: amountTotal ? amountTotal / 100 : 0,
      currency: currency || 'INR',
      planEndsAt,
      receiptUrl: null,
      invoicePdf: null,
    })
  } catch (emailError) {
    console.error('Razorpay fulfill: email failed:', emailError.message)
  }

  return { fulfilled: true, alreadyRecorded: false, payment }
}
