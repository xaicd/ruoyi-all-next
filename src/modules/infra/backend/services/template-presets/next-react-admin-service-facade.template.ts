export const nextReactAdminServiceFacadeTemplate = `import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

/**
 * Cross-domain RPC/SDK facade. Same-process is in-memory SDK; split-process is RPC.
 * Do not import another domain's Service or Repository.
 */
export const {{entityName}}Rpc = createDomainFacade("{{moduleName}}", ["list", "create", "execute"] as const)

type ActorContext = {
  userId: string
  permissions: string[]
}

type ExecuteInput = {
  id: string
  action: "APPROVE" | "REJECT"
}

export class {{serviceName}}Facade {
  /**
   * 同域执行管道：authorize -> guard -> transaction -> log。
   * 跨域调用走 {{entityName}}Rpc，由 broker 在 SDK/RPC 之间切换。
   */
  static async execute(input: ExecuteInput, actor: ActorContext) {
    this.authorize(actor)
    this.guard(input)
    const result = await this.executeTransaction(input, actor)
    domainLog.event("{{moduleName}}.{{featureKebab}}.execute.success", {
      resourceId: result.id,
      action: input.action,
      operatorId: actor.userId,
    })
    return result
  }

  private static authorize(actor: ActorContext) {
    if (!actor.permissions.includes("{{permissionUpdate}}")) {
      throw Object.assign(new Error("权限不足"), { code: "FORBIDDEN" })
    }
  }

  private static guard(input: ExecuteInput) {
    if (!input.id.trim()) {
      throw Object.assign(new Error("资源 ID 不能为空"), { code: "VALIDATION_ERROR" })
    }
  }

  private static async executeTransaction(input: ExecuteInput, actor: ActorContext) {
    return {
      id: input.id,
      action: input.action,
      updatedBy: actor.userId,
    }
  }
}
`
