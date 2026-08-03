import type { OperateLogQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type OperateLogItem = {
  id: string
  module: string
  action: string
  operator: string
  createdAt: string
}

export class SystemOperateLogService {
  static async list(input: OperateLogQueryInput) {
    domainLog.event("system.operate-log.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      module: input.module ?? "ALL",
    })

    const keyword = input.keyword?.trim()
    const where: Record<string, unknown> = {}

    if (input.module) {
      where.targetType = { contains: input.module, mode: "insensitive" }
    }

    if (keyword) {
      where.OR = [
        { adminName: { contains: keyword, mode: "insensitive" } },
        { adminUsername: { contains: keyword, mode: "insensitive" } },
        { action: { contains: keyword, mode: "insensitive" } },
      ]
    }

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.adminAuditLog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: input.pageSize,
        select: {
          id: true,
          targetType: true,
          action: true,
          adminName: true,
          adminUsername: true,
          createdAt: true,
        },
      }),
      ruoyiPrisma.adminAuditLog.count({ where }),
    ])

    const items: OperateLogItem[] = rows.map((row) => ({
      id: row.id,
      module: row.targetType,
      action: row.action,
      operator: row.adminName ?? row.adminUsername ?? "",
      createdAt: row.createdAt.toISOString(),
    }))

    return { items, total, page: input.page, pageSize: input.pageSize }
  }

  static async exportCsv(input: OperateLogQueryInput) {
    const listed = await this.list(input)
    const header = "id,module,action,operator,createdAt"
    const rows = listed.items.map((item) =>
      [item.id, item.module, item.action, item.operator, item.createdAt].join(","),
    )

    domainLog.event("system.operate-log.export", {
      total: listed.total,
      module: input.module ?? "ALL",
    })

    return {
      fileName: "operate-logs.csv",
      contentType: "text/csv; charset=utf-8",
      content: [header, ...rows].join("\n"),
    }
  }
}
