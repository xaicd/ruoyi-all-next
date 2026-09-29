const IDEMPOTENT_KEYS = new Map<string, number>()

function cleanupExpired(now: number) {
  for (const [key, expiresAt] of IDEMPOTENT_KEYS.entries()) {
    if (expiresAt <= now) {
      IDEMPOTENT_KEYS.delete(key)
    }
  }
}

export function acquireIdempotencyKey(key: string, ttlMs = 60_000) {
  const now = Date.now()
  cleanupExpired(now)
  if (IDEMPOTENT_KEYS.has(key)) {
    return false
  }

  IDEMPOTENT_KEYS.set(key, now + ttlMs)
  return true
}

export function clearIdempotencyKeys() {
  IDEMPOTENT_KEYS.clear()
}
