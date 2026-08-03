import type { PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type SystemPostItem = {
  id: string
  code: string
  name: string
  sort: number
  status: "ACTIVE" | "DISABLED"
}

export class SystemPostService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { name: { contains: input.keyword, mode: "insensitive" as const } },
            { code: { contains: input.keyword, mode: "insensitive" as const } },
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
          sortOrder: true,
          status: true,
        },
      }),
      ruoyiPrisma.adminRole.count({ where }),
    ])

    const items: SystemPostItem[] = rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      sort: row.sortOrder,
      status: row.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
    }))

    domainLog.event("system.post.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    return { items, total, page: input.page, pageSize: input.pageSize }
  }
}
