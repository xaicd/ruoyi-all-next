export const nextReactAdminServiceTemplate = `import { prisma } from "@/lib/prisma"
import { Errors } from "@/lib/errors"
import { logger } from "@/lib/logger"

const log = logger.child("{{serviceName}}", "biz")

export class {{serviceName}} {
  static async list(input: { page: number; pageSize: number; keyword?: string }) {
    log.event("{{modulePath}}.list", input)
    return { items: [], total: 0, page: input.page, pageSize: input.pageSize }
  }

  static async create(input: Record<string, unknown>) {
    if (!input) throw Errors.MISSING_PARAMS(["input"])
    log.event("{{modulePath}}.create", { keys: Object.keys(input) })
    return prisma.$transaction(async () => input)
  }
}
`
