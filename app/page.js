 'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowRight, Check, Globe, Layers3, LineChart, MessageSquare, Rocket, Settings, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import VisualDashboard from '@/components/VisualDashboard'
import LogoMarquee from '@/components/LogoMarquee'
import { useLocale } from '@/lib/use-locale'

const pillars = [
  {
    title: 'Get more local visibility',
    description: 'Run precise geo-grid scans, monitor ranking movement, and identify high-value opportunities faster.',
    icon: Globe,
  },
  {
    title: 'Convert more qualified leads',
    description: 'Turn insights into actions with cleaner reporting, better positioning, and clearer local SEO direction.',
    icon: LineChart,
  },
  {
    title: 'Operate from one platform',
    description: 'Track rankings, manage data, and deliver updates from one consolidated dashboard experience.',
    icon: Layers3,
  },
]

const featureCards = [
  {
    title: 'Google Business Profile management',
    copy: 'Create, schedule, and optimize GBP activity in one place.',
    bullets: ['Unified dashboard', 'Bulk media workflows', 'Publishing calendar'],
  },
  {
    title: 'Local rank tracking',
    copy: 'Measure exact map-pack position across your service area with clarity.',
    bullets: ['Grid-based tracking', 'Competitor visibility map', 'Position trend insights'],
  },
  {
    title: 'Client-ready reporting',
    copy: 'Share white-label deliverables that make performance easy to understand.',
    bullets: ['Branded report exports', 'Shareable links', 'Executive summary views'],
  },
  {
    title: 'Competitive intelligence',
    copy: 'Spot movement early and prioritize the actions that protect your rankings.',
    bullets: ['Competitor movement signals', 'Gap detection', 'High-impact alerts'],
  },
]

const testimonials = [
  {
    quote: 'The dashboard is clean, fast, and makes local ranking conversations much easier with clients.',
    author: 'Raymond Bonifacio',
    company: 'SEOrcerer Digital',
  },
  {
    quote: 'We moved from scattered tools to one workflow and now reporting takes a fraction of the time.',
    author: 'Brian Higgins',
    company: 'The Brand Sherpas',
  },
  {
    quote: 'Visibility improved because decisions got clearer. Every week we know exactly what to fix next.',
    author: 'Alfredo Delgado',
    company: 'PurposeMind',
  },
]

export default function HomePage() {
  const { data: session } = useSession()
  const [isAnnual, setIsAnnual] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const { isIndia } = useLocale()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#f6f8ff]" suppressHydrationWarning>
      <Navbar />

      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-300/25 blur-3xl" />
          <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-indigo-300/20 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="w-4 h-4" />
            Local SEO platform for modern teams
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-black leading-tight text-slate-900 tracking-tight">
          <span className="text-blue-600"> Top 5 </span>Position in Google <span className="text-blue-600"> Maps </span>in <span className="text-blue-600"> 90 Days</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            A completely refreshed experience designed for clarity. Track rankings, manage GBP activity, and deliver stronger local SEO outcomes without changing your existing workflow.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={session ? '/dashboard' : '/register'}>
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 px-10 py-7 text-base font-bold text-white shadow-lg shadow-blue-200">
                {session ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-10 py-7 text-base font-bold text-slate-700">
                View pricing
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-500">7-day free trial, no credit card required</p>
        </div>
      </section>


      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-3 md:p-4 shadow-2xl shadow-slate-200/70">
            <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
              Live Scan View - TopRank AI
            </div>
            <VisualDashboard />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900">A neater layout, the same powerful features</h2>
            <p className="mt-4 text-slate-600 text-lg">
              TopRank AI keeps all the capabilities you already use, now packaged in a cleaner and easier-to-scan interface.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md shadow-slate-100">
                <h3 className="text-2xl font-extrabold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-slate-600">{card.copy}</p>
                <ul className="mt-5 space-y-2">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-900 to-blue-950 p-10 md:p-14 text-white">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl font-black leading-tight">Built for agencies and growth-focused local businesses</h2>
                <p className="mt-4 text-blue-100 text-lg">
                  Keep your entire local SEO execution stack aligned, from ranking insight to client communication.
                </p>
                <div className="mt-7 space-y-3">
                  {[
                    'No feature cuts, only UI/UX improvements',
                    'Faster visual scanning across key workflows',
                    'More polished structure inspired by modern SaaS landing pages',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-blue-50">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-white/10 border border-white/20 p-6">
                <div className="text-sm uppercase tracking-wide text-blue-100 font-bold">Workflow highlight</div>
                <div className="mt-4 space-y-3">
                  {['Scan your locations', 'Track movement by zone', 'Build branded reports', 'Share wins with clients'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                      <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-black">{i + 1}</div>
                      <p className="font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900">What customers are saying</h2>
            <p className="mt-4 text-lg text-slate-600">Real teams using TopRank AI to improve local search outcomes and reporting clarity.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <article key={item.author} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <p className="mt-4 text-slate-700 leading-relaxed">"{item.quote}"</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="font-bold text-slate-900">{item.author}</p>
                  <p className="text-sm text-slate-500">{item.company}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#050B1B] relative overflow-hidden">
        {/* Starry Background Effect */}
        <div className="absolute inset-0 z-0 opacity-40">
          {hasMounted && Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
              Know Exactly Where You Rank—and Why
            </h2>
            <p className="text-lg text-slate-400 font-bold mb-8 opacity-70">
              Built for teams who need answers, not noise.
            </p>
            <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-12">
              **7-day free trial, no credit card required
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full flex gap-1.5 border border-white/5 shadow-2xl">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-8 py-2.5 rounded-full text-[13px] font-black transition-all duration-500 ${!isAnnual ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-8 py-2.5 rounded-full text-[13px] font-black transition-all duration-500 flex items-center gap-3 ${isAnnual ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                >
                  Annual
                  <span className="bg-emerald-500 text-white text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black animate-pulse">2 mo FREE</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                id: 'plan_trial',
                name: "7-Day Trial",
                desc: "Try it for free",
                icon: <Settings className="w-6 h-6 text-blue-500" />,
                price: "0",
                priceINR: 0,
                features: ["5 Miles Google Map Pack Ranking", "300 Credits", "7 Days Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "Google Pack Rank Tracker"],
                color: "bg-white",
                textColor: "text-slate-800"
              },
              {
                id: 'plan_lite',
                name: "Advance",
                desc: "Best for Local Owners",
                icon: <Rocket className="w-6 h-6 text-blue-600" />,
                price: "499",
                priceINR: 15000,
                popular: true,
                features: ["1200 Credits", "5 Miles", "1 Month Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "GMB Rank Top", "10 Keywords", "Local Pack Rank Tracker"],
                color: "bg-blue-50/95",
                textColor: "text-slate-900",
                badge: "Monthly"
              },
              {
                id: 'plan_pro',
                name: "Pro",
                desc: "Best for Agency Owners",
                icon: <Trophy className="w-6 h-6 text-blue-600" />,
                price: "799",
                priceINR: 40000,
                features: ["2400 Credits", "10 Miles", "3 Months Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "GMB Rank Top", "15 Keywords", "Local Pack Rank Tracker"],
                color: "bg-white",
                textColor: "text-slate-800"
              },
              {
                id: 'plan_pro_plus',
                name: "Pro Plus",
                desc: "Best for Agency Owners",
                icon: <Rocket className="w-6 h-6 text-blue-600" />,
                price: "1299",
                priceINR: 60000,
                popular: true,
                features: ["5000 Credits", "20 Miles", "1 Month Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "GMB Rank Top", "20 Keywords", "Local Pack Rank Tracker"],
                color: "bg-blue-50/95",
                textColor: "text-slate-900",
                badge: "Monthly"
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] group backdrop-blur-sm ${plan.popular ? 'border-2 border-blue-600 shadow-2xl shadow-blue-900/40 relative scale-[1.03]' : 'border border-white/10 bg-white/5 shadow-xl'}`}
              >
                {/* Visual Accent for Popular */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-4 right-[-30px] w-[140%] h-6 bg-blue-600 text-white text-[8px] font-black uppercase flex items-center justify-center rotate-45 shadow-lg tracking-widest px-4">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className={`p-8 flex flex-col h-full ${plan.popular ? plan.color : 'bg-white'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-500 shadow-inner">
                      {plan.icon}
                    </div>
                    <div className="text-[9px] font-black text-emerald-500 bg-emerald-50/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      7 day FREE
                    </div>
                  </div>

                  <h3 className={`text-2xl font-black ${plan.textColor} mb-1 tracking-tight`}>{plan.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-wider">{plan.desc}</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className={`text-5xl font-black ${plan.textColor}`}>
                      {isIndia ? '₹' : '$'}{isIndia ? plan.priceINR.toLocaleString('en-IN') : plan.price}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">/mo</span>
                  </div>

                  <div className="space-y-3.5 mb-10 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex gap-3 items-start group/feat">
                        <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-md border flex items-center justify-center transition-colors group-hover/feat:bg-blue-500 group-hover/feat:border-blue-500 ${plan.popular ? 'border-blue-600/30' : 'border-slate-200'}`}>
                          <Check className={`w-2.5 h-2.5 ${plan.popular ? 'text-blue-600' : 'text-slate-400'} group-hover/feat:text-white`} />
                        </div>
                        <span className={`text-[12px] font-bold leading-relaxed transition-all duration-300 ${plan.textColor} opacity-80 group-hover/feat:opacity-100 group-hover/feat:translate-x-0.5`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest pt-3 opacity-50">...and more</div>
                  </div>

                  <Link href={session ? "/dashboard" : "/register"} className="block">
                    <Button className={`w-full py-7 rounded-2xl text-base font-black transition-all shadow-xl group-hover:scale-[1.02] ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-100'}`}>
                      {session ? 'Go to Dashboard' : 'Start Now'} <span className="ml-3 transition-transform group-hover:translate-x-1.5">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="#" className="inline-flex items-center gap-3 text-white font-black text-lg hover:text-blue-400 transition-all group opacity-80 hover:opacity-100">
              See more plans <span className="text-xl transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      <LogoMarquee />
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                Trusted by growth-focused teams
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Ready to grow with <br />
                <span className="text-blue-600">TopRank AI?</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Keep your strategy data-first and your execution simple. Start using TopRank AI to make local SEO decisions with confidence.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: "Precise Tracking", desc: "Geo-grid accuracy" },
                  { title: "Agency Reports", desc: "White-label ready" },
                  { title: "Competitor Intel", desc: "Spot every gap" },
                  { title: "Quick Setup", desc: "Go live in minutes" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="font-black text-slate-900 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" /> {item.title}
                    </span>
                    <span className="text-sm text-slate-500 font-medium ml-6">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <LeadForm />
          </div>
        </div>
      </section>



      <Footer />
    </div>
  )
}
