/** Ensure Atlas gets a database name (empty path causes AtlasError 8000). */
export function normalizeMongoUrl(url) {
  if (!url || typeof url !== 'string') return url

  const trimmed = url.trim()
  // Already has a db name: ...mongodb.net/dbname or ...mongodb.net/dbname?...
  if (/\.mongodb\.net\/[^/?]+/.test(trimmed)) {
    return trimmed
  }

  const db = process.env.DB_NAME || 'local_rank_heatmap'
  const withoutTrailingSlash = trimmed.replace(/\/$/, '')

  if (withoutTrailingSlash.includes('?')) {
    const [base, query] = withoutTrailingSlash.split('?')
    return `${base}/${db}?${query}`
  }

  return `${withoutTrailingSlash}/${db}?retryWrites=true&w=majority`
}

export function applyMongoUrlEnv() {
  if (process.env.MONGO_URL) {
    process.env.MONGO_URL = normalizeMongoUrl(process.env.MONGO_URL)
  }
}
