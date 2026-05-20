'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowUpRight, MapPin, BarChart3, Zap, ChevronDown, Star, ArrowRight, Check, TrendingUp, Shield, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import VisualDashboard from '@/components/VisualDashboard'
import LogoMarquee from '@/components/LogoMarquee'
import { useLocale } from '@/lib/use-locale'

const stats = [
  { value: '94%', label: 'Average ranking improvement' },
  { value: '12K+', label: 'Locations tracked globally' },
  { value: '90', label: 'Day guarantee' },
  { value: '3.2×', label: 'More leads on average' },
]

const features = [
  {
    number: '01',
    title: 'Geo-Grid Intelligence',
    body: 'Visualize your exact map-pack position across every block of your service area. Not averages — precise coordinates.',
    icon: MapPin,
    accent: '#0066FF',
  },
  {
    number: '02',
    title: 'Rank Velocity Tracking',
    body: 'Watch competitor movement in real time. Know who is climbing before they outrank you.',
    icon: TrendingUp,
    accent: '#7C3AED',
  },
  {
    number: '03',
    title: 'White-Label Reports',
    body: 'Client-ready deliverables that communicate authority. Branded, beautiful, and shareable in one click.',
    icon: BarChart3,
    accent: '#059669',
  },
  {
    number: '04',
    title: 'GBP Automation',
    body: 'Schedule posts, manage media, and optimize your Google Business Profile from a single unified command center.',
    icon: Zap,
    accent: '#D97706',
  },
]

const plans = [
  {
    id: 'trial',
    name: 'Trial',
    tagline: 'Zero risk',
    price: 0,
    priceINR: 0,
    period: '7 days free',
    features: ['300 Credits', '5-Mile scan radius', 'Heatmap dashboard', 'AI QR Scanner', 'Free website'],
    cta: 'Start Free',
  },
  {
    id: 'advance',
    name: 'Advance',
    tagline: 'Most popular',
    price: 499,
    priceINR: 15000,
    period: 'per month',
    highlight: true,
    features: ['1,200 Credits', '5-Mile scan radius', '10 Keywords tracked', 'Local Pack Rank Tracker', 'GMB Rank Top', 'Heatmap dashboard', 'Free website'],
    cta: 'Start Now',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For agencies',
    price: 799,
    priceINR: 40000,
    period: 'per month',
    features: ['2,400 Credits', '10-Mile scan radius', '15 Keywords tracked', 'Local Pack Rank Tracker', 'GMB Rank Top', 'Heatmap dashboard', 'Free website'],
    cta: 'Start Now',
  },
  {
    id: 'proplus',
    name: 'Pro+',
    tagline: 'Scale without limits',
    price: 1299,
    priceINR: 60000,
    period: 'per month',
    features: ['5,000 Credits', '20-Mile scan radius', '20 Keywords tracked', 'Local Pack Rank Tracker', 'GMB Rank Top', 'Heatmap dashboard', 'Free website'],
    cta: 'Start Now',
  },
]

const testimonials = [
  {
    quote: 'The dashboard is clean, fast, and makes local ranking conversations much easier with clients.',
    author: 'Raymond Bonifacio',
    role: 'Founder, SEOrcerer Digital',
    rating: 5,
  },
  {
    quote: 'We moved from scattered tools to one workflow and now reporting takes a fraction of the time.',
    author: 'Brian Higgins',
    role: 'CEO, The Brand Sherpas',
    rating: 5,
  },
  {
    quote: 'Visibility improved because decisions got clearer. Every week we know exactly what to fix next.',
    author: 'Alfredo Delgado',
    role: 'Director, PurposeMind',
    rating: 5,
  },
]

export default function HomePage() {
  const { data: session } = useSession()
  const [isAnnual, setIsAnnual] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const { isIndia } = useLocale()
  const heroRef = useRef(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getPrice = (plan) => {
    const base = isIndia ? plan.priceINR : plan.price
    if (isAnnual && base > 0) return Math.round(base * 0.833)
    return base
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }

        .font-display {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
        }

        /* Subtle dot grid background */
        .dot-grid {
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Hero tint */
        .hero-tint {
          background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(219, 234, 254, 0.6) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 30% at 85% 60%, rgba(237, 233, 254, 0.4) 0%, transparent 60%);
        }

        /* Accent line — replaces glow */
        .accent-line {
          height: 2px;
          background: linear-gradient(90deg, #2563EB, #7C3AED);
          border-radius: 999px;
        }

        /* Cards */
        .card-base {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .card-base:hover {
          border-color: #93c5fd;
          box-shadow: 0 4px 24px rgba(37, 99, 235, 0.07);
        }
        .card-highlight {
          background: #EFF6FF;
          border: 1.5px solid #2563EB;
        }
        .card-highlight:hover {
          box-shadow: 0 4px 32px rgba(37, 99, 235, 0.12);
        }

        /* Section label */
        .section-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #2563EB;
        }

        /* Feature pill */
        .feature-pill {
          transition: background 0.25s ease;
        }
        .feature-pill:hover {
          background: #F1F5F9;
        }
        .feature-pill.active {
          background: #EFF6FF;
        }

        /* Plan card transitions */
        .plan-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .plan-card:hover {
          transform: translateY(-3px);
        }

        /* Marquee */
        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Fade-up entrance */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.12s; }
        .delay-2 { animation-delay: 0.24s; }
        .delay-3 { animation-delay: 0.36s; }
        .delay-4 { animation-delay: 0.48s; }

        /* Toggle */
        .toggle-track {
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
        }

        /* Guarantee ring */
        .guarantee-ring {
          border: 2px solid #2563EB;
          background: #EFF6FF;
        }

        /* Divider */
        .divider { border-color: #F1F5F9; }

        /* Heading scale — comfortable, not compressed */
        .h-display {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        /* Body text rhythm */
        .body-lg {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: #64748B;
          font-weight: 400;
        }

        /* Stat ticker text */
        .stat-value {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          color: #1E293B;
        }
        .stat-label {
          font-size: 0.8125rem;
          color: #94A3B8;
          font-weight: 400;
        }

        /* Subtle shadow for dashboard card */
        .dashboard-shell {
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 40px rgba(0,0,0,0.06);
        }

        /* Blue primary button */
        .btn-primary {
          background: #2563EB;
          color: #ffffff;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }

        /* Ghost button */
        .btn-ghost {
          border: 1px solid #CBD5E1;
          color: #475569;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .btn-ghost:hover {
          border-color: #2563EB;
          color: #2563EB;
        }
      `}</style>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-tint" />
        <div className="absolute inset-0 dot-grid opacity-40" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6">
          {/* Label pill */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Local SEO Intelligence Platform
            </span>
          </div>

          {/* Headline */}
          <div className="mt-8 animate-fade-up delay-1">
            <h1 className="h-display text-[clamp(44px,7vw,80px)] text-slate-900 max-w-3xl">
              Dominate Google Maps.{' '}
              <span className="text-blue-600 italic">In 90 Days.</span>
            </h1>
          </div>

          {/* Sub */}
          <div className="mt-6 animate-fade-up delay-2 max-w-lg">
            <p className="body-lg">
              Geo-grid scanning, GBP automation, and competitor tracking — unified in one platform built for agencies and local businesses that refuse to lose.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up delay-3">
            <Link href={session ? '/dashboard' : '/register'}>
              <button className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold">
                {session ? 'Open Dashboard' : 'Start Free — 7 Days'}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="#pricing">
              <button className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium bg-white">
                See pricing
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap items-center gap-6 animate-fade-up delay-4">
            <div className="flex -space-x-2">
              {['#FBBF24','#60A5FA','#34D399','#F87171'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{background:c}}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-slate-400 text-sm ml-1">12,000+ locations tracked</span>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── STATS TICKER ──────────────────────────────────────── */}
      <section className="py-5 border-y border-slate-100 bg-slate-50 overflow-hidden">
        <div className="flex">
          <div className="marquee-track whitespace-nowrap">
            {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
              <div key={i} className="inline-flex items-center gap-6 px-10">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
                <span className="text-slate-200 text-lg mx-2">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="section-label mb-3">Platform Preview</div>
          <h2 className="h-display text-3xl md:text-4xl text-slate-900 mb-12">
            Everything in one view
          </h2>
          <div className="dashboard-shell rounded-2xl overflow-hidden bg-white">
            <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-400 tracking-wide">TopRank AI — Live Dashboard</span>
            </div>
            <div className="p-2 md:p-4">
              <VisualDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t divider bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">

            {/* Left */}
            <div className="lg:sticky lg:top-32">
              <div className="section-label mb-3">Core Capabilities</div>
              <h2 className="h-display text-4xl md:text-5xl text-slate-900 leading-tight mb-10">
                Built for performance,<br />not complexity.
              </h2>
              <div className="space-y-1">
                {features.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`feature-pill w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl ${activeFeature === i ? 'active' : ''}`}
                  >
                    <span className="text-xs font-mono text-slate-300">{f.number}</span>
                    <span className={`text-sm font-medium transition-colors ${activeFeature === i ? 'text-blue-600' : 'text-slate-400'}`}>{f.title}</span>
                    {activeFeature === i && <div className="ml-auto w-1 h-4 rounded-full" style={{background: f.accent}} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 border transition-all duration-500 bg-white ${activeFeature === i ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.99]'}`}
                  style={{
                    borderColor: activeFeature === i ? `${f.accent}40` : '#E5E7EB',
                    boxShadow: activeFeature === i ? `0 4px 24px ${f.accent}12` : 'none',
                  }}
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{background:`${f.accent}12`,border:`1px solid ${f.accent}25`}}>
                      <f.icon className="w-5 h-5" style={{color: f.accent}} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base mb-2">{f.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm">{f.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE BAND ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center border-2 border-white/30 bg-white/10 text-center">
                <span className="font-display text-3xl md:text-4xl text-white" style={{fontFamily:'Instrument Serif, serif'}}>90</span>
                <span className="text-[10px] uppercase tracking-widest text-white/60 mt-0.5">Day</span>
                <span className="text-[10px] uppercase tracking-widest text-white/90">Guarantee</span>
              </div>
            </div>
            <div>
              <h2 className="h-display text-3xl md:text-4xl text-white mb-4">
                Top 5 on Google Maps or we work for free.
              </h2>
              <p className="text-blue-100 text-base leading-relaxed max-w-2xl">
                We put our reputation behind every campaign. If your business doesn't reach the top 5 positions in local map pack within 90 days, we continue working at no additional cost until it does.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                {['No contracts', 'No hidden fees', 'No excuses'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-100">
                    <Shield className="w-4 h-4 text-white" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-6 border-t divider bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="section-label mb-3">Social Proof</div>
          <div className="flex items-end justify-between mb-12 gap-4">
            <h2 className="h-display text-3xl md:text-4xl text-slate-900">
              Teams that trust<br />the platform
            </h2>
            <div className="text-right hidden md:block">
              <div className="h-display text-4xl text-slate-900" style={{fontFamily:'Instrument Serif, serif'}}>4.9</div>
              <div className="flex items-center gap-0.5 justify-end mt-1">
                {[1,2,3,4,5].map(s=><Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="text-slate-400 text-xs mt-1">Average rating</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="card-base plan-card rounded-2xl p-7">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({length:t.rating}).map((_,j)=>(
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-sm mb-6">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{t.author}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t divider bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="section-label mb-3">Pricing</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <h2 className="h-display text-3xl md:text-4xl text-slate-900">
              Transparent pricing.<br />No surprises.
            </h2>

            {/* Toggle */}
            <div className="toggle-track inline-flex items-center rounded-full p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >Monthly</button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                Annual
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-600">–17%</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const price = getPrice(plan)
              return (
                <div key={plan.id} className={`plan-card rounded-2xl p-7 flex flex-col ${plan.highlight ? 'card-highlight' : 'card-base bg-white'}`}>
                  {plan.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4 w-fit bg-blue-100 text-blue-600">
                      <Zap className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  <div className="mb-1 text-slate-400 text-xs font-medium uppercase tracking-wider">{plan.tagline}</div>
                  <div className="text-lg font-semibold text-slate-900 mb-4">{plan.name}</div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="h-display text-4xl text-slate-900" style={{fontFamily:'Instrument Serif, serif'}}>
                      {price === 0 ? 'Free' : `${isIndia ? '₹' : '$'}${price.toLocaleString()}`}
                    </span>
                    {price > 0 && <span className="text-slate-400 text-sm">/mo</span>}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{color: plan.highlight ? '#2563EB' : '#059669'}} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={session ? '/dashboard' : '/register'} className="block">
                    <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${plan.highlight ? 'btn-primary' : 'btn-ghost bg-white'}`}>
                      {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8 tracking-wider">7-day free trial · No credit card required · Cancel anytime</p>
        </div>
      </section>

      <LogoMarquee />

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 border-t divider bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-3">Get Started</div>
              <h2 className="h-display text-4xl md:text-5xl text-slate-900 leading-tight mb-6">
                Ready to own<br />your local market?
              </h2>
              <p className="body-lg mb-10">
                Join thousands of agencies and local businesses using TopRank AI to make confident, data-driven decisions every week.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  {icon: Globe2, label:'Precise Geo-Grid Tracking'},
                  {icon: BarChart3, label:'White-Label Reports'},
                  {icon: Shield, label:'Competitor Intelligence'},
                  {icon: Zap, label:'Live in minutes'},
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-100">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8 bg-slate-50 border border-slate-100">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}