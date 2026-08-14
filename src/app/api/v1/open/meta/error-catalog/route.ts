import { NextResponse } from "next/server"
import { getPublicErrorCatalog } from "@/modules/shared/backend/http/error-catalog"

/**
 * Stable machine-readable error contract for REST clients, API tooling, and MCP.
 * Error codes are immutable API identifiers; display messages may be localized.
 */
export function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        version: "v1",
        responseShape: {
          required: ["success", "code", "message", "messageKey", "retryable", "traceId"],
          errorDetails: "Optional field-level validation details.",
        },
        errors: getPublicErrorCatalog(),
      },
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  )
}
