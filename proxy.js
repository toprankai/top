import { NextResponse } from 'next/server'

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // 0. Skip maintenance check for maintenance page itself and static assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.match(/\.(.*)$/) ||
    pathname.includes('/maintenance')
  ) {
    return NextResponse.next()
  }

  // 1. Check Maintenance Mode via env var (avoids self-HTTP-fetch SSL errors in Docker)
  // To enable: set MAINTENANCE_MODE=true in your docker-compose.yml / .env and restart
  if (!pathname.startsWith('/admin') && process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // 2. Skip paths that ALREADY have the country code
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/in') ||
    pathname.startsWith('/us')
  ) {
    return NextResponse.next()
  }

  // Use the Host header (what the client actually typed) rather than nextUrl.hostname,
  // because the dev server binds to 0.0.0.0 and nextUrl.hostname reflects the bind address,
  // not the URL the browser opened.
  const hostHeader = (request.headers.get('host') || '').split(':')[0].toLowerCase()
  const isLocalhost =
    hostHeader === 'localhost' ||
    hostHeader === '127.0.0.1' ||
    hostHeader === '::1' ||
    hostHeader === '0.0.0.0'

  // Local dev: India at bare URLs (http://localhost:3000/...) — no redirect to /in or /us.
  // US site only when you open http://localhost:3000/us/... (handled in block above).
  // Geo headers are ignored here so VPNs / proxies cannot force /us on localhost.
  if (isLocalhost) {
    return NextResponse.next()
  }

  // Production: Cloudflare / Vercel country, default US if unknown
  const country =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    'US'

  const locale = country === 'IN' ? 'in' : 'us'

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

// Ensure proxy only strictly intercepts non-static paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}