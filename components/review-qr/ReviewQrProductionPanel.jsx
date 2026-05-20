'use client'

import { useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  QrCode,
  MapPin,
  Search,
  Check,
  Copy,
  ExternalLink,
  Download,
  Building2,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { QrPreview } from '@/components/review-qr/QrPreview'

const ECC_LEVELS = ['L', 'M', 'Q', 'H']

export default function ReviewQrProductionPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [utmSource, setUtmSource] = useState('qr')
  const [utmMedium, setUtmMedium] = useState('print')
  const [utmCampaign, setUtmCampaign] = useState('review-helper')
  const [creating, setCreating] = useState(false)
  const [activeSlug, setActiveSlug] = useState(null)
  const [savedCampaign, setSavedCampaign] = useState(null)

  const [qrSize, setQrSize] = useState(320)
  const [ecc, setEcc] = useState('M')

  const landingPath = activeSlug || ''

  const landingUrlWithUtm = useMemo(() => {
    if (typeof window === 'undefined' || !landingPath) return landingPath ? `/r/${landingPath}` : ''
    const base = `${window.location.origin}/r/${landingPath}`
    if (!savedCampaign || savedCampaign.slug !== activeSlug) return base
    try {
      const u = new URL(base)
      if (savedCampaign.utmSource) u.searchParams.set('utm_source', savedCampaign.utmSource)
      if (savedCampaign.utmMedium) u.searchParams.set('utm_medium', savedCampaign.utmMedium)
      if (savedCampaign.utmCampaign) u.searchParams.set('utm_campaign', savedCampaign.utmCampaign)
      return u.toString()
    } catch {
      return base
    }
  }, [landingPath, savedCampaign, activeSlug])

  const landingUrl =
    typeof window !== 'undefined' && landingPath ? landingUrlWithUtm : landingPath ? `/r/${landingPath}` : ''

  const qrEncodeUrl =
    typeof window !== 'undefined' && landingUrlWithUtm?.startsWith('http') ? landingUrlWithUtm : null

  const runSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Enter business name and city (e.g. Murti Jewellers Mumbai).')
      return
    }
    setSearching(true)
    setCandidates([])
    setSelectedPlaceId(null)
    try {
      const res = await fetch('/api/ai-qr/places-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || data.hint || 'Search failed')
      setCandidates(data.places || [])
      if (!data.places?.length) toast.message('No results — try a different spelling or add the neighborhood.')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSearching(false)
    }
  }

  const createCampaign = async () => {
    if (!selectedPlaceId) {
      toast.error('Select the correct listing first.')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/ai-qr/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: selectedPlaceId,
          utmSource,
          utmMedium,
          utmCampaign,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save campaign')
      setActiveSlug(data.campaign.slug)
      setSavedCampaign(data.campaign)
      toast.success('Campaign saved — distribute the landing URL or QR.')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setCreating(false)
    }
  }

  const copyUrl = async () => {
    if (!landingUrl || !landingUrl.startsWith('http')) {
      toast.error('Open this page in the browser to copy the full URL.')
      return
    }
    try {
      await navigator.clipboard.writeText(landingUrl)
      toast.success('Landing URL copied')
    } catch {
      toast.error('Clipboard unavailable')
    }
  }

  const buildQrDataUrl = useCallback(async () => {
    const QRCode = (await import('qrcode')).default
    const target =
      typeof window !== 'undefined' && landingPath
        ? qrEncodeUrl && qrEncodeUrl.startsWith('http')
          ? qrEncodeUrl
          : `${window.location.origin}/r/${landingPath}`
        : ''
    if (!target) throw new Error('No URL')
    return QRCode.toDataURL(target, {
      errorCorrectionLevel: ecc,
      width: qrSize,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
  }, [ecc, landingPath, qrEncodeUrl, qrSize])

  const downloadPng = async () => {
    try {
      const dataUrl = await buildQrDataUrl()
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `review-qr-${landingPath}.png`
      a.click()
      toast.success('PNG downloaded')
    } catch (e) {
      toast.error(e.message || 'PNG export failed')
    }
  }

  const downloadSvg = async () => {
    try {
      const QRCode = (await import('qrcode')).default
      const target =
        typeof window !== 'undefined' && landingPath
          ? qrEncodeUrl && qrEncodeUrl.startsWith('http')
            ? qrEncodeUrl
            : `${window.location.origin}/r/${landingPath}`
          : ''
      if (!target) throw new Error('No URL')
      const svg = await QRCode.toString(target, {
        type: 'svg',
        errorCorrectionLevel: ecc,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `review-qr-${landingPath}.svg`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('SVG downloaded')
    } catch (e) {
      toast.error(e.message || 'SVG export failed')
    }
  }

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const dataUrl = await buildQrDataUrl()
      const pad = 48
      const pdf = new jsPDF({ unit: 'pt', format: [qrSize + pad * 2, qrSize + pad * 2 + 56] })
      pdf.setFillColor(15, 23, 42)
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F')
      pdf.addImage(dataUrl, 'PNG', pad, pad, qrSize, qrSize)
      pdf.setTextColor(226, 232, 240)
      pdf.setFontSize(11)
      pdf.text('Scan to leave a Google review', pad, pad + qrSize + 28)
      pdf.setFontSize(9)
      pdf.setTextColor(148, 163, 184)
      pdf.text('Suggestions are optional writing help — customer posts in Google.', pad, pad + qrSize + 44)
      pdf.save(`review-qr-${landingPath}.pdf`)
      toast.success('PDF downloaded')
    } catch (e) {
      toast.error(e.message || 'PDF export failed')
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-900 text-white rounded-t-3xl border-b border-slate-800">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Google Places → campaign
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            Search by business name and city, confirm the listing, then save. Requires Places API (New) and MongoDB.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-8 space-y-5">
          <div>
            <Label className="text-xs font-bold uppercase text-slate-500">Find the client listing</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="e.g. Cafe Delight Brooklyn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                className="h-12 rounded-xl"
              />
              <Button
                type="button"
                onClick={runSearch}
                disabled={searching}
                className="h-12 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shrink-0"
              >
                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {candidates.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <Label className="text-xs font-bold uppercase text-slate-500">Confirm correct listing</Label>
              {candidates.map((p) => (
                <button
                  key={p.placeId}
                  type="button"
                  onClick={() => setSelectedPlaceId(p.placeId)}
                  className={`w-full text-left rounded-2xl border-2 px-4 py-3 transition-all ${
                    selectedPlaceId === p.placeId
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {selectedPlaceId === p.placeId ? (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{p.address}</div>
                      {p.primaryType ? (
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                          {String(p.primaryType).replace(/_/g, ' ')}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-[10px] font-bold uppercase text-slate-500">utm_source</Label>
              <Input className="h-10 mt-1 rounded-lg" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase text-slate-500">utm_medium</Label>
              <Input className="h-10 mt-1 rounded-lg" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase text-slate-500">utm_campaign</Label>
              <Input
                className="h-10 mt-1 rounded-lg"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={createCampaign}
            disabled={creating || !selectedPlaceId}
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 font-bold"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Save campaign and generate assets
          </Button>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Requires GOOGLE_API_KEY with Places API (New) and billing, and MONGO_URL to persist campaigns.
            ANTHROPIC_API_KEY powers optional AI lines on the landing page; without it, fallbacks still work.
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            Printable QR and hosted URL
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">
            Save a campaign first, then copy the landing link or download QR assets (PNG, SVG, PDF).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-0">
          <div>
            <Label className="text-xs font-bold uppercase text-slate-500">Landing URL</Label>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <Input readOnly value={landingUrl} className="h-11 rounded-xl font-mono text-xs bg-slate-50" />
              <div className="flex gap-2 shrink-0">
                <Button type="button" variant="outline" className="font-bold rounded-xl" onClick={copyUrl} disabled={!landingPath}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button type="button" variant="outline" className="font-bold rounded-xl" asChild>
                  <a
                    href={landingUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={!landingPath ? 'pointer-events-none opacity-50' : ''}
                    aria-disabled={!landingPath}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold uppercase text-slate-500">Module size (px)</Label>
              <Input
                type="number"
                min={180}
                max={1200}
                step={20}
                className="mt-2 h-10 rounded-xl"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value) || 320)}
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-slate-500">Error correction</Label>
              <select
                className="mt-2 w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
                value={ecc}
                onChange={(e) => setEcc(e.target.value)}
              >
                {ECC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-200 p-8 min-h-[280px]">
            {landingPath ? (
              <>
                <QrPreview path={landingPath} size={Math.min(240, qrSize)} ecc={ecc} targetUrl={qrEncodeUrl} />
                <p className="text-[10px] text-slate-400 mt-4 text-center max-w-xs">Scan targets /r/{landingPath}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500 font-medium text-center px-4">
                Save a campaign to preview the QR and landing path here.
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="secondary"
              className="font-bold rounded-xl text-xs h-11"
              onClick={downloadPng}
              disabled={!landingPath}
            >
              <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
              PNG
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-bold rounded-xl text-xs h-11"
              onClick={downloadSvg}
              disabled={!landingPath}
            >
              <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
              SVG
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-bold rounded-xl text-xs h-11"
              onClick={downloadPdf}
              disabled={!landingPath}
            >
              <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
