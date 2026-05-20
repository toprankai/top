'use client'

import VisualDashboard from '@/components/VisualDashboard'

/**
 * Same live-dashboard preview block as the home page (Platform Preview + VisualDashboard).
 */
export default function GeoGridDashboardPreview() {
  return (
    <section className="w-full border-t border-slate-200 bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="section-label mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Platform Preview
        </div>
        <h2 className="mb-10 font-sans text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Everything in one view
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-3 text-xs tracking-wide text-slate-400">
              TopRank AI · Live Dashboard
            </span>
          </div>
          <div className="p-2 md:p-4">
            <VisualDashboard />
          </div>
        </div>
      </div>
    </section>
  )
}
