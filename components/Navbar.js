'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Menu, X, LayoutDashboard, ChevronDown,
  Dumbbell, Stethoscope, Coffee, Scissors, Utensils,
  Bug, Wrench, Plane, HeartPulse, Hammer,
  ShieldCheck, Calendar, ArrowUpRight,
  Grid3x3, LineChart, Users, ClipboardList,
} from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { services } from '@/lib/services'
import { useSettings } from '@/components/providers'

// Public env so this client component can read it.
// Set in `.env` as:
// NEXT_PUBLIC_CALENDLY_BOOKING_URL="https://calendly.com/<your-handle>/<event>"
const CALENDLY_BOOKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_BOOKING_URL || 'https://calendly.com/toprankai/30min'

/** Delay before closing so brief pointer gaps (between trigger and panel) do not flash the menu closed */
const DROPDOWN_CLOSE_MS = 280

const iconMap = {
  Dumbbell,
  Stethoscope,
  Coffee,
  Scissors,
  Utensils,
  Bug,
  Wrench,
  Plane,
  HeartPulse,
  Hammer,
}

/** Product capabilities — public pages; each page links into the matching dashboard tool. */
const AI_SERVICES = [
  {
    label: 'Geo-Grid Heatmaps',
    desc: 'Map-pack visibility across every coordinate in your service area',
    href: '/geo-grid-heatmaps',
    Icon: Grid3x3,
  },
  {
    label: 'Rank Tracking',
    desc: 'Monitor local pack positions and keyword performance',
    href: '/rank-tracking',
    Icon: LineChart,
  },
  {
    label: 'Competitor analysis',
    desc: 'Benchmark your profile against nearby businesses',
    href: '/competitor-analysis',
    Icon: Users,
  },
  {
    label: 'Listing Management',
    desc: 'Citations, directories, and consistent NAP across the web',
    href: '/listing-management',
    Icon: ClipboardList,
  },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAiServicesOpen, setMobileAiServicesOpen] = useState(false)
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false)
  const [aiServicesMenuOpen, setAiServicesMenuOpen] = useState(false)
  const [industriesMenuOpen, setIndustriesMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { settings } = useSettings()

  const aiServicesCloseTimerRef = useRef(null)
  const industriesCloseTimerRef = useRef(null)

  const clearAiServicesCloseTimer = () => {
    if (aiServicesCloseTimerRef.current) {
      clearTimeout(aiServicesCloseTimerRef.current)
      aiServicesCloseTimerRef.current = null
    }
  }

  const clearIndustriesCloseTimer = () => {
    if (industriesCloseTimerRef.current) {
      clearTimeout(industriesCloseTimerRef.current)
      industriesCloseTimerRef.current = null
    }
  }

  const onAiServicesEnter = () => {
    clearAiServicesCloseTimer()
    setAiServicesMenuOpen(true)
  }

  const onAiServicesLeave = () => {
    clearAiServicesCloseTimer()
    aiServicesCloseTimerRef.current = setTimeout(() => {
      setAiServicesMenuOpen(false)
      aiServicesCloseTimerRef.current = null
    }, DROPDOWN_CLOSE_MS)
  }

  const onIndustriesEnter = () => {
    clearIndustriesCloseTimer()
    setIndustriesMenuOpen(true)
  }

  const onIndustriesLeave = () => {
    clearIndustriesCloseTimer()
    industriesCloseTimerRef.current = setTimeout(() => {
      setIndustriesMenuOpen(false)
      industriesCloseTimerRef.current = null
    }, DROPDOWN_CLOSE_MS)
  }

  useEffect(() => {
    return () => {
      clearAiServicesCloseTimer()
      clearIndustriesCloseTimer()
    }
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileAiServicesOpen(false)
      setMobileIndustriesOpen(false)
    }
  }, [mobileMenuOpen])

  const branding = settings?.branding || {
    appName: 'TopRank AI',
    logoUrl: '/logo.png',
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        mobileMenuOpen
          ? 'bg-white'
          : 'bg-white/80 backdrop-blur-xl border-b border-slate-100'
      }`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
          background: rgba(255,255,255,0.85);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          transition: all 0.2s ease;
          cursor: pointer;
          line-height: 1;
          text-decoration: none;
        }
        .nav-pill:hover {
          border-color: #93c5fd;
          background: #EFF6FF;
          color: #2563EB;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        }
        .nav-btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 8px 22px;
          border-radius: 999px;
          border: 1px solid #CBD5E1;
          background: transparent;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-btn-ghost:hover {
          border-color: #2563EB;
          color: #2563EB;
        }
        .nav-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 24px;
          border-radius: 999px;
          background: #2563EB;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-btn-primary:hover {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.3);
        }
        .nav-btn-meeting {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid #2563EB;
          background: transparent;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #2563EB;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-btn-meeting:hover {
          background: #2563EB;
          color: #ffffff;
        }
        .new-badge {
          font-size: 10px;
          font-weight: 700;
          background: #DBEAFE;
          color: #1D4ED8;
          padding: 2px 7px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        /* Hit area under trigger: padding fills the gap so pointer never "leaves" the wrapper between button and panel */
        .nav-dropdown-root {
          position: absolute;
          left: 0;
          top: 100%;
          padding-top: 10px;
          z-index: 60;
          min-width: 100%;
        }
        .nav-dropdown-root--center {
          left: 50%;
          transform: translateX(-50%);
          min-width: min(520px, calc(100vw - 32px));
        }
        .dropdown-menu {
          position: relative;
          left: auto;
          top: auto;
          z-index: 60;
          min-width: 180px;
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .dropdown-item {
          display: block;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .dropdown-menu--ai {
          min-width: 300px;
          max-width: min(340px, calc(100vw - 32px));
          padding: 8px;
        }
        .ai-service-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .ai-service-item:hover {
          background: #EFF6FF;
        }
        .ai-service-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #EFF6FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563EB;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .ai-service-item:hover .ai-service-icon {
          background: #2563EB;
          color: #ffffff;
        }
        .ai-service-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 3px;
          line-height: 1.25;
        }
        .ai-service-desc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #94A3B8;
          margin: 0;
          line-height: 1.35;
        }
        .services-mega {
          position: relative;
          left: auto;
          top: auto;
          transform: none;
          z-index: 60;
          width: 100%;
          max-height: min(420px, 70vh);
          overflow-x: hidden;
          overflow-y: auto;
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 640px) {
          .services-mega { grid-template-columns: 1fr; }
        }
        .service-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 10px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s ease;
          min-height: 0;
        }
        .service-item:hover {
          background: #EFF6FF;
        }
        .service-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #EFF6FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563EB;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .service-item:hover .service-icon {
          background: #2563EB;
          color: #ffffff;
        }
        .service-item-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          margin: 0 0 4px;
          line-height: 1.25;
        }
        .service-item-desc {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #94A3B8;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mobile-services-panel {
          margin-top: 6px;
          margin-bottom: 4px;
          padding: 6px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mobile-service-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .mobile-service-row:hover {
          background: #EFF6FF;
        }
        .mobile-service-row .service-icon {
          width: 32px;
          height: 32px;
        }
        .mobile-link {
          display: block;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .mobile-link:hover {
          background: #F8FAFC;
          color: #2563EB;
        }
      `}</style>

      <nav className="container mx-auto px-6 h-[72px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src={branding.logoUrl || '/logo.png'}
            alt={branding.appName || 'TopRank AI'}
            width={220}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">

          {/* AI Services — product capabilities */}
          <div
            className="relative"
            onMouseEnter={onAiServicesEnter}
            onMouseLeave={onAiServicesLeave}
          >
            <button type="button" className="nav-pill" aria-expanded={aiServicesMenuOpen} aria-haspopup="true">
              AI Services
              <ChevronDown
                style={{
                  width: 12,
                  height: 12,
                  transition: 'transform 0.2s',
                  transform: aiServicesMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {aiServicesMenuOpen && (
              <div className="nav-dropdown-root">
                <div className="dropdown-menu dropdown-menu--ai" role="menu">
                  {AI_SERVICES.map(({ label, desc, href, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="ai-service-item"
                      role="menuitem"
                    >
                      <div className="ai-service-icon">
                        <Icon style={{ width: 17, height: 17 }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p className="ai-service-title">{label}</p>
                        <p className="ai-service-desc">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Industries — marketing pages by business type (not “Services”) */}
          <div
            className="relative"
            onMouseEnter={onIndustriesEnter}
            onMouseLeave={onIndustriesLeave}
          >
            <button type="button" className="nav-pill" aria-expanded={industriesMenuOpen} aria-haspopup="true">
              Industries
              <ChevronDown
                style={{
                  width: 12,
                  height: 12,
                  transition: 'transform 0.2s',
                  transform: industriesMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {industriesMenuOpen && (
              <div className="nav-dropdown-root nav-dropdown-root--center">
                <div className="services-mega" role="menu">
                  {services.map((service) => {
                    const Icon = iconMap[service.icon] || HeartPulse
                    return (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="service-item"
                        role="menuitem"
                      >
                        <div className="service-icon">
                          <Icon style={{ width: 16, height: 16 }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="service-item-title">{service.title}</p>
                          <p className="service-item-desc">{service.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <Link href="/#pricing" className="nav-pill">Pricing</Link>

          <Link href="/ai-qr-code" className="nav-pill">
            AI QR Code
            <span className="new-badge">New</span>
          </Link>

          <Link href="/contact-us" className="nav-pill">Contact Us</Link>

          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn-meeting"
          >
            <Calendar style={{ width: 14, height: 14 }} />
            Book a Meeting
          </a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {session ? (
            <>
              {session.user?.role === 'admin' && (
                <Link href="/admin">
                  <button
                    className="nav-pill"
                    style={{ borderColor: '#6366F1', color: '#6366F1' }}
                  >
                    <ShieldCheck style={{ width: 14, height: 14 }} />
                    Admin
                  </button>
                </Link>
              )}
              <Link href="/dashboard">
                <button className="nav-btn-primary">
                  <LayoutDashboard style={{ width: 14, height: 14 }} />
                  Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="nav-btn-ghost">Log In</button>
              </Link>
              <Link href="/register">
                <button className="nav-btn-primary">
                  Get Started
                  <ArrowUpRight style={{ width: 14, height: 14 }} />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen
            ? <X style={{ width: 20, height: 20 }} />
            : <Menu style={{ width: 20, height: 20 }} />
          }
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-8 px-6 bg-white border-t border-slate-100 overflow-y-auto max-h-[80vh]">
          <div style={{ paddingTop: 20, paddingBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#CBD5E1', margin: '0 0 12px' }}>
              Navigate
            </p>
          </div>

          <Link href="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          {/* Mobile — AI Services */}
          <div>
            <button
              type="button"
              onClick={() => setMobileAiServicesOpen(!mobileAiServicesOpen)}
              className="mobile-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
              aria-expanded={mobileAiServicesOpen}
            >
              AI Services
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: mobileAiServicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {mobileAiServicesOpen && (
              <div className="mobile-services-panel">
                {AI_SERVICES.map(({ label, desc, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="mobile-service-row"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="ai-service-icon">
                      <Icon style={{ width: 15, height: 15 }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="ai-service-title">{label}</p>
                      <p className="ai-service-desc">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile — Industries (business types) */}
          <div>
            <button
              type="button"
              onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
              className="mobile-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
              aria-expanded={mobileIndustriesOpen}
            >
              Industries
              <ChevronDown
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                  transform: mobileIndustriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {mobileIndustriesOpen && (
              <div className="mobile-services-panel">
                {services.map((service) => {
                  const Icon = iconMap[service.icon] || HeartPulse
                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="mobile-service-row"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="service-icon">
                        <Icon style={{ width: 15, height: 15 }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p className="service-item-title">{service.title}</p>
                        <p className="service-item-desc">{service.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <Link href="/#pricing" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>

          <Link
            href="/ai-qr-code"
            className="mobile-link"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            AI QR Code
            <span className="new-badge">New</span>
          </Link>

          <Link href="/contact-us" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </Link>

          <a
            href={CALENDLY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              color: '#2563EB',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Calendar style={{ width: 16, height: 16 }} />
            Book a Meeting
          </a>

          {/* Mobile Auth */}
          <div style={{ paddingTop: 20, marginTop: 8, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {session ? (
              <>
                {session.user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className="nav-btn-ghost"
                      style={{ width: '100%', borderColor: '#6366F1', color: '#6366F1', gap: 8 }}
                    >
                      <ShieldCheck style={{ width: 16, height: 16 }} />
                      Admin Panel
                    </button>
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button className="nav-btn-primary" style={{ width: '100%', padding: '12px 24px' }}>
                    <LayoutDashboard style={{ width: 16, height: 16 }} />
                    Go to Dashboard
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#64748B', textDecoration: 'none', padding: '8px 0' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="nav-btn-primary" style={{ width: '100%', padding: '13px 24px', fontSize: 14 }}>
                    Get Started
                    <ArrowUpRight style={{ width: 16, height: 16 }} />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}