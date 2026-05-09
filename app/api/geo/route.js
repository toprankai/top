import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const headersList = await headers()
    const host = (headersList.get('host') || '').split(':')[0].toLowerCase()
    const isLocalHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '0.0.0.0'

    const country =
      headersList.get('cf-ipcountry') ||
      headersList.get('x-vercel-ip-country') ||
      headersList.get('x-country-code') ||
      (isLocalHost ? 'IN' : 'US')

    return NextResponse.json({ country })
  } catch {
    return NextResponse.json({ country: 'US' })
  }
}
