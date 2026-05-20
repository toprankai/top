'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Check, CreditCard, Zap, Loader2, RefreshCw,
  Download, Mail, Shield, Calendar, Receipt, ChevronRight,
  Wallet, Clock, BadgeCheck,
  Settings,
  Rocket,
  Trophy
} from 'lucide-react'
import { toast } from 'sonner'

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

const PLAN_TIERS = {
  plan_trial: 0,
  plan_lite: 1,
  plan_pro: 2,
  plan_pro_plus: 3,
}

function normalizePlanKey(planId) {
  const id = (planId || 'plan_trial').toLowerCase()
  if (id.includes('pro_plus') || id.includes('pro plus')) return 'plan_pro_plus'
  if (id.includes('pro')) return 'plan_pro'
  if (id.includes('lite') || id.includes('advance')) return 'plan_lite'
  if (id.includes('trial')) return 'plan_trial'
  return 'plan_trial'
}

function getPlanTier(planId) {
  return PLAN_TIERS[normalizePlanKey(planId)] ?? 0
}

export default function BillingClient({ session: initialSession }) {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [billingData, setBillingData] = useState(null)
  const [billingLoading, setBillingLoading] = useState(true)

  useEffect(() => {
    fetchBillingDetails()
    const interval = setInterval(fetchBillingDetails, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleManualSync = async () => {
    setLoading('sync')
    try {
      await update()
      await fetchBillingDetails()
      toast.success('Account refreshed.')
    } catch (err) {
      toast.error('Failed to refresh account.')
    } finally {
      setLoading(null)
    }
  }

  const fetchBillingDetails = async () => {
    try {
      const res = await fetch(`/api/razorpay/billing?t=${Date.now()}`)
      if (res.ok) {
        const data = await res.json()
        setBillingData(data)

        // Auto-sync session if credits changed
        if (session?.user && data.user && data.user.credits !== session.user.credits) {
          update()
        }
      }
    } catch (err) {
      console.error('Failed to fetch billing details:', err)
    } finally {
      setBillingLoading(false)
    }
  }

  const plans = [
    {
      id: 'plan_trial',
      name: "7-Day Trial",
      desc: "Try it for free",
      duration: '7 Days',
      icon: <Settings className="w-6 h-6 text-blue-500" />,
      price: "0",
      priceUSD: 0,
      priceINR: 0,
      features: ["5 Miles Google Map Pack Ranking", "300 Credits", "7 Days Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "Google Pack Rank Tracker"],
      color: "bg-white",
      textColor: "text-slate-800"
    },
    {
      id: 'plan_lite',
      name: "Advance",
      desc: "Best for Local Owners",
      duration: '1 Month',
      icon: <Rocket className="w-6 h-6 text-blue-600" />,
      price: "499",
      priceUSD: 499,
      priceINR: 8000,
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
      duration: '3 Months',
      icon: <Trophy className="w-6 h-6 text-blue-600" />,
      price: "799",
      priceUSD: 799,
      priceINR: 40000,
      features: ["2400 Credits", "10 Miles", "3 Months Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "GMB Rank Top", "15 Keywords", "Local Pack Rank Tracker"],
      color: "bg-white",
      textColor: "text-slate-800"
    },
    {
      id: 'plan_pro_plus',
      name: "Pro Plus",
      desc: "Best for Agency Owners",
      duration: '3 Months',
      icon: <Rocket className="w-6 h-6 text-blue-600" />,
      price: "1299",
      priceUSD: 1299,
      priceINR: 60000,
      popular: true,
      features: ["5000 Credits", "20 Miles", "3 Months Access", "Heatmap Dashboard", "Free Website", "AI QR Scanner", "GMB Rank Top", "20 Keywords", "Local Pack Rank Tracker"],
      color: "bg-blue-50/95",
      textColor: "text-slate-900",
      badge: "Quarterly"
    }
  ]

  // Timer component for real-time countdown
  const ExpirationTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
      const calculate = () => {
        const now = new Date().getTime()
        const distance = new Date(endDate).getTime() - now

        if (distance < 0) {
          setTimeLeft('EXPIRED')
          return false
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        return true
      }

      calculate()
      const interval = setInterval(() => {
        if (!calculate()) clearInterval(interval)
      }, 1000)

      return () => clearInterval(interval)
    }, [endDate])

    return (
      <div className="flex items-center gap-2 text-rose-600 font-extrabold bg-rose-50/80 px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-right-1 duration-500">
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="tabular-nums text-[13px] tracking-tight">{timeLeft}</span>
      </div>
    )
  }

  const currentSession = session || initialSession
  const user = billingData?.user || currentSession?.user
  const userPlan = user?.plan
  const planEndsAt = user?.planEndsAt ? new Date(user.planEndsAt) : null
  const trialEndsAt = user?.trialEndsAt ? new Date(user.trialEndsAt) : null
  const planStartedAt = user?.planStartedAt ? new Date(user.planStartedAt) : (user?.createdAt ? new Date(user.createdAt) : null)

  const isTrial = (userPlan || '').toLowerCase().includes('trial')
  const expiryDate = isTrial ? trialEndsAt : planEndsAt
  const isExpired = (expiryDate && expiryDate < new Date()) || (user?.credits <= 0)
  const hasPaid = billingData?.paymentHistory?.length > 0

  const currentPlanKey = normalizePlanKey(userPlan)
  const currentTier = getPlanTier(userPlan)
  const isMaxPlan = currentTier >= PLAN_TIERS.plan_pro_plus && !isExpired

  const availablePlans = plans.filter((plan) => {
    if (plan.id === 'plan_trial') {
      return !hasPaid && currentTier === 0 && isTrial
    }

    const planTier = getPlanTier(plan.id)

    if (!isExpired) {
      if (planTier < currentTier) return false
      if (planTier === currentTier) return plan.id === currentPlanKey
      return planTier > currentTier
    }

    return plan.id !== 'plan_trial'
  })

  const getCheckoutLabel = (plan) => {
    const planTier = getPlanTier(plan.id)
    if (plan.id === currentPlanKey && !isExpired) {
      const creditsLabel = plan.features.find((f) => /credits/i.test(f)) || plan.features[0]
      return `Top up — ${creditsLabel}`
    }
    if (planTier > currentTier) return `Upgrade to ${plan.name}`
    return hasPaid ? `Buy ${plan.name}` : `Get ${plan.name}`
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async (plan) => {
    if (!RAZORPAY_KEY_ID) {
      toast.error('Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your env.')
      return
    }

    setLoading(plan.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')

      const resLoaded = await loadRazorpay()
      if (!resLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?')
        return
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'TopRank AI',
        description: `Subscribe to ${plan.name} Plan`,
        order_id: data.id,
        handler: async function (response) {
          toast.success('Payment received! Activating your plan...')
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed')
            if (verifyData.synced) {
              toast.success(`Added ${verifyData.creditsAdded} credits to your account.`)
            } else if (verifyData.alreadyRecorded) {
              toast.info('Payment already applied to your account.')
            }
          } catch (e) {
            console.error('Verify failed:', e)
            toast.error('Payment received but activation failed. Use Refresh Credits or contact support.')
          } finally {
            await update()
            fetchBillingDetails()
          }
        },
        prefill: {
          name: currentSession?.user?.name || '',
          email: currentSession?.user?.email || '',
        },
        theme: { color: '#2563EB' },
      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to initiate checkout.')
    } finally {
      setLoading(null)
    }
  }

  const formatCurrency = (amount, currency) => {
    if (!amount) return '₹0'
    const value = amount / 100
    if (currency?.toUpperCase() === 'USD') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `₹${value.toLocaleString('en-IN')}`
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const getPlanDisplayName = (planId) => {
    const id = (planId || 'Trial').toLowerCase()
    if (id.includes('lite') || id.includes('advance')) return 'Advance'
    if (id.includes('pro_plus') || id.includes('pro plus')) return 'Pro Plus'
    if (id.includes('pro')) return 'Pro'
    if (id.includes('trial')) return '7-Day Trial'
    return id.charAt(0).toUpperCase() + id.slice(1)
  }

  const cardBrandIcon = (brand) => {
    const brands = {
      visa: '💳 Visa',
      mastercard: '💳 Mastercard',
      amex: '💳 Amex',
      discover: '💳 Discover',
    }
    return brands[brand] || `💳 ${brand || 'Card'}`
  }

  return (
    <div className="space-y-8">
      {/* ━━━ Current Plan Box ━━━ */}
      <div className={`p-6 md:p-8 rounded-2xl border ${isExpired ? 'bg-rose-50 border-rose-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${isExpired ? 'bg-rose-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} shadow-lg`}>
              {isTrial ? <Zap className="w-7 h-7" /> : <CreditCard className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-xl font-black ${isExpired ? 'text-red-900' : 'text-blue-900'}`}>
                  {getPlanDisplayName(userPlan)} Plan
                </h3>
                {!isExpired && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Active
                  </span>
                )}
                {isExpired && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    Expired
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {expiryDate && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Subscription Coverage</span>
                        <p className={`text-sm font-black tracking-tight ${isExpired ? 'text-red-600' : 'text-blue-700'}`}>
                          {isExpired ? (
                            'Subscription period has ended'
                          ) : (
                            <>
                              {planStartedAt ? planStartedAt.toLocaleDateString() : 'Active'}
                              <span className="mx-2 text-slate-300">→</span>
                              {expiryDate.toLocaleDateString()}
                            </>
                          )}
                        </p>
                      </div>
                      {!isExpired && <ExpirationTimer endDate={expiryDate} />}
                    </div>
                  </div>
                )}
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${user?.credits > 0 ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}></span>
                  {user?.credits?.toLocaleString() || 0} Credits remaining
                </p>
              </div>
              {isExpired && (
                <div className="mt-4 p-3 bg-rose-100/50 rounded-xl border border-rose-200">
                  <p className="text-xs text-rose-800 font-bold">
                    Plan Expired! Either your time or credits have run out. Features are disabled until you upgrade or top up.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="h-10 px-5 rounded-xl font-bold gap-2 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-sm"
              onClick={handleManualSync}
              isLoading={loading === 'sync'}
              cooldown={5000}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Credits
            </Button>

          </div>
        </div>
      </div>

      {/* ━━━ Payment Method & Billing Info ━━━ */}
      {billingLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-3 text-slate-500 font-medium">Loading billing details...</span>
        </div>
      ) : hasPaid && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
            </div>

            {billingData?.cardInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {billingData.cardInfo.brand === 'visa' ? '💙' : billingData.cardInfo.brand === 'mastercard' ? '🧡' : '💳'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm capitalize">
                        {billingData.cardInfo.brand} •••• {billingData.cardInfo.last4}
                      </p>
                      <p className="text-xs text-slate-500">
                        Expires {String(billingData.cardInfo.expMonth).padStart(2, '0')}/{billingData.cardInfo.expYear}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No saved payment method</p>
                <p className="text-xs mt-1">Card info will appear after your next payment</p>
              </div>
            )}
          </div>

          {/* Billing Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Billing Summary</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Current Plan</span>
                <span className="text-sm font-bold text-slate-900">{getPlanDisplayName(currentSession?.user?.plan)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Credits Balance</span>
                <span className="text-sm font-bold text-emerald-600">{user?.credits?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Total Payments</span>
                <span className="text-sm font-bold text-slate-900">{billingData?.paymentHistory?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Payment Mode</span>
                <span className="text-sm font-bold text-slate-900 capitalize">Razorpay (INR)</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-slate-500 font-medium">Billing Email</span>
                <span className="text-sm font-bold text-slate-900">{billingData?.user?.email || currentSession?.user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ Payment History / Invoices ━━━ */}
      {hasPaid && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment History & Invoices</h3>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {billingData?.paymentHistory?.map((payment) => (
              <div key={payment.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {getPlanDisplayName(payment.planId)} — {payment.credits?.toLocaleString()} credits
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(payment.date)}
                      </span>
                      {payment.cardBrand && (
                        <span className="text-xs text-slate-400 capitalize">
                          {payment.cardBrand} •••• {payment.cardLast4}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 capitalize">{payment.provider}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="font-black text-slate-900">{formatCurrency(payment.amount, payment.currency)}</p>
                    <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{payment.status}</p>
                  </div>

                  <div className="flex gap-1.5">
                    {/* Invoice download — Stripe PDF, receipt URL, or our custom invoice */}
                    <a
                      href={`/api/invoice?id=${payment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors"
                      title="Download Invoice PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/api/invoice?id=${payment.id}`
                        navigator.clipboard.writeText(link)
                        toast.success('Invoice link copied! Share via email.')
                      }}
                      className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors"
                      title="Copy Invoice Link to Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ Pricing Cards ━━━ */}
      <div>
        {isMaxPlan && availablePlans.length <= 1 ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <div className="text-center mb-6">
              <BadgeCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-black text-slate-900 mb-2">You&apos;re on our highest plan</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Trial, Advance, and Pro are hidden — you already have Pro Plus until{' '}
                {expiryDate?.toLocaleDateString()}.
              </p>
            </div>
            {availablePlans.map((plan) => (
              <div key={plan.id} className="max-w-md mx-auto">
                <Button
                  onClick={() => handleCheckout(plan)}
                  isLoading={loading === plan.id}
                  cooldown={5000}
                  className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {getCheckoutLabel(plan)} (₹{plan.priceINR.toLocaleString('en-IN')})
                </Button>
              </div>
            ))}
          </div>
        ) : availablePlans.length > 0 ? (
          <>
            <h2 className="text-xl font-black text-slate-900 mb-1">
              {isExpired ? 'Renew or upgrade' : hasPaid ? 'Upgrade or add credits' : 'Choose a plan'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {isExpired
                ? 'Your subscription expired. Pick a plan to restore access.'
                : 'Plans below your current tier are hidden.'}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {availablePlans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlanKey && !isExpired
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-[2rem] p-8 border flex flex-col relative overflow-hidden ${
                      isCurrentPlan
                        ? 'border-emerald-500 ring-2 ring-emerald-100'
                        : plan.popular
                          ? 'border-blue-600 shadow-xl relative scale-[1.02]'
                          : 'border-slate-200'
                    }`}
                  >
              {plan.ribbon && (
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none z-10">
                  <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest py-1 w-32 text-center absolute top-5 right-[-34px] rotate-45 shadow-sm">
                    {plan.ribbon}
                  </div>
                </div>
              )}

              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 z-0">
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-emerald-100/50">
                    {plan.badge}
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Current plan
                </div>
              )}
              {plan.popular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">
                  ₹{plan.priceINR.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 font-bold text-sm">/ {plan.duration}</span>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-blue-600 font-bold" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleCheckout(plan)}
                isLoading={loading === plan.id}
                cooldown={5000}
                disabled={plan.id === 'plan_trial'}
                className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
                  isCurrentPlan || plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {getCheckoutLabel(plan)}
                </span>
              </Button>
            </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-slate-600 font-medium">No upgrade options available for your current plan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
