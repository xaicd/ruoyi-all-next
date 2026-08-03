import type {
  ForceLogoutInput,
  PageQueryInput,
} from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type OnlineUserItem = {
  sessionId: string
  userId: string
  username: string
  nickname: string
  expiresAt: string
}

export class SystemOnlineUserService {
  static async list(input: PageQueryInput) {
    domainLog.event("system.online-user.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.trim()
    const where: Record<string, unknown> = {
      expires: { gte: new Date() },
    }

    if (keyword) {
      where.OR = [
        { user: { phone: { contains: keyword, mode: "insensitive" } } },
        { user: { name: { contains: keyword, mode: "insensitive" } } },
      ]
    }

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.session.findMany({
        where,
        orderBy: [{ expires: "asc" }, { id: "desc" }],
        skip,
        take: input.pageSize,
        select: {
          id: true,
          expires: true,
          user: {
            select: {
              id: true,
              phone: true,
              name: true,
            },
          },
        },
      }),
      ruoyiPrisma.session.count({ where }),
    ])

    return {
      items: rows.map((row) => ({
        sessionId: row.id,
        userId: row.user.id,
        username: row.user.phone,
        nickname: row.user.name ?? row.user.phone,
        expiresAt: row.expires.toISOString(),
      })) as OnlineUserItem[],
      total,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async forceLogout(operatorId: string, input: ForceLogoutInput) {
    domainLog.event("system.online-user.force-logout", {
      operatorId,
      sessionId: input.sessionId,
    })
    domainLog.audit("system.online-user.force-logout", {
      operatorId,
      targetType: "SESSION",
      targetId: input.sessionId,
    })

    return {
      success: true,
      sessionId: input.sessionId,
    }
  }
}
