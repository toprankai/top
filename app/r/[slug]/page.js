'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  Loader2,
  MapPin,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function ReviewHelperLandingPage() {
  const { slug } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [linesLoading, setLinesLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const initRef = useRef(false)

  const track = useCallback(async (event) => {
    try {
      await fetch('/api/ai-qr/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, event }),
      })
    } catch {
      /* non-blocking */
    }
  }, [slug])

  const loadCampaign = useCallback(async () => {
    if (!slug) return
    try {
      setLoading(true)
      const res = await fetch(`/api/ai-qr/campaigns/${slug}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Not found')
      setCampaign(data.campaign)
      if (typeof document !== 'undefined' && data.campaign?.businessName) {
        document.title = `${data.campaign.businessName} · Leave a review`
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  const loadLines = useCallback(async () => {
    if (!slug) return
    try {
      setLinesLoading(true)
      const res = await fetch('/api/ai-qr/review-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, count: 4 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Suggestions unavailable')
      setLines(data.lines || [])
    } catch (e) {
      toast.error(e.message)
      setLines([])
    } finally {
      setLinesLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadCampaign()
  }, [loadCampaign])

  useEffect(() => {
    if (!slug || loading || error || initRef.current) return
    initRef.current = true
    track('scan')
    loadLines()
  }, [slug, loading, error, track, loadLines])

  const copyLine = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      toast.success('Copied — paste into Google after you tap the button below.')
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch {
      toast.error('Could not copy. Select the text manually.')
    }
  }

  const openGoogleReviews = () => {
    if (!campaign?.googleReviewUrl) return
    track('google_open')
    window.open(campaign.googleReviewUrl, '_blank', 'noopener,noreferrer')
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <p className="text-slate-400 text-sm font-medium mb-2">Review helper</p>
        <h1 className="text-white text-xl font-bold mb-2">Link not found</h1>
        <p className="text-slate-500 text-sm max-w-xs">{error}</p>
      </div>
    )
  }

  if (loading || !campaign) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400" aria-label="Loading" />
      </div>
    )
  }

  const primary = campaign.brandColor || '#059669'
  const reviewHref = campaign.googleReviewUrl

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 pb-36">
      <header className="px-5 pt-8 pb-6 border-b border-slate-800/80">
        {campaign.isDemo && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-amber-100/90 text-xs font-medium leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            Demo: Maps button uses a shared sample listing for QA. Production campaigns open only your verified business.
          </div>
        )}
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Thank you for visiting</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{campaign.businessName}</h1>
        {campaign.address ? (
          <p className="mt-2 flex items-start gap-2 text-slate-400 text-sm">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            {campaign.address}
          </p>
        ) : null}
        {campaign.primaryType ? (
          <p className="mt-2 text-slate-500 text-xs capitalize">{String(campaign.primaryType).replace(/_/g, ' ')}</p>
        ) : null}
        {campaign.rating > 0 && (
          <p className="mt-2 text-sm text-slate-400">
            Google rating snapshot: <span className="text-slate-200 font-semibold">{campaign.rating}</span>
            {campaign.reviewCount ? (
              <span className="text-slate-500"> · {campaign.reviewCount} reviews</span>
            ) : null}
          </p>
        )}
        {campaign.summary ? (
          <p className="mt-4 text-sm text-slate-400 leading-relaxed border-l-2 border-slate-700 pl-3">{campaign.summary}</p>
        ) : null}
      </header>

      <div className="px-5 pt-6 space-y-3">
        <p className="text-slate-400 text-sm leading-relaxed">
          If you had a good experience, leaving a short Google review helps others discover this business. Tap below to
          open Google — you sign in and post yourself.
        </p>
      </div>

      <section className="px-5 mt-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Optional: copy a draft (edit before posting)
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          These lines are AI-assisted writing suggestions only. They are not posted automatically, and you should edit
          them to reflect your real experience.
        </p>

        {linesLoading && !lines.length ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-900/80 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {lines.map((line, idx) => (
              <li
                key={`${idx}-${line.slice(0, 12)}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-inner"
              >
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{line}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copyLine(line, idx)}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors border border-slate-700 text-slate-200 hover:bg-slate-800"
                    style={{
                      borderColor: copiedIdx === idx ? primary : undefined,
                      color: copiedIdx === idx ? primary : undefined,
                    }}
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIdx === idx ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          disabled={linesLoading}
          onClick={() => loadLines()}
          className="w-full h-12 rounded-2xl border-slate-700 text-slate-200 hover:bg-slate-900"
        >
          {linesLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Generate more suggestions
        </Button>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <Button
          type="button"
          disabled={!reviewHref}
          onClick={openGoogleReviews}
          className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-black/40 border-0"
          style={{ backgroundColor: primary, color: '#fff' }}
        >
          Open Google Reviews
          <ExternalLink className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-center text-[10px] text-slate-600 mt-2 px-2">
          Opens Google’s review flow in a new tab. You must be signed in to Google to post.
        </p>
      </div>
    </div>
  )
}
