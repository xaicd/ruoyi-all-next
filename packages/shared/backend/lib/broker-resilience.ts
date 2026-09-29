import governanceJson from "../constants/microservice-governance.json"

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN"

type Outcome = { at: number; ok: boolean }

const windows = new Map<string, Outcome[]>()
const states = new Map<string, { state: CircuitState; openedAt: number }>()
const bulkheads = new Map<string, { active: number; waiters: Array<{ resume: () => void; fail: (error: Error) => void }> }>()

type ResilienceDefaults = {
  circuitBreaker: { threshold: number; minRequestCount: number; windowTimeSec: number; halfOpenMs: number }
  retry: { delayMs: number; maxDelayMs: number; factor: number }
  bulkhead: { concurrency: number; maxQueueSize: number }
}

let defaults: ResilienceDefaults = {
  circuitBreaker: { ...governanceJson.defaults.circuitBreaker },
  retry: { ...governanceJson.defaults.retry },
  bulkhead: { ...governanceJson.defaults.bulkhead },
}

export function configureBrokerResilience(partial: Partial<ResilienceDefaults>) {
  defaults = {
    circuitBreaker: { ...defaults.circuitBreaker, ...partial.circuitBreaker },
    retry: { ...defaults.retry, ...partial.retry },
    bulkhead: { ...defaults.bulkhead, ...partial.bulkhead },
  }
}

export function resetBrokerResilience() {
  windows.clear()
  states.clear()
  bulkheads.clear()
  defaults = {
    circuitBreaker: { ...governanceJson.defaults.circuitBreaker },
    retry: { ...governanceJson.defaults.retry },
    bulkhead: { ...governanceJson.defaults.bulkhead },
  }
}

function windowFor(key: string): Outcome[] {
  const windowTimeMs = defaults.circuitBreaker.windowTimeSec * 1000
  const now = Date.now()
  const list = (windows.get(key) ?? []).filter((item) => now - item.at <= windowTimeMs)
  windows.set(key, list)
  return list
}

export function circuitAllow(key: string): boolean {
  const current = states.get(key)
  if (!current || current.state === "CLOSED") return true
  if (current.state === "OPEN") {
    if (Date.now() - current.openedAt >= defaults.circuitBreaker.halfOpenMs) {
      states.set(key, { state: "HALF_OPEN", openedAt: current.openedAt })
      return true
    }
    return false
  }
  return true
}

export function circuitRecord(key: string, ok: boolean) {
  const list = windowFor(key)
  list.push({ at: Date.now(), ok })
  const state = states.get(key)?.state ?? "CLOSED"
  if (ok && state === "HALF_OPEN") {
    states.set(key, { state: "CLOSED", openedAt: 0 })
    return
  }
  if (ok) return
  if (list.length < defaults.circuitBreaker.minRequestCount) return
  const failureRate = list.filter((item) => !item.ok).length / list.length
  if (failureRate >= defaults.circuitBreaker.threshold) {
    states.set(key, { state: "OPEN", openedAt: Date.now() })
  }
}

export function circuitReset(key?: string) {
  if (key) states.delete(key)
  else states.clear()
}

export function circuitStatus(): Record<string, CircuitState> {
  const status: Record<string, CircuitState> = {}
  states.forEach((value, key) => {
    status[key] = value.state
  })
  return status
}

export function retryDelayMs(attempt: number): number {
  const delay = defaults.retry.delayMs * defaults.retry.factor ** attempt
  return Math.min(delay, defaults.retry.maxDelayMs)
}

export async function bulkheadAcquire(key: string): Promise<() => void> {
  const slot = bulkheads.get(key) ?? { active: 0, waiters: [] }
  bulkheads.set(key, slot)
  if (slot.active < defaults.bulkhead.concurrency) {
    slot.active += 1
    return () => release(key)
  }
  if (slot.waiters.length >= defaults.bulkhead.maxQueueSize) {
    throw new Error(`QueueIsFull for ${key}`)
  }
  await new Promise<void>((resolve, reject) => {
    slot.waiters.push({ resume: resolve, fail: reject })
  })
  slot.active += 1
  return () => release(key)
}

function release(key: string) {
  const slot = bulkheads.get(key)
  if (!slot) return
  slot.active = Math.max(0, slot.active - 1)
  const next = slot.waiters.shift()
  if (next) next.resume()
}
