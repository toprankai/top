'use client'

import { useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  QrCode,
  Sparkles,
  MapPin,
  Copy,
  ExternalLink,
  Download,
  Shield,
  LineChart,
  Building2,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react'
import { toast } from 'sonner'
import { listDemoCampaigns } from '@/lib/review-qr-demodata'
import { QrPreview } from '@/components/review-qr/QrPreview'

const ECC_LEVELS = ['L', 'M', 'Q', 'H']

export default function AiQrCodeReviewProductPage() {
  const demos = useMemo(() => listDemoCampaigns(), [])
  const [demoSlug, setDemoSlug] = useState(demos[0]?.slug || 'murti-jewellers-demo')

  const [qrSize, setQrSize] = useState(320)
  const [ecc, setEcc] = useState('M')

  const landingPath = demoSlug

  const landingUrlWithUtm = useMemo(() => {
    if (typeof window === 'undefined' || !landingPath) return landingPath ? `/r/${landingPath}` : ''
    return `${window.location.origin}/r/${landingPath}`
  }, [landingPath])

  const landingUrl =
    typeof window !== 'undefined' && landingPath ? landingUrlWithUtm : landingPath ? `/r/${landingPath}` : ''

  const qrEncodeUrl =
    typeof window !== 'undefined' && landingUrlWithUtm?.startsWith('http')
      ? landingUrlWithUtm
      : null

  const copyUrl = async () => {
    if (!landingUrl || !landingUrl.startsWith('http')) {
      toast.error('Open this page in the browser to copy the full URL.')
      return
    }
    try {
      await navigator.clipboard.writeText(landingUrl)
      toast.success('Demo landing URL copied')
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
      a.download = `review-qr-demo-${landingPath}.png`
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
      a.download = `review-qr-demo-${landingPath}.svg`
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
      pdf.text('Scan to leave a Google review (demo)', pad, pad + qrSize + 28)
      pdf.setFontSize(9)
      pdf.setTextColor(148, 163, 184)
      pdf.text('Create your real campaign in the client dashboard.', pad, pad + qrSize + 44)
      pdf.save(`review-qr-demo-${landingPath}.pdf`)
      toast.success('PDF downloaded')
    } catch (e) {
      toast.error(e.message || 'PDF export failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-24 px-4">
        <section className="max-w-5xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Review conversion layer for local SEO
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
            Google review QR + AI drafts
            <span className="block text-lg md:text-xl font-semibold text-slate-500 mt-3 max-w-3xl mx-auto leading-relaxed">
              See how the experience works with the examples below. To build a live campaign for your business or
              clients, sign in and use the dashboard.
            </span>
          </h1>
        </section>

        <Card className="max-w-2xl mx-auto mb-10 border-emerald-200 bg-emerald-50/40 shadow-md rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 text-left">
              <LayoutDashboard className="w-10 h-10 text-emerald-700 shrink-0" />
              <div>
                <p className="font-black text-slate-900 text-lg">Your campaigns live in the dashboard</p>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Search Google Places, save the correct listing, then download QR and share your /r/ link.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shrink-0 whitespace-nowrap"
            >
              <Link href="/dashboard/review-qr">Open Review QR</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white rounded-t-3xl border-b border-slate-800">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Example businesses
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                Static demos for sales decks and QA. The customer landing uses a shared sample Google listing for the
                review button.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-8 space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500">Pick an example</Label>
                <div className="mt-2 space-y-2">
                  {demos.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => setDemoSlug(d.slug)}
                      className={`w-full text-left rounded-2xl border-2 px-4 py-3 transition-all ${
                        demoSlug === d.slug
                          ? 'border-emerald-600 bg-emerald-50/60'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{d.businessName}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {d.address}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                These are previews only. Production campaigns with your real Maps listing are created in the
                dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden lg:sticky lg:top-28">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                Example QR and link
              </CardTitle>
              <CardDescription className="font-medium text-slate-500">
                Same assets you get in the dashboard for a saved campaign — here tied to the demo you selected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500">Demo landing URL</Label>
                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                  <Input readOnly value={landingUrl} className="h-11 rounded-xl font-mono text-xs bg-slate-50" />
                  <div className="flex gap-2 shrink-0">
                    <Button type="button" variant="outline" className="font-bold rounded-xl" onClick={copyUrl}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button type="button" variant="outline" className="font-bold rounded-xl" asChild>
                      <a href={landingUrl || '#'} target="_blank" rel="noopener noreferrer">
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

              <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-200 p-8">
                <QrPreview path={landingPath} size={Math.min(240, qrSize)} ecc={ecc} targetUrl={qrEncodeUrl} />
                <p className="text-[10px] text-slate-400 mt-4 text-center max-w-xs">Scan targets /r/{landingPath}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button type="button" variant="secondary" className="font-bold rounded-xl text-xs h-11" onClick={downloadPng}>
                  <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
                  PNG
                </Button>
                <Button type="button" variant="secondary" className="font-bold rounded-xl text-xs h-11" onClick={downloadSvg}>
                  <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
                  SVG
                </Button>
                <Button type="button" variant="secondary" className="font-bold rounded-xl text-xs h-11" onClick={downloadPdf}>
                  <Download className="w-3.5 h-3.5 mr-1 shrink-0" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-10">
          {[
            {
              icon: LineChart,
              title: 'Measurable funnel',
              body: 'Position QR, landing, and Google opens as review velocity KPIs alongside GBP audits and rank tracking.',
            },
            {
              icon: Shield,
              title: 'Trust and compliance',
              body: 'No auto-posting. AI lines are suggestions; customers edit and post under their own Google account.',
            },
            {
              icon: Sparkles,
              title: 'Resilient UX',
              body: 'If AI or the database hiccups, the primary CTA to the official writereview URL for the resolved place_id still works.',
            },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="max-w-3xl mx-auto mt-16 rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 leading-relaxed font-medium">
          <h3 className="text-slate-900 font-black text-base mb-3">Non-goals (set client expectations)</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Does not auto-post reviews or bypass Google authentication.</li>
            <li>Does not guarantee stars or removal of negative reviews.</li>
            <li>Does not scrape competitor reviews to misrepresent experiences.</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
