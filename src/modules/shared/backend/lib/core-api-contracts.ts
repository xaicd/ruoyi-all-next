import { apiRegistry } from "./api-registry"

let registered = false

/**
 * Bootstrap contracts that are globally discoverable. Domain modules should add
 * their versioned contract/manifest entries here or through generated manifests.
 */
export function registerCoreApiContracts(): void {
  if (registered) return
  registered = true

  apiRegistry.register({
    path: "/api/v1/admin/system/auth",
    method: "POST",
    domain: "system",
    endpoint: "admin",
    version: "v1",
    summary: "管理员账号密码登录",
    requestSchema: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string" },
        password: { type: "string", format: "password", writeOnly: true },
        tenantCode: { type: "string", description: "Tenant accounts only; platform administrators leave it empty." },
      },
    },
    responseSchema: { type: "object", description: "JWT token, expiry, and administrator profile." },
  })

  apiRegistry.register({
    path: "/api/v1/open/meta/error-catalog",
    method: "GET",
    domain: "platform",
    endpoint: "open",
    version: "v1",
    summary: "获取全局错误码目录",
    responseSchema: { type: "object", description: "Stable error codes, HTTP statuses, message keys, and retry policies." },
  })

  apiRegistry.register({
    path: "/api/v1/open/openapi",
    method: "GET",
    domain: "platform",
    endpoint: "open",
    version: "v1",
    summary: "获取 OpenAPI 契约文档",
    responseSchema: { type: "object", description: "OpenAPI 3.0 document with x-error-catalog extension." },
  })
}


/** Audit-log contracts stay explicit so API/MCP clients know their read, retry, and authorization semantics. */
export function registerOnlineApiContracts(): void {
  apiRegistry.register({
    path: "/api/v1/admin/online/definitions", method: "GET", domain: "online", endpoint: "admin", version: "v1",
    summary: "查询 Online 定义工作台", permission: "infra:online-definition:query",
    responseSchema: { type: "object", description: "Phase-1 Online contract baseline. Definition metadata persistence is enabled by the next Prisma migration." },
  })
}

export function registerAuditLogApiContracts(): void {
  const entries = [
    ["/api/v1/admin/infra/api-access-log", "GET", "查询 API 访问日志", "infra:api-access-log:query"],
    ["/api/v1/admin/infra/api-access-log/{id}", "GET", "获取 API 访问日志详情", "infra:api-access-log:query"],
    ["/api/v1/admin/infra/api-access-log/export", "GET", "导出 API 访问日志 CSV", "infra:api-access-log:export"],
    ["/api/v1/admin/infra/api-error-logs", "GET", "查询 API 错误日志", "infra:api-error-log:query"],
    ["/api/v1/admin/infra/api-error-logs/{id}", "GET", "获取 API 错误日志详情", "infra:api-error-log:query"],
    ["/api/v1/admin/infra/api-error-logs/{id}", "PATCH", "标记 API 错误日志已处理", "infra:api-error-log:update-status"],
    ["/api/v1/admin/infra/api-error-logs/export", "GET", "导出 API 错误日志 CSV", "infra:api-error-log:export"],
    ["/api/v1/admin/infra/audit-log-retention", "POST", "预览或执行审计日志保留清理", "infra:audit-log:retention"],
    ["/api/v1/admin/system/login-logs", "GET", "查询登录日志", "system:login-log:query"],
    ["/api/v1/admin/system/login-logs/export", "GET", "导出登录日志 CSV", "system:login-log:export"],
    ["/api/v1/admin/system/operate-logs", "GET", "查询操作日志", "system:operate-log:query"],
    ["/api/v1/admin/system/operate-logs/export", "GET", "导出操作日志 CSV", "system:operate-log:export"],
  ] as const
  for (const [path, method, summary, permission] of entries) apiRegistry.register({
    path, method: method as "GET" | "POST" | "PATCH", domain: path.includes("/system/") ? "system" : "infra", endpoint: "admin", version: "v1", summary, permission,
    responseSchema: { type: "object", description: "Standard successful response; all failures follow the global ErrorResponse contract with code, messageKey, retryable, and traceId." },
  })
}
