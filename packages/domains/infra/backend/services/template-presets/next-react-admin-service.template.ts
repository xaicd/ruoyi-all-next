export const nextReactAdminServiceTemplate = `import { domainLog } from "@/modules/shared/backend/lib/domain-log"

/**
 * Same-process callers use this Service as a local application port.
 * Cross-domain callers must use createDomainFacade("{{moduleName}}"), never import this Service.
 */
export class {{serviceName}} {
  static async list(input: { page: number; pageSize: number; keyword?: string }) {
    domainLog.event("{{moduleName}}.{{featureKebab}}.list", { page: input.page, pageSize: input.pageSize, hasKeyword: Boolean(input.keyword) })
    return { items: [], total: 0, page: input.page, pageSize: input.pageSize }
  }

  static async create(input: Record<string, unknown>) {
    if (!input) throw new Error("input 不能为空")
    domainLog.event("{{moduleName}}.{{featureKebab}}.create", { keys: Object.keys(input) })
    domainLog.audit("{{moduleName}}.{{featureKebab}}.create", { targetType: "{{entityName}}", targetId: "pending" })
    return input
  }
}
`
