import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { resolveUserFromSession } from '@/lib/resolve-session-user'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await resolveUserFromSession(session)

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found. Please sign out and sign in again.' },
        { status: 404 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const paymentHistory = payments.map((p) => ({
      id: p.oid,
      provider: p.provider,
      planId: p.planId,
      credits: p.credits,
      amount: p.amountTotal,
      currency: p.currency,
      email: p.customerEmail,
      status: p.status,
      date: p.createdAt,
      cardBrand: p.cardBrand,
      cardLast4: p.cardLast4,
      receiptUrl: p.receiptUrl,
      invoicePdf: p.invoicePdf,
    }))

    return NextResponse.json({
      user: {
        plan: user.plan,
        credits: user.credits,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        trialEndsAt: user.trialEndsAt,
        planStartedAt: user.planStartedAt,
        planEndsAt: user.planEndsAt,
      },
      paymentHistory,
    })
  } catch (error) {
    console.error('Billing details error:', error)
    return NextResponse.json({ error: 'Failed to fetch billing details' }, { status: 500 })
  }
}
