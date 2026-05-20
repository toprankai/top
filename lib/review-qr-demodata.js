import { googleWriteReviewUrl, googleMapsPlaceUrl } from '@/lib/google-maps-links'

/** Curated demo campaigns (no API key required). CTA uses a real place_id so flows QA reliably. */
const DEMO_PLACE_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Google Sydney — public sample listing for stable writereview QA

export const DEMO_CAMPAIGN_SLUGS = ['murti-jewellers-demo', 'demo-cafe']

const DEMO_CAMPAIGNS = [
  {
    slug: 'murti-jewellers-demo',
    isDemo: true,
    placeId: DEMO_PLACE_ID,
    businessName: 'Murti Jewellers',
    address: 'Fort, Mumbai (demo preview)',
    primaryType: 'jewelry_store',
    types: ['jewelry_store', 'store'],
    rating: 4.8,
    reviewCount: 127,
    googleMapsUri: googleMapsPlaceUrl(DEMO_PLACE_ID),
    googleReviewUrl: googleWriteReviewUrl(DEMO_PLACE_ID),
    photoUrl: null,
    summary:
      'Family-run jewelry boutique known for custom gold designs and attentive service.',
    staticReviewPool: [
      'Visited for a custom wedding band consultation. The team took time to understand what we wanted and never rushed us. The finishing on the piece is immaculate.',
      'Honest pricing compared to other shops we checked in the area. They explained the karat options clearly and let us compare pieces side by side.',
      'Small showroom but the craftsmanship speaks for itself. I picked up repairs on time exactly as promised.',
      'Warm, professional staff — they remembered us from our last visit. Great experience from start to finish.',
    ],
    brandColor: '#0f172a',
    accentColor: '#e2e8f0',
  },
  {
    slug: 'demo-cafe',
    isDemo: true,
    placeId: DEMO_PLACE_ID,
    businessName: 'Neighbourhood Demo Café',
    address: 'Sample listing for QA (same Maps target as Murti demo)',
    primaryType: 'cafe',
    types: ['cafe', 'food'],
    rating: 4.6,
    reviewCount: 89,
    googleMapsUri: googleMapsPlaceUrl(DEMO_PLACE_ID),
    googleReviewUrl: googleWriteReviewUrl(DEMO_PLACE_ID),
    photoUrl: null,
    summary: 'Cosy café demo for sales decks — QR and copy are real; Maps button uses the shared sample listing.',
    staticReviewPool: [
      'Consistently great espresso and friendly baristas. It is my regular stop before work.',
      'Tried the seasonal pastry — fresh, not overly sweet. Seating is limited but turnover is quick.',
      'Quiet enough to read for an hour. Wi‑Fi worked fine and staff were attentive without hovering.',
    ],
    brandColor: '#14532d',
    accentColor: '#dcfce7',
  },
]

export function listDemoCampaigns() {
  return DEMO_CAMPAIGNS.map(({ staticReviewPool, ...rest }) => ({
    ...rest,
    staticReviewCount: staticReviewPool?.length ?? 0,
  }))
}

export function getDemoCampaignBySlug(slug) {
  const raw = DEMO_CAMPAIGNS.find((c) => c.slug === slug)
  if (!raw) return null
  return { ...raw }
}

/** Generic lines when AI is off — localized phrasing from campaign name/type */
export function genericFallbackLines(campaign, count = 4) {
  const name = campaign?.businessName || 'this business'
  const loc = campaign?.address ? ` in the ${campaign.address.split(',').slice(-2).join(',').trim()}` : ''
  const type = (campaign?.primaryType || 'local business').replace(/_/g, ' ')
  const lines = [
    `Great experience at ${name}. Staff were helpful and the ${type} quality exceeded what I expected${loc ? ` ${loc}` : ''}.`,
    `I have visited ${name} a few times now — consistent service, clean space, and fair value. Happy to recommend to friends.`,
    `${name} made it easy from start to finish. Communication was clear and I would gladly return.`,
    `Solid ${type} — attentive team, good attention to detail, and a comfortable experience overall.`,
  ]
  return lines.slice(0, Math.min(count, lines.length))
}
