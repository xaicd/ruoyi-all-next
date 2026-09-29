import { tenantKey } from "./biz-tenant"

type CacheItem<T> = {
  value: T
  expiresAt: number
}

const CACHE = new Map<string, CacheItem<unknown>>()

function cleanup(now: number) {
  for (const [key, item] of CACHE.entries()) {
    if (item.expiresAt <= now) CACHE.delete(key)
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
  return (CACHE.get(key)?.value as T | undefined) ?? null
}

export function cacheDelete(key: string) {
  CACHE.delete(key)
}

export function cacheDeletePrefix(prefix: string) {
  for (const key of CACHE.keys()) {
    if (key.startsWith(prefix)) CACHE.delete(key)
  }
}

/** Use these APIs for any tenant-owned resource; raw cache keys are platform-only. */
export function cacheSetForTenant<T>(purpose: string, id: string, value: T, ttlMs = 60_000) {
  cacheSet(tenantKey(purpose, id), value, ttlMs)
}

export function cacheGetForTenant<T>(purpose: string, id: string): T | null {
  return cacheGet<T>(tenantKey(purpose, id))
}

export function cacheDeleteForTenant(purpose: string, id: string) {
  cacheDelete(tenantKey(purpose, id))
}

export function clearCacheStore() {
  CACHE.clear()
}
