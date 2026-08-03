import type { PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type SystemUserListItem = {
  id: string
  username: string
  nickname: string
  status: "ACTIVE" | "DISABLED"
  roleIds: string[]
}

export class SystemUserService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { username: { contains: input.keyword, mode: "insensitive" as const } },
            { phone: { contains: input.keyword, mode: "insensitive" as const } },
            { name: { contains: input.keyword, mode: "insensitive" as const } },
          ],
        }
      : undefined

    const skip = (input.page - 1) * input.pageSize

    const [rows, total] = await Promise.all([
      ruoyiPrisma.admin.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          phone: true,
          name: true,
          status: true,
          roleAssignments: {
            select: {
              roleId: true,
            },
          },
        },
      }),
      ruoyiPrisma.admin.count({ where }),
    ])

    const items: SystemUserListItem[] = rows.map((row) => ({
      id: row.id,
      username: row.username?.trim() ? row.username : row.phone,
      nickname: row.name?.trim() ? row.name : row.phone,
      status: row.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      roleIds: row.roleAssignments.map((item) => item.roleId),
    }))

    domainLog.event("system.user.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}
