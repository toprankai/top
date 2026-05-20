/**
 * Normalize Places API (New) resource id to bare place_id used in writereview URLs.
 * @param {string} id e.g. "places/ChIJ..." or "ChIJ..."
 */
export function normalizePlaceId(id) {
  if (!id || typeof id !== 'string') return ''
  return id.replace(/^places\//, '').trim()
}

/**
 * Official write-review entry (user still signs in and posts in Google).
 * @param {string} placeId
 */
export function googleWriteReviewUrl(placeId) {
  const pid = normalizePlaceId(placeId)
  if (!pid) return ''
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(pid)}`
}

/**
 * Fallback when googleMapsUri is missing: deep link to the place in Maps.
 */
export function googleMapsPlaceUrl(placeId) {
  const pid = normalizePlaceId(placeId)
  if (!pid) return ''
  return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(pid)}`
}
