import { NextResponse } from 'next/server'
import { findCampaignBySlug, incrementCampaignField } from '@/lib/review-qr-campaign-store'
import { getDemoCampaignBySlug } from '@/lib/review-qr-demodata'
import { rateLimitCheck, clientIpFromRequest } from '@/lib/review-qr-rate-limit'

export async function POST(request) {
  const ip = clientIpFromRequest(request)
  const rl = await rateLimitCheck(ip, 'track', { max: 120, windowSec: 3600 })
  if (!rl.ok) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  try {
    const { slug, event } = await request.json()
    if (!slug || !['scan', 'google_open'].includes(event)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const demo = getDemoCampaignBySlug(slug)
    if (demo) {
      return NextResponse.json({ ok: true, demo: true })
    }

    const exists = await findCampaignBySlug(slug)
    if (!exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (event === 'scan') await incrementCampaignField(slug, 'scanCount', 1)
    if (event === 'google_open') await incrementCampaignField(slug, 'googleOpenCount', 1)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
