import { generateAIReviews } from '@/lib/ai-marketing'
import { genericFallbackLines } from '@/lib/review-qr-demodata'

function dedupe(lines) {
  const seen = new Set()
  const out = []
  for (const line of lines) {
    const k = String(line).trim().toLowerCase()
    if (k.length < 12) continue
    if (seen.has(k)) continue
    seen.add(k)
    out.push(String(line).trim())
  }
  return out
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * @param {object} campaign internal campaign (includes staticReviewPool)
 * @param {number} count
 */
export async function generateSuggestionLines(campaign, count = 4) {
  const pool = dedupe([
    ...(campaign.staticReviewPool || []),
    ...genericFallbackLines(campaign, 8),
  ])

  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY)
  if (!hasAnthropic) {
    return shuffle(pool).slice(0, count)
  }

  const projectLike = {
    placeId: campaign.placeId,
    businessName: campaign.businessName,
    name: campaign.businessName,
    industry: campaign.primaryType?.replace(/_/g, ' ') || campaign.primaryType,
    description: campaign.summary || '',
    keyFeatures: [],
    gmbLink: campaign.googleReviewUrl,
  }

  try {
    const aiLines = await generateAIReviews(projectLike, count)
    const merged = dedupe([...shuffle(aiLines), ...shuffle(pool)])
    return merged.slice(0, count)
  } catch (e) {
    console.warn('generateSuggestionLines AI fallback:', e.message)
    return shuffle(pool).slice(0, count)
  }
}
