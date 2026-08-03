export const nextReactAdminWorkflowServiceTemplate = `import { logger } from "@/lib/logger"

const log = logger.child("{{entityName}}WorkflowService", "biz")

export class {{entityName}}WorkflowService {
  static async list() {
    log.event("{{modulePath}}.workflow.list")
    return { items: [], total: 0 }
  }

  static async create(input: Record<string, unknown>) {
    log.event("{{modulePath}}.workflow.create", { keys: Object.keys(input) })
    return input
  }

  static async audit(input: Record<string, unknown>) {
    log.event("{{modulePath}}.workflow.audit", { keys: Object.keys(input) })
    return input
  }
}
`
