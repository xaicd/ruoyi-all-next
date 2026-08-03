import type { PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type SystemMenuItem = {
  id: string
  parentId: string | null
  name: string
  path: string
  permission: string
  type: "DIR" | "MENU" | "BUTTON"
}

export class SystemMenuService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { name: { contains: input.keyword, mode: "insensitive" as const } },
            { path: { contains: input.keyword, mode: "insensitive" as const } },
            { key: { contains: input.keyword, mode: "insensitive" as const } },
            { permission: { contains: input.keyword, mode: "insensitive" as const } },
          ],
        }
      : undefined

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.adminMenu.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          parentId: true,
          name: true,
          path: true,
          permission: true,
          type: true,
        },
      }),
      ruoyiPrisma.adminMenu.count({ where }),
    ])

    const items: SystemMenuItem[] = rows.map((row) => ({
      id: row.id,
      parentId: row.parentId,
      name: row.name,
      path: row.path ?? "",
      permission: row.permission ?? "",
      type: row.type === "DIRECTORY" ? "DIR" : row.type,
    }))

    domainLog.event("system.menu.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    return { items, total, page: input.page, pageSize: input.pageSize }
  }
}
