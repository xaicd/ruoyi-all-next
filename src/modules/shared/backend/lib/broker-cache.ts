import { cacheDelete, cacheDeletePrefix, cacheGet, cacheSet } from "./cache-store"

const PREFIX = "broker:"

export function brokerCacheKey(action: string, params: unknown, tenantId?: string) {
  return `${PREFIX}${tenantId ?? "_"}:${action}:${JSON.stringify(params ?? {})}`
}

export async function loadThroughCacher<T>(
  cache: boolean | { ttlMs?: number } | undefined,
  action: string,
  params: unknown,
  tenantId: string | undefined,
  load: () => Promise<T>,
): Promise<{ data: T; cached: boolean }> {
  if (!cache) return { data: await load(), cached: false }
  const ttlMs = typeof cache === "object" ? (cache.ttlMs ?? 30_000) : 30_000
  const key = brokerCacheKey(action, params, tenantId)
  const hit = cacheGet<T>(key)
  if (hit !== null) return { data: hit, cached: true }
  const data = await load()
  cacheSet(key, data, ttlMs)
  return { data, cached: false }
}

export const brokerCacher = {
  get: cacheGet,
  set: cacheSet,
  del: cacheDelete,
  clear() {
    cacheDeletePrefix(PREFIX)
  },
}
