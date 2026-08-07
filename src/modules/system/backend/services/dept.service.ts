import type { PageQueryInput } from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

type SystemDeptItem = {
  id: string
  parentId: string | null
  name: string
  leader: string
  status: "ACTIVE" | "DISABLED"
}

export class SystemDeptService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { name: { contains: input.keyword, mode: "insensitive" as const } },
            { code: { contains: input.keyword, mode: "insensitive" as const } },
            { leaderName: { contains: input.keyword, mode: "insensitive" as const } },
          ],
        }
      : undefined

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.organization.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          parentId: true,
          name: true,
          leaderName: true,
          isActive: true,
        },
      }),
      ruoyiPrisma.organization.count({ where }),
    ])

    const items: SystemDeptItem[] = rows.map((row) => ({
      id: row.id,
      parentId: row.parentId,
      name: row.name,
      leader: row.leaderName ?? "-",
      status: row.isActive ? "ACTIVE" : "DISABLED",
    }))

    domainLog.event("system.dept.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    return { items, total, page: input.page, pageSize: input.pageSize }
  }
}
