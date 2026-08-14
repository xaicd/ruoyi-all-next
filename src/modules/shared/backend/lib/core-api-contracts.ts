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
