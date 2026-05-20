'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  LayoutDashboard,
  Grid3x3,
  LineChart,
  Users,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'

const ICONS = {
  grid: Grid3x3,
  chart: LineChart,
  users: Users,
  clipboard: ClipboardList,
}

/**
 * Public landing for a product area; primary CTA goes to the matching dashboard route.
 */
export default function MarketingAiServicePage({
  title,
  eyebrow = 'AI Services',
  intro,
  subIntro,
  bullets = [],
  features = [],
  steps = [],
  dashboardHref,
  iconKey,
  children,
}) {
  const Icon = iconKey ? ICONS[iconKey] : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-[72px]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.08),transparent)]" />
          <div className="container relative mx-auto max-w-5xl px-6 pt-5 pb-12 md:pt-6 md:pb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
              {Icon ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
              ) : null}
              {eyebrow}
            </div>
            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>
            {subIntro ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">{subIntro}</p>
            ) : null}

            {bullets.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {bullets.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 font-bold shadow-lg shadow-blue-500/15">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Open in dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-slate-200 font-semibold">
                <Link href="/register">Start free trial</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Sign in to use dashboard tools.{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
              {' · '}
              <Link href="/contact-us" className="font-semibold text-blue-600 hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </section>

        {/* Feature cards */}
        {features.length > 0 && (
          <section className="border-b border-slate-200 bg-slate-50 py-16 md:py-20">
            <div className="container mx-auto max-w-5xl px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Capabilities</p>
              <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                Built for local SEO that needs proof, not guesses
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        {steps.length > 0 && (
          <section className="border-b border-slate-200 bg-white py-16 md:py-20">
            <div className="container mx-auto max-w-5xl px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Workflow</p>
              <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                How it works in TopRank AI
              </h2>
              <ol className="mt-10 space-y-6">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {children}

        {/* Bottom CTA */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 text-white md:py-20">
          <div className="container mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-sans text-2xl font-extrabold tracking-tight md:text-3xl">
              Ready to see it on your listings?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-blue-100">
              Start with a free trial, connect your business, and open the matching dashboard tool in minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 rounded-xl bg-white font-bold text-blue-700 hover:bg-blue-50">
                <Link href={dashboardHref}>Go to dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-white/40 bg-transparent font-semibold text-white hover:bg-white/10"
              >
                <Link href="/register">Create free account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
