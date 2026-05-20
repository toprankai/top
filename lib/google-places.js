/** Server-side Places (New) key; falls back to NEXT_PUBLIC_* if GOOGLE_API_KEY is unset (common in dev). */
export function getGooglePlacesApiKey() {
  return (
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    ''
  )
}

function formatGooglePlacesHttpError(status, bodyText) {
  const raw = (bodyText || '').trim()
  let detail = raw
  try {
    const j = JSON.parse(raw)
    const err = j.error || j
    const msg = err.message || err.status || err.code
    const reasons = Array.isArray(err.details)
      ? err.details
          .map((d) => d?.reason || d?.message || d?.errorCode)
          .filter(Boolean)
          .join('; ')
      : ''
    if (msg) detail = reasons ? `${msg}. ${reasons}` : String(msg)
  } catch {
    if (detail.length > 500) detail = `${detail.slice(0, 500)}…`
  }
  return `Google Places API error (${status})${detail ? `: ${detail}` : ''}. Enable "Places API (New)" for this key in Google Cloud Console and ensure billing is active.`
}

export async function searchBusinessByText(query) {
  const apiKey = getGooglePlacesApiKey()
  if (!apiKey) {
    throw new Error(
      'No Google API key: set GOOGLE_API_KEY (recommended) or NEXT_PUBLIC_GOOGLE_API_KEY in .env'
    )
  }
  const url = 'https://places.googleapis.com/v1/places:searchText'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.types'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10
      })
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Places searchText:', response.status, errorText)
      throw new Error(formatGooglePlacesHttpError(response.status, errorText))
    }
    
    const data = await response.json()
    
    return (data.places || []).map(place => ({
      placeId: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      primaryType: place.primaryType || place.types?.[0] || '',
      types: place.types || []
    }))
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') throw new Error('Request timed out after 15s')
    throw error
  }
}

function placeResourceName(placeId) {
  if (!placeId) return ''
  const id = String(placeId).trim()
  if (id.startsWith('places/')) return id
  return `places/${id}`
}

export async function getPlaceDetails(placeId) {
  const apiKey = getGooglePlacesApiKey()
  if (!apiKey) {
    throw new Error('No Google API key: set GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_API_KEY')
  }
  const resource = placeResourceName(placeId)
  const url = `https://places.googleapis.com/v1/${encodeURIComponent(resource)}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,primaryType,types,rating,userRatingCount,websiteUri,nationalPhoneNumber,photos,editorialSummary,reviews,businessStatus,googleMapsUri'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const t = await response.text()
      throw new Error(formatGooglePlacesHttpError(response.status, t))
    }
    
    const place = await response.json()
    
    const photoRef =
      place.photos?.[0]?.name ||
      place.photos?.[0]?.googleMapsUri ||
      (typeof place.photos?.[0] === 'string' ? place.photos[0] : null)

    return {
      placeId: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      primaryType: place.primaryType || '',
      types: place.types || [],
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0,
      website: place.websiteUri || '',
      phone: place.nationalPhoneNumber || '',
      photos: place.photos || [],
      photoCount: place.photos?.length || 0,
      photoRef: photoRef || null,
      summary: place.editorialSummary?.text || '',
      reviews: place.reviews || [],
      status: place.businessStatus || 'OPERATIONAL',
      googleMapsUri: place.googleMapsUri || ''
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') throw new Error('Place details request timed out')
    throw error
  }
}

export async function searchKeywordAtPoint(keyword, lat, lng, radiusMeters = 5000) {
  const apiKey = getGooglePlacesApiKey()
  if (!apiKey) {
    throw new Error('No Google API key: set GOOGLE_API_KEY or NEXT_PUBLIC_GOOGLE_API_KEY')
  }
  const url = 'https://places.googleapis.com/v1/places:searchText'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount'
      },
      body: JSON.stringify({
        textQuery: keyword,
        maxResultCount: 20,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: radiusMeters
          }
        }
      })
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Search at point error:', errorText)
      throw new Error(formatGooglePlacesHttpError(response.status, errorText))
    }
    
    const data = await response.json()
    
    return (data.places || []).map((place, index) => ({
      rank: index + 1,
      placeId: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      rating: place.rating || 0,
      reviewCount: place.userRatingCount || 0
    }))
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error('Google Search at location timed out')
      throw new Error('Search timed out')
    }
    throw error
  }
}

export async function getQuerySuggestions(input) {
  if (!input) return []
  const apiKey = getGooglePlacesApiKey()
  if (!apiKey) return []

  const url = 'https://places.googleapis.com/v1/places:autocomplete'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify({ input })
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error('v1 Autocomplete error:', await response.text())
      return []
    }
    
    const data = await response.json()
    return (data.suggestions || []).map(s => {
      return s.queryPrediction?.text?.text || s.placePrediction?.text?.text || ''
    }).filter(Boolean)
  } catch (error) {
    clearTimeout(timeoutId)
    return []
  }
}

export async function getNearbyCompetitors(lat, lng, type, excludePlaceId = null) {
  if (!type) return []
  const apiKey = getGooglePlacesApiKey()
  if (!apiKey) return []

  const url = 'https://places.googleapis.com/v1/places:searchText'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location'
      },
      body: JSON.stringify({
        textQuery: type, // Searching for businesses of the same type
        maxResultCount: 6, // Get top 6 to find at least 5 competitors
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5000 // 5km search radius
          }
        }
      })
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error('Google Places Competitor Search Error:', await response.text())
      return []
    }
    
    const data = await response.json()
    
    return (data.places || [])
      .filter(place => place.id !== excludePlaceId) // Exclude current business
      .slice(0, 5) // Take top 5 competitors
      .map(place => ({
        placeId: place.id,
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        rating: place.rating || 0,
        reviewCount: place.userRatingCount || 0,
        latitude: place.location?.latitude || 0,
        longitude: place.location?.longitude || 0
      }))
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Failed to fetch competitors:', error)
    return []
  }
}
