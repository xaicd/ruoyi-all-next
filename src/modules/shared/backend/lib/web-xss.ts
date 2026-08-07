const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const EVENT_HANDLER_RE = /\son\w+\s*=\s*"[^"]*"/gi

function sanitizeString(value: string) {
  return value.replace(SCRIPT_TAG_RE, "").replace(EVENT_HANDLER_RE, "")
}

export function sanitizeXssPayload<T>(payload: T): T {
  if (typeof payload === "string") {
    return sanitizeString(payload) as T
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeXssPayload(item)) as T
  }

  if (payload && typeof payload === "object") {
    const next: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
      next[key] = sanitizeXssPayload(value)
    }
    return next as T
  }

  return payload
}
