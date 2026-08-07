import type {
  AssignTenantPackageInput,
  PageQueryInput,
  UpdateTenantStatusInput,
} from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

type TenantItem = {
  id: string
  name: string
  contactName: string
  status: "ACTIVE" | "DISABLED"
  packageId: string
  expireAt: string
}

export class SystemTenantService {
  static async list(input: PageQueryInput) {
    const where = input.keyword
      ? {
          OR: [
            { name: { contains: input.keyword, mode: "insensitive" as const } },
            { tenantKey: { contains: input.keyword, mode: "insensitive" as const } },
          ],
        }
      : undefined

    const skip = (input.page - 1) * input.pageSize
    const [rows, total] = await Promise.all([
      ruoyiPrisma.tenant.findMany({
        where,
        skip,
        take: input.pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          tenantKey: true,
          status: true,
          packageId: true,
          expiresAt: true,
        },
      }),
      ruoyiPrisma.tenant.count({ where }),
    ])

    domainLog.event("system.tenant.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      source: "db",
      total,
    })

    const items: TenantItem[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      contactName: row.tenantKey,
      status: row.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      packageId: row.packageId ?? "",
      expireAt: row.expiresAt?.toISOString() ?? "",
    }))

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async updateStatus(operatorId: string, input: UpdateTenantStatusInput) {
    const exists = await ruoyiPrisma.tenant.findUnique({
      where: { id: input.tenantId },
      select: { id: true },
    })
    if (!exists) {
      throw new Error("租户不存在")
    }

    const nextStatus = input.status === "ACTIVE" ? "ACTIVE" : "SUSPENDED"
    const tenant = await ruoyiPrisma.tenant.update({
      where: { id: input.tenantId },
      data: { status: nextStatus },
      select: {
        id: true,
        name: true,
        tenantKey: true,
        status: true,
        packageId: true,
        expiresAt: true,
      },
    })

    domainLog.audit("system.tenant.update-status", {
      operatorId,
      tenantId: input.tenantId,
      status: input.status,
      source: "db",
    })

    return {
      id: tenant.id,
      name: tenant.name,
      contactName: tenant.tenantKey,
      status: tenant.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      packageId: tenant.packageId ?? "",
      expireAt: tenant.expiresAt?.toISOString() ?? "",
    }
  }

  static async assignPackage(operatorId: string, input: AssignTenantPackageInput) {
    const exists = await ruoyiPrisma.tenant.findUnique({
      where: { id: input.tenantId },
      select: { id: true },
    })
    if (!exists) {
      throw new Error("租户不存在")
    }

    const tenant = await ruoyiPrisma.tenant.update({
      where: { id: input.tenantId },
      data: { packageId: input.packageId },
      select: {
        id: true,
        name: true,
        tenantKey: true,
        status: true,
        packageId: true,
        expiresAt: true,
      },
    })

    domainLog.audit("system.tenant.assign-package", {
      operatorId,
      tenantId: input.tenantId,
      packageId: input.packageId,
      source: "db",
    })

    return {
      id: tenant.id,
      name: tenant.name,
      contactName: tenant.tenantKey,
      status: tenant.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      packageId: tenant.packageId ?? "",
      expireAt: tenant.expiresAt?.toISOString() ?? "",
    }
  }
}
