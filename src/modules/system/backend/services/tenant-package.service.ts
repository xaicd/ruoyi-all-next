import type { PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type TenantPackageItem = {
  id: string
  name: string
  maxUserCount: number
  maxAdminCount: number
  status: "ACTIVE" | "DISABLED"
}

export class SystemTenantPackageService {
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
      ruoyiPrisma.tenantPackage.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          userLimit: true,
          merchantLimit: true,
          isActive: true,
        },
      }),
      ruoyiPrisma.tenantPackage.count({ where }),
    ])

    domainLog.event("system.tenant-package.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    const items: TenantPackageItem[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      maxUserCount: row.userLimit ?? 0,
      maxAdminCount: row.merchantLimit ?? 0,
      status: row.isActive ? "ACTIVE" : "DISABLED",
    }))

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}
