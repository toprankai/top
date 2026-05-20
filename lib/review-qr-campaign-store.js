import { getDB } from '@/lib/mongodb'
import { getDemoCampaignBySlug } from '@/lib/review-qr-demodata'
import { googleWriteReviewUrl, googleMapsPlaceUrl } from '@/lib/google-maps-links'
import { getPlaceDetails } from '@/lib/google-places'

const COLLECTION = 'review_qr_campaigns'

export function campaignToPublicDoc(c) {
  if (!c) return null
  return {
    slug: c.slug,
    businessName: c.businessName,
    address: c.address || '',
    primaryType: c.primaryType || '',
    types: c.types || [],
    rating: c.rating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    googleReviewUrl: c.googleReviewUrl,
    googleMapsUri: c.googleMapsUri || null,
    photoUrl: c.photoUrl || null,
    isDemo: Boolean(c.isDemo),
    summary: c.summary || '',
    brandColor: c.brandColor || '#1e3a8a',
    accentColor: c.accentColor || '#eff6ff',
    scanCount: c.scanCount ?? 0,
    utmSource: c.utmSource || null,
    utmMedium: c.utmMedium || null,
    utmCampaign: c.utmCampaign || null,
  }
}

/** Full internal record including staticReviewPool (server only). */
export async function findCampaignBySlug(slug) {
  if (!slug) return null
  const demo = getDemoCampaignBySlug(slug)
  if (demo) return demo

  try {
    const db = await getDB()
    const doc = await db.collection(COLLECTION).findOne({ slug })
    if (!doc) return null
    return {
      slug: doc.slug,
      placeId: doc.placeId,
      businessName: doc.businessName,
      address: doc.address,
      primaryType: doc.primaryType,
      types: doc.types || [],
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      googleMapsUri: doc.googleMapsUri,
      googleReviewUrl: doc.googleReviewUrl,
      photoUrl: doc.photoUrl,
      isDemo: false,
      summary: doc.summary || '',
      staticReviewPool: doc.staticReviewPool || [],
      brandColor: doc.brandColor || '#1e3a8a',
      accentColor: doc.accentColor || '#eff6ff',
      scanCount: doc.scanCount ?? 0,
      utmSource: doc.utmSource,
      utmMedium: doc.utmMedium,
      utmCampaign: doc.utmCampaign,
    }
  } catch (e) {
    console.warn('review_qr_campaigns: DB unavailable', e.message)
    return null
  }
}

export async function incrementCampaignField(slug, field = 'scanCount', inc = 1) {
  try {
    const db = await getDB()
    await db.collection(COLLECTION).updateOne({ slug }, { $inc: { [field]: inc } })
  } catch {
    /* ignore */
  }
}

function slugify(name) {
  return String(name || 'campaign')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

export async function createCampaignFromPlaceId(placeId, options = {}) {
  const details = await getPlaceDetails(placeId)
  const pid = details.placeId
  const writeUrl = googleWriteReviewUrl(pid)
  const mapsUri = details.googleMapsUri || googleMapsPlaceUrl(pid)

  let base = slugify(details.name)
  if (!base) base = 'review-campaign'
  let slug = `${base}-${randomSuffix()}`

  const doc = {
    slug,
    placeId: pid,
    businessName: details.name,
    address: details.address,
    primaryType: details.primaryType,
    types: details.types,
    rating: details.rating,
    reviewCount: details.reviewCount,
    googleMapsUri: mapsUri,
    googleReviewUrl: writeUrl,
    photoUrl: null,
    summary: details.summary || '',
    staticReviewPool: [],
    isDemo: false,
    brandColor: options.brandColor || '#1e3a8a',
    accentColor: options.accentColor || '#eff6ff',
    scanCount: 0,
    googleOpenCount: 0,
    utmSource: options.utmSource || '',
    utmMedium: options.utmMedium || '',
    utmCampaign: options.utmCampaign || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    const db = await getDB()
    for (let i = 0; i < 8; i++) {
      const exists = await db.collection(COLLECTION).findOne({ slug })
      if (!exists) break
      slug = `${base}-${randomSuffix()}`
      doc.slug = slug
    }
    await db.collection(COLLECTION).insertOne(doc)
  } catch (e) {
    console.error('createCampaignFromPlaceId:', e)
    throw new Error(
      e.message?.includes('MONGO_URL')
        ? 'Database is not configured. Set MONGO_URL to save production campaigns.'
        : 'Failed to save campaign. Check database connectivity.'
    )
  }

  return doc
}
