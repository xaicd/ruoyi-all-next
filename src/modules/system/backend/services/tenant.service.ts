/**
 * System Tenant Service - 租户管理
 */

import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class SystemTenantService {
  static async list(input: any) {
    const result = await SystemTenantRepository.findList(input)
    domainLog.event("system.tenant.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const tenant = await SystemTenantRepository.findById(id)
    if (!tenant) throw new Error(`租户不存在: ${id}`)
    return tenant
  }

  static async create(input: any) {
    const tenant = await SystemTenantRepository.create(input)
    domainLog.event("system.tenant.create", { tenantId: tenant.id })
    domainLog.audit("system.tenant.create", { targetType: "TENANT", targetId: tenant.id })
    return { id: tenant.id }
  }

  static async update(input: { id: string; name?: string; contactName?: string; contactPhone?: string; domain?: string; packageId?: string; status?: string; expireTime?: string; accountCount?: number }) {
    const existing = await SystemTenantRepository.findById(input.id)
    if (!existing) throw new Error(`租户不存在: ${input.id}`)
    const { id, ...data } = input
    await SystemTenantRepository.update(id, data)
    domainLog.event("system.tenant.update", { tenantId: id })
    domainLog.audit("system.tenant.update", { targetType: "TENANT", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await SystemTenantRepository.findById(id)
    if (!existing) throw new Error(`租户不存在: ${id}`)
    await SystemTenantRepository.delete(id)
    domainLog.event("system.tenant.delete", { tenantId: id })
    domainLog.audit("system.tenant.delete", { targetType: "TENANT", targetId: id })
    return { success: true }
  }

  static async updateStatus(id: string, status: "ACTIVE" | "DISABLED") {
    const existing = await SystemTenantRepository.findById(id)
    if (!existing) throw new Error(`租户不存在: ${id}`)
    await SystemTenantRepository.update(id, { status })
    domainLog.event("system.tenant.updateStatus", { tenantId: id, status })
    domainLog.audit("system.tenant.updateStatus", { targetType: "TENANT", targetId: id, newStatus: status })
    return { success: true }
  }

  /** 分配套餐给租户 */
  static async assignPackage(_operatorId: string, input: { tenantId: string; packageId: string }) {
    const tenant = await SystemTenantRepository.findById(input.tenantId)
    if (!tenant) throw new Error(`租户不存在: ${input.tenantId}`)

    const pkg = await TenantPackageRepository.findById(input.packageId)
    if (!pkg) throw new Error(`套餐不存在: ${input.packageId}`)
    if (pkg.status !== "ACTIVE") throw new Error(`套餐已停用: ${pkg.name}`)

    await SystemTenantRepository.update(input.tenantId, { packageId: input.packageId })
    domainLog.event("system.tenant.assignPackage", { tenantId: input.tenantId, packageId: input.packageId })
    domainLog.audit("system.tenant.assignPackage", { targetType: "TENANT", targetId: input.tenantId, packageId: input.packageId })
    return { success: true }
  }
}
