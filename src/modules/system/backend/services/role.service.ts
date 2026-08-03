import type { PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type SystemRoleItem = {
  id: string
  code: string
  name: string
  dataScope: "ALL" | "DEPT" | "SELF"
  status: "ACTIVE" | "DISABLED"
}

export class SystemRoleService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { code: { contains: input.keyword, mode: "insensitive" as const } },
            { name: { contains: input.keyword, mode: "insensitive" as const } },
          ],
        }
      : undefined

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.adminRole.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          code: true,
          name: true,
          dataScope: true,
          status: true,
        },
      }),
      ruoyiPrisma.adminRole.count({ where }),
    ])

    const items: SystemRoleItem[] = rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      dataScope: row.dataScope === "ALL" ? "ALL" : row.dataScope === "SELF" ? "SELF" : "DEPT",
      status: row.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
    }))

    domainLog.event("system.role.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    return { items, total, page: input.page, pageSize: input.pageSize }
  }
}
