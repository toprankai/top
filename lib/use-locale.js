'use client'

import { useEffect, useState } from 'react'

/**
 * Returns the active locale ('in' | 'us') and an `isIndia` boolean.
 *
 * SSR-safe: starts at 'us' (matches the server default). On mount it
 * recomputes based on the URL path → hostname → /api/geo. Components
 * that depend on the locale render the US default during hydration
 * and re-render with the correct value immediately after, so there is
 * no hydration mismatch.
 *
 * Detection priority:
 *   1. URL path prefix (/in, /us)
 *   2. Localhost / 127.0.0.1 / 0.0.0.0   →  India (dev convention)
 *   3. /api/geo (server-determined country from CDN headers)
 */
export function useLocale() {
  const [locale, setLocale] = useState('us')

  useEffect(() => {
    const path = window.location.pathname
    const host = window.location.hostname

    if (path.startsWith('/in/') || path === '/in') {
      setLocale('in')
      return
    }
    if (path.startsWith('/us/') || path === '/us') {
      setLocale('us')
      return
    }

    const isLocalHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '0.0.0.0'

    if (isLocalHost) {
      setLocale('in')
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    fetch('/api/geo', { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d?.country === 'IN') setLocale('in')
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return { locale, isIndia: locale === 'in' }
}
