'use client'

import { useEffect, useState } from 'react'

export function QrPreview({ path, size, ecc, targetUrl }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!path || typeof window === 'undefined') return
    let cancelled = false
    ;(async () => {
      try {
        const QRCode = (await import('qrcode')).default
        const url =
          targetUrl && targetUrl.startsWith('http') ? targetUrl : `${window.location.origin}/r/${path}`
        const dataUrl = await QRCode.toDataURL(url, {
          errorCorrectionLevel: ecc,
          width: size,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        })
        if (!cancelled) setSrc(dataUrl)
      } catch {
        if (!cancelled) setSrc('')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [path, size, ecc, targetUrl])

  if (!src) {
    return <div className="w-[200px] h-[200px] rounded-2xl bg-slate-100 animate-pulse" />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="QR preview" width={size} height={size} className="rounded-xl shadow-inner" />
}
