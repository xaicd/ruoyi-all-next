import { traceContext } from "./trace-context"

export type LogLevel = "debug" | "info" | "warn" | "error"
export type StructuredLog = {
  timestamp: string
  level: LogLevel
  event: string
  traceId: string
  fields?: Record<string, unknown>
}
export type LogSink = (record: StructuredLog) => void | Promise<void>
export type ApiAccessLogFields = {
  method: string
  path: string
  status: number
  durationMs: number
  userId?: string
  tenantId?: string
}

const SENSITIVE_KEY = /password|secret|token|authorization|cookie|credential|api[-_]?key/i
const sinks = new Set<LogSink>()

function redactText(value: string): string {
  return value.replace(/:\/\/([^:\s]+):([^@\s]+)@/g, "://$1:***@").replace(/(password|token|secret)=([^\s&]+)/gi, "$1=***")
}

export function redact(value: unknown): unknown {
  if (typeof value === "string") return redactText(value)
  if (Array.isArray(value)) return value.map(redact)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, SENSITIVE_KEY.test(key) ? "***" : redact(item)]))
}

/** Register a non-blocking sink, e.g. a database, queue, or OpenTelemetry exporter. */
export function registerLogSink(sink: LogSink): () => void {
  sinks.add(sink)
  return () => sinks.delete(sink)
}

export function writeStructuredLog(level: LogLevel, event: string, fields?: Record<string, unknown>): void {
  const record: StructuredLog = { timestamp: new Date().toISOString(), level, event, traceId: traceContext.getTraceId(), fields: fields ? redact(fields) as Record<string, unknown> : undefined }
  const line = JSON.stringify(record)
  if (level === "error") console.error(line)
  else if (level === "warn") console.warn(line)
  else console.info(line)
  for (const sink of sinks) {
    Promise.resolve(sink(record)).catch((error) => console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", event: "observability.sink.failed", traceId: record.traceId, fields: { errorMessage: error instanceof Error ? error.message : String(error) } })))
  }
}

export function recordApiAccess(fields: ApiAccessLogFields): void {
  writeStructuredLog("info", "api.request.completed", fields)
}
