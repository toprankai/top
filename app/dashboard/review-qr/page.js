'use client'

import Link from 'next/link'
import { ArrowLeft, QrCode } from 'lucide-react'
import ReviewQrProductionPanel from '@/components/review-qr/ReviewQrProductionPanel'

export default function DashboardReviewQrPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-16">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <QrCode className="w-4 h-4" />
            Review QR
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Google review campaigns</h1>
          <p className="text-slate-600 font-medium mt-2 max-w-2xl">
            Search with Google Places (New), confirm the listing, then save. You will get a hosted landing page at{' '}
            <code className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-sm">/r/your-slug</code> plus
            printable QR files for table tents, receipts, or window stickers.
          </p>
        </div>
        <Link
          href="/ai-qr-code"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 shrink-0 underline-offset-4 hover:underline"
        >
          View public feature overview
        </Link>
      </div>

      <ReviewQrProductionPanel />
    </div>
  )
}
