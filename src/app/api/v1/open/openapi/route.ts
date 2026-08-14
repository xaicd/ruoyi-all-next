import { NextResponse } from "next/server"
import { apiRegistry } from "@/modules/shared/backend/lib/api-registry"
import { registerAuditLogApiContracts, registerCoreApiContracts } from "@/modules/shared/backend/lib/core-api-contracts"

/** OpenAPI publication endpoint; includes x-error-catalog for deterministic client and MCP error handling. */
export function GET() {
  registerCoreApiContracts()
  registerAuditLogApiContracts()
  return NextResponse.json(apiRegistry.toOpenAPI(), {
    headers: { "Cache-Control": "public, max-age=300" },
  })
}
