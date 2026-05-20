import { NextResponse } from 'next/server'
import { findCampaignBySlug } from '@/lib/review-qr-campaign-store'
import { generateSuggestionLines } from '@/lib/review-qr-suggestions'
import { rateLimitCheck, clientIpFromRequest } from '@/lib/review-qr-rate-limit'

export async function POST(request) {
  const ip = clientIpFromRequest(request)
  const rl = await rateLimitCheck(ip, 'review-suggestions', { max: 40, windowSec: 3600 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.', retryAfterSec: rl.retryAfterSec },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const slug = body?.slug
    const count = Math.min(6, Math.max(1, Number(body?.count) || 4))

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const campaign = await findCampaignBySlug(slug)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const lines = await generateSuggestionLines(campaign, count)
    return NextResponse.json({ lines, aiEnabled: Boolean(process.env.ANTHROPIC_API_KEY) })
  } catch (error) {
    console.error('review-suggestions:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
