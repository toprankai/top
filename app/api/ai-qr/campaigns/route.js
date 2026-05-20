import { NextResponse } from 'next/server'
import { createCampaignFromPlaceId, campaignToPublicDoc } from '@/lib/review-qr-campaign-store'

export async function POST(request) {
  try {
    const body = await request.json()
    const { placeId, utmSource, utmMedium, utmCampaign, brandColor, accentColor } = body || {}
    if (!placeId || typeof placeId !== 'string') {
      return NextResponse.json({ error: 'placeId is required' }, { status: 400 })
    }

    const doc = await createCampaignFromPlaceId(placeId, {
      utmSource,
      utmMedium,
      utmCampaign,
      brandColor,
      accentColor,
    })

    return NextResponse.json({
      campaign: campaignToPublicDoc(doc),
      message: 'Campaign saved. Distribute the landing URL or QR; scans can be tracked from your analytics pipeline.',
    })
  } catch (error) {
    console.error('campaigns POST:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: error.message?.includes('MONGO_URL') ? 503 : 500 }
    )
  }
}
