const METRICS = new Map<string, number>()
const TRACER_SPANS: Array<{ tracerName: string; durationMs: number }> = []

export function monitorIncrement(metric: string, value = 1) {
  METRICS.set(metric, (METRICS.get(metric) ?? 0) + value)
}

export function monitorRead(metric: string) {
  return METRICS.get(metric) ?? 0
}

export function tracerRecord(tracerName: string, durationMs: number) {
  TRACER_SPANS.push({ tracerName, durationMs })
}

export function listTracerSpans() {
  return [...TRACER_SPANS]
}

export function clearMonitorStore() {
  METRICS.clear()
  TRACER_SPANS.length = 0
}
