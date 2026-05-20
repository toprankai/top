import { NextResponse } from 'next/server'
import { findCampaignBySlug, campaignToPublicDoc } from '@/lib/review-qr-campaign-store'

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 })
    }

    const campaign = await findCampaignBySlug(slug)
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ campaign: campaignToPublicDoc(campaign) })
  } catch (error) {
    console.error('campaign GET:', error)
    return NextResponse.json({ error: 'Failed to load campaign' }, { status: 500 })
  }
}
