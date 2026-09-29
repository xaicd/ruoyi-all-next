export const nextReactAdminWorkflowServiceTemplate = `import { domainLog } from "@/modules/shared/backend/lib/domain-log"

/**
 * Same-process callers use this Service as a local application port.
 * Cross-domain callers must use createDomainFacade("{{moduleName}}"), never import this Service.
 */
export class {{entityName}}WorkflowService {
  static async list() {
    domainLog.event("{{moduleName}}.{{featureKebab}}.workflow.list")
    return { items: [], total: 0 }
  }

  static async create(input: Record<string, unknown>) {
    domainLog.event("{{moduleName}}.{{featureKebab}}.workflow.create", { keys: Object.keys(input) })
    return input
  }

  static async audit(input: Record<string, unknown>) {
    domainLog.audit("{{moduleName}}.{{featureKebab}}.workflow.audit", { keys: Object.keys(input) })
    return input
  }
}
`
