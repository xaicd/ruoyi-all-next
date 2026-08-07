type CacheItem<T> = {
  value: T
  expiresAt: number
}

const CACHE = new Map<string, CacheItem<unknown>>()

function cleanup(now: number) {
  for (const [key, item] of CACHE.entries()) {
    if (item.expiresAt <= now) {
      CACHE.delete(key)
    }
  }
}

export function cacheSet<T>(key: string, value: T, ttlMs = 60_000) {
  const now = Date.now()
  cleanup(now)
  CACHE.set(key, { value, expiresAt: now + ttlMs })
}

export function cacheGet<T>(key: string): T | null {
  const now = Date.now()
  cleanup(now)
  const item = CACHE.get(key)
  if (!item) return null
  return item.value as T
}

export function cacheDelete(key: string) {
  CACHE.delete(key)
}

export function clearCacheStore() {
  CACHE.clear()
}
