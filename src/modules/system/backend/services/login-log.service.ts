import type { LoginLogQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type LoginLogItem = {
  id: string
  username: string
  ip: string
  result: "SUCCESS" | "FAIL"
  reason?: string
  createdAt: string
}

export class SystemLoginLogService {
  static async list(input: LoginLogQueryInput) {
    domainLog.event("system.login-log.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      result: input.result ?? "ALL",
    })

    const keyword = input.keyword?.trim()
    const where: Record<string, unknown> = {}

    if (input.result) {
      where.result = input.result
    }

    if (keyword) {
      where.OR = [
        { username: { contains: keyword, mode: "insensitive" } },
        { ip: { contains: keyword, mode: "insensitive" } },
      ]
    }

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.loginLog.findMany({
        where,
        orderBy: [{ loginAt: "desc" }, { id: "desc" }],
        skip,
        take: input.pageSize,
        select: {
          id: true,
          username: true,
          ip: true,
          result: true,
          failReason: true,
          loginAt: true,
        },
      }),
      ruoyiPrisma.loginLog.count({ where }),
    ])

    const items: LoginLogItem[] = rows.map((row) => ({
      id: row.id,
      username: row.username ?? "",
      ip: row.ip,
      result: row.result as "SUCCESS" | "FAIL",
      reason: row.failReason ?? undefined,
      createdAt: row.loginAt.toISOString(),
    }))

    return { items, total, page: input.page, pageSize: input.pageSize }
  }

  static async exportCsv(input: LoginLogQueryInput) {
    const listed = await this.list(input)
    const header = "id,username,ip,result,reason,createdAt"
    const rows = listed.items.map((item) =>
      [item.id, item.username, item.ip, item.result, item.reason ?? "", item.createdAt].join(","),
    )

    domainLog.event("system.login-log.export", {
      total: listed.total,
      result: input.result ?? "ALL",
    })

    return {
      fileName: "login-logs.csv",
      contentType: "text/csv; charset=utf-8",
      content: [header, ...rows].join("\n"),
    }
  }
}
