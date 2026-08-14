import { registerAuditLogApiContracts, registerCoreApiContracts } from "../src/modules/shared/backend/lib/core-api-contracts"
import { apiRegistry } from "../src/modules/shared/backend/lib/api-registry"

const expected = [
  "GET:/api/v1/admin/infra/api-access-log", "GET:/api/v1/admin/infra/api-access-log/{id}", "GET:/api/v1/admin/infra/api-access-log/export",
  "GET:/api/v1/admin/infra/api-error-logs", "GET:/api/v1/admin/infra/api-error-logs/{id}", "PATCH:/api/v1/admin/infra/api-error-logs/{id}", "GET:/api/v1/admin/infra/api-error-logs/export",
  "POST:/api/v1/admin/infra/audit-log-retention", "GET:/api/v1/admin/system/login-logs", "GET:/api/v1/admin/system/login-logs/export", "GET:/api/v1/admin/system/operate-logs", "GET:/api/v1/admin/system/operate-logs/export",
]
registerCoreApiContracts(); registerAuditLogApiContracts()
const registered = new Set(apiRegistry.list().map((item) => `${item.method}:${item.path}`))
const missing = expected.filter((key) => !registered.has(key))
if (missing.length) throw new Error(`Audit log OpenAPI contracts missing: ${missing.join(", ")}`)
const spec = apiRegistry.toOpenAPI() as { paths: Record<string, Record<string, unknown>>; [key: string]: unknown }
if (!spec["x-error-catalog"] || !spec.components) throw new Error("OpenAPI must publish the global error catalog and standard error schemas")
console.log(`[audit-log-contracts] PASS: ${expected.length} protected audit operations are registered with the global error contract`)
