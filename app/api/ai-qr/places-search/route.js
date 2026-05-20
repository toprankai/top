import { NextResponse } from 'next/server'
import { searchBusinessByText } from '@/lib/google-places'

export async function POST(request) {
  try {
    const { query } = await request.json()
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Enter at least 2 characters (business name + city).' }, { status: 400 })
    }

    const results = await searchBusinessByText(query.trim())
    return NextResponse.json({
      places: results.map((p) => ({
        placeId: p.placeId,
        name: p.name,
        address: p.address,
        primaryType: p.primaryType,
        types: p.types,
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    })
  } catch (error) {
    console.error('places-search:', error)
    return NextResponse.json(
      {
        error: error.message || 'Places search failed',
        hint: 'Enable Places API (New) and billing on your Google Cloud project, and set GOOGLE_API_KEY.',
      },
      { status: 502 }
    )
  }
}
