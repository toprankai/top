import redis from '@/lib/redis'

const memoryBuckets = new Map()

function bucketKey(ip, route) {
  return `${ip || 'unknown'}:${route}`
}

/**
 * Simple sliding-window style limit using fixed windows (good enough for product demo).
 * Uses Redis when available; otherwise in-memory (single-instance dev only).
 */
export async function rateLimitCheck(ip, route, { max = 30, windowSec = 3600 } = {}) {
  const key = bucketKey(ip, route)
  const now = Date.now()
  const windowMs = windowSec * 1000

  if (redis) {
    try {
      const rKey = `rl:ai-qr:${key}`
      const n = await redis.incr(rKey)
      if (n === 1) await redis.expire(rKey, windowSec)
      if (n > max) return { ok: false, remaining: 0, retryAfterSec: await redis.ttl(rKey) }
      return { ok: true, remaining: Math.max(0, max - n) }
    } catch {
      // fall through to memory
    }
  }

  let b = memoryBuckets.get(key)
  if (!b || now - b.start > windowMs) {
    b = { start: now, count: 0 }
    memoryBuckets.set(key, b)
  }
  b.count += 1
  if (b.count > max) {
    const retryAfterSec = Math.ceil((windowMs - (now - b.start)) / 1000)
    return { ok: false, remaining: 0, retryAfterSec: Math.max(1, retryAfterSec) }
  }
  return { ok: true, remaining: max - b.count }
}

export function clientIpFromRequest(request) {
  const h =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    ''
  return h.split(',')[0]?.trim() || 'unknown'
}
