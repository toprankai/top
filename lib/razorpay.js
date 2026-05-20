import Razorpay from 'razorpay'

/** Public key id — supports RAZORPAY_KEY_ID or RAZORPAY_API_KEY in env */
export function getRazorpayKeyId() {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_API_KEY ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    ''
  ).replace(/^["']|["']$/g, '')
}

export function getRazorpaySecret() {
  return (process.env.RAZORPAY_KEY_SECRET || '').replace(/^["']|["']$/g, '')
}

export function getRazorpayClient() {
  const key_id = getRazorpayKeyId()
  const key_secret = getRazorpaySecret()
  if (!key_id || !key_secret) return null
  return new Razorpay({ key_id, key_secret })
}

export function isRazorpayConfigured() {
  return Boolean(getRazorpayKeyId() && getRazorpaySecret())
}
