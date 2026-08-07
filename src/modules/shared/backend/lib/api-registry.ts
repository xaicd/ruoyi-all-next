/**
 * API Registry - 接口注册与治理
 *
 * 能力：
 * - 接口自动注册（启动时扫描 route）
 * - 接口文档自动生成（OpenAPI 3.0）
 * - 接口版本管理（v1/v2 共存）
 * - 接口废弃标记与下线通知
 * - 字段级变更追踪
 *
 * 阶段演进：
 * - 阶段A：内存注册表
 * - 阶段B：持久化 + 版本 diff
 * - 阶段C：独立 API 管理平台
 */

// ============ Types ============

export type ApiEndpointInfo = {
  /** 路径，如 /api/v1/admin/system/users */
  path: string
  /** HTTP 方法 */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  /** 所属域 */
  domain: string
  /** 端点类型 */
  endpoint: "admin" | "app" | "open" | "internal"
  /** API 版本 */
  version: string
  /** 描述 */
  summary: string
  /** 所需权限码 */
  permission?: string
  /** 是否废弃 */
  deprecated?: boolean
  /** 废弃说明 */
  deprecatedNote?: string
  /** 请求参数 schema（JSON Schema） */
  requestSchema?: Record<string, unknown>
  /** 响应 schema */
  responseSchema?: Record<string, unknown>
  /** 注册时间 */
  registeredAt: string
}

export type FieldChangeRecord = {
  api: string
  field: string
  changeType: "ADDED" | "REMOVED" | "TYPE_CHANGED" | "RENAMED"
  oldValue?: string
  newValue?: string
  version: string
  changedAt: string
}

// ============ State ============

const registry = new Map<string, ApiEndpointInfo>()
const fieldChanges: FieldChangeRecord[] = []

// ============ Core ============

export const apiRegistry = {
  /**
   * 注册 API 端点
   *
   * @example
   * apiRegistry.register({
   *   path: "/api/v1/admin/system/users",
   *   method: "GET",
   *   domain: "system",
   *   endpoint: "admin",
   *   version: "v1",
   *   summary: "获取用户分页列表",
   *   permission: "system:user:query",
   * })
   */
  register(info: Omit<ApiEndpointInfo, "registeredAt">) {
    const key = `${info.method}:${info.path}`
    registry.set(key, { ...info, registeredAt: new Date().toISOString() })
  },

  /** 标记废弃 */
  deprecate(method: string, path: string, note: string) {
    const key = `${method}:${path}`
    const info = registry.get(key)
    if (info) {
      info.deprecated = true
      info.deprecatedNote = note
    }
  },

  /** 记录字段变更 */
  recordFieldChange(change: Omit<FieldChangeRecord, "changedAt">) {
    fieldChanges.push({ ...change, changedAt: new Date().toISOString() })
  },

  /** 获取所有注册的 API */
  list(filters?: { domain?: string; endpoint?: string; version?: string; deprecated?: boolean }): ApiEndpointInfo[] {
    let results = [...registry.values()]
    if (filters?.domain) results = results.filter((a) => a.domain === filters.domain)
    if (filters?.endpoint) results = results.filter((a) => a.endpoint === filters.endpoint)
    if (filters?.version) results = results.filter((a) => a.version === filters.version)
    if (filters?.deprecated !== undefined) results = results.filter((a) => (a.deprecated || false) === filters.deprecated)
    return results
  },

  /** 获取字段变更历史 */
  getFieldChanges(api?: string): FieldChangeRecord[] {
    if (api) return fieldChanges.filter((c) => c.api === api)
    return [...fieldChanges]
  },

  /** 生成 OpenAPI 3.0 文档（简化版） */
  toOpenAPI(): Record<string, unknown> {
    const paths: Record<string, Record<string, unknown>> = {}
    for (const info of registry.values()) {
      if (!paths[info.path]) paths[info.path] = {}
      paths[info.path][info.method.toLowerCase()] = {
        summary: info.summary,
        tags: [info.domain],
        deprecated: info.deprecated || false,
        security: info.permission ? [{ bearerAuth: [] }] : [],
      }
    }
    return {
      openapi: "3.0.3",
      info: { title: "ruoyi-all-next API", version: "1.0.0" },
      paths,
    }
  },

  /** 统计 */
  stats(): { total: number; byDomain: Record<string, number>; deprecated: number } {
    const byDomain: Record<string, number> = {}
    let deprecated = 0
    for (const info of registry.values()) {
      byDomain[info.domain] = (byDomain[info.domain] || 0) + 1
      if (info.deprecated) deprecated++
    }
    return { total: registry.size, byDomain, deprecated }
  },
}
