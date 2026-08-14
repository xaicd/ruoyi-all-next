import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { AuthenticationError, AuthorizationError } from "../auth/context"
import { writeStructuredLog } from "../lib/observability"
import { traceContext } from "../lib/trace-context"

export class ApiError extends Error {
  constructor(readonly status: number, message: string, readonly code = "REQUEST_FAILED") {
    super(message)
    this.name = "ApiError"
  }
}

type ErrorWithCode = Error & { code?: string; cause?: unknown }
type ErrorContext = { request?: Request; operation?: string }
const DEPENDENCY_CODES = new Set(["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EHOSTUNREACH", "08000", "08001", "08003", "08004", "08006", "53300", "57P01", "57P02"])

function errorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error ? String((error as ErrorWithCode).code) : undefined
}

export function isDependencyUnavailable(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; current && depth < 4; depth += 1) {
    if (DEPENDENCY_CODES.has(errorCode(current) ?? "")) return true
    current = typeof current === "object" && current !== null && "cause" in current ? (current as ErrorWithCode).cause : undefined
  }
  return false
}

export function classifyApiError(error: unknown): { status: number; message: string; code: string } {
  if (error instanceof AuthenticationError || error instanceof AuthorizationError || error instanceof ApiError) return { status: error.status, message: error.message, code: error.code }
  if (error instanceof ZodError) return { status: 400, message: error.issues[0]?.message ?? "请求参数不正确", code: "VALIDATION_ERROR" }
  if (error instanceof SyntaxError) return { status: 400, message: "请求 JSON 格式不正确", code: "INVALID_JSON" }
  if (isDependencyUnavailable(error)) return { status: 503, message: "服务暂时不可用，请稍后重试", code: "DEPENDENCY_UNAVAILABLE" }
  return { status: 500, message: "系统异常，请稍后重试", code: "INTERNAL_ERROR" }
}

export function handleApiError(error: unknown, context: ErrorContext = {}) {
  const classified = classifyApiError(error)
  const raw = error instanceof Error ? error : new Error("Unknown error")
  if (classified.status >= 500) {
    writeStructuredLog("error", "api.request.failed", {
      operation: context.operation,
      method: context.request?.method,
      path: context.request ? new URL(context.request.url).pathname : undefined,
      status: classified.status,
      code: classified.code,
      errorName: raw.name,
      errorCode: errorCode(error),
      errorMessage: raw.message,
      stack: raw.stack,
    })
  }
  return NextResponse.json(
    { success: false, error: classified.message, code: classified.code },
    { status: classified.status, headers: { "X-Trace-Id": traceContext.getTraceId() } },
  )
}
