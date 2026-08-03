export const nextReactAdminServiceFacadeTemplate = `import { logger } from "@/lib/logger"
import { Errors } from "@/lib/errors"

const log = logger.child("{{serviceName}}Facade", "biz")

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
   * 标准执行管道：authorize -> guard -> transaction -> log。
   */
  static async execute(input: ExecuteInput, actor: ActorContext) {
    this.authorize(actor)
    this.guard(input)

    const result = await this.executeTransaction(input, actor)

    log.event("{{modulePath}}.execute.success", {
      resourceId: result.id,
      action: input.action,
      operatorId: actor.userId,
    })

    return result
  }

  private static authorize(actor: ActorContext) {
    if (!actor.permissions.includes("{{permissionUpdate}}")) {
      throw Errors.FORBIDDEN("权限不足")
    }
  }

  private static guard(input: ExecuteInput) {
    if (!input.id.trim()) {
      throw Errors.VALIDATION_ERROR("资源 ID 不能为空")
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
