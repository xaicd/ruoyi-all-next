import { NextResponse } from "next/server"
import { ZodError, type ZodIssue } from "zod"
import { AuthenticationError, AuthorizationError } from "../auth/context"
import { summarizeError, writeCompactError } from "../lib/observability"
import { traceContext } from "../lib/trace-context"
import { persistApiErrorLog } from "../lib/api-log-persistence"
import { getErrorDefinition, resolveErrorMessage, type ErrorCode } from "./error-catalog"

export type { ErrorCategory, ErrorCode, ErrorDefinition } from "./error-catalog"
export { ERROR_CATALOG, getErrorDefinition, getPublicErrorCatalog, registerErrorMessageResolver, resolveErrorMessage } from "./error-catalog"

/** Typed application error backed by the stable public error catalog. */
export class ApiError extends Error {
  readonly status: number

  constructor(readonly code: ErrorCode, message?: string) {
    super(message ?? resolveErrorMessage(code))
    this.name = "ApiError"
    this.status = getErrorDefinition(code).status
  }
}

export type ApiErrorDetail = { field: string; code: string; messageKey: string; message: string }
type ErrorWithCode = Error & { code?: string; cause?: unknown }
type ErrorContext = { request?: Request; operation?: string }
export type ApiErrorResponse = {
  success: false
  /** Compatibility alias for message. */
  error: string
  code: ErrorCode
  message: string
  messageKey: string
  retryable: boolean
  traceId: string
  details?: ApiErrorDetail[]
}

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

export function classifyApiError(error: unknown): ErrorCode {
  if (error instanceof ApiError) return error.code
  if (error instanceof AuthenticationError) return "UNAUTHENTICATED"
  if (error instanceof AuthorizationError) return "FORBIDDEN"
  if (error instanceof ZodError) return "VALIDATION_ERROR"
  if (error instanceof SyntaxError) return "INVALID_JSON"
  if (isDependencyUnavailable(error)) return "DEPENDENCY_UNAVAILABLE"
  return "INTERNAL_ERROR"
}

function getValidationDetails(error: unknown): ApiErrorDetail[] | undefined {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") return [{ field: "body", code: "INVALID_CONFIGURATION", messageKey: "validation.request_invalid", message: error.message }]
  if (!(error instanceof ZodError)) return undefined
  return error.issues.map((issue: ZodIssue) => ({
    field: issue.path.join(".") || "body",
    code: issue.code.toUpperCase(),
    messageKey: `validation.${issue.code}`,
    message: issue.message,
  }))
}

export function handleApiError(error: unknown, context: ErrorContext = {}) {
  const code = classifyApiError(error)
  const definition = getErrorDefinition(code)
  const raw = error instanceof Error ? error : new Error("Unknown error")
  if (definition.status >= 500) {
    const path = context.request ? new URL(context.request.url).pathname : undefined
    const errorCodeValue = errorCode(error)
    const diagnostic = summarizeError(error)
    const fields = {
      operation: context.operation,
      method: context.request?.method,
      path,
      status: definition.status,
      code,
      error: diagnostic,
    }
    writeCompactError("api.request.failed", error, fields)
    void persistApiErrorLog({
      traceId: traceContext.getTraceId(), method: context.request?.method ?? "UNKNOWN", path: path ?? "unknown",
      status: definition.status, durationMs: 0, errorName: diagnostic.name, errorMessage: diagnostic.message,
      errorCode: diagnostic.code ?? errorCodeValue ?? code, stack: raw.stack, rootCause: diagnostic.message,
      userIp: context.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim(), userAgent: context.request?.headers.get("user-agent") ?? undefined,
      operation: context.operation,
    })
  }
  const traceId = traceContext.getTraceId()
  const details = getValidationDetails(error)
  const payload: ApiErrorResponse = {
    success: false,
    // error is kept during v1 compatibility; new clients use code/message/messageKey.
    error: resolveErrorMessage(code),
    code,
    message: resolveErrorMessage(code),
    messageKey: definition.messageKey,
    retryable: definition.retryable,
    traceId,
    ...(details ? { details } : {}),
  }
  return NextResponse.json(
    payload,
    { status: definition.status, headers: { "X-Trace-Id": traceId, "X-Error-Code": code } },
  )
}
