/**
 * System TenantPackage Service - 租户套餐
 */

import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class SystemTenantPackageService {
  static async list(input: { page: number; pageSize: number; keyword?: string }) {
    const result = await TenantPackageRepository.findList(input)
    domainLog.event("system.tenantPackage.list", { total: result.total })
    return result
  }

  static async getAll() {
    return TenantPackageRepository.findAll()
  }

  static async getById(id: string) {
    const pkg = await TenantPackageRepository.findById(id)
    if (!pkg) throw new Error(`套餐不存在: ${id}`)
    return pkg
  }

  static async create(input: { name: string; status?: string; menuIds?: string[]; remark?: string }) {
    const pkg = await TenantPackageRepository.create(input)
    domainLog.event("system.tenantPackage.create", { packageId: pkg.id })
    domainLog.audit("system.tenantPackage.create", { targetType: "TENANT_PACKAGE", targetId: pkg.id })
    return { id: pkg.id }
  }

  static async update(input: { id: string; name?: string; status?: string; menuIds?: string[]; remark?: string }) {
    const existing = await TenantPackageRepository.findById(input.id)
    if (!existing) throw new Error(`套餐不存在: ${input.id}`)
    const { id, ...data } = input
    await TenantPackageRepository.update(id, data)
    domainLog.event("system.tenantPackage.update", { packageId: id })
    domainLog.audit("system.tenantPackage.update", { targetType: "TENANT_PACKAGE", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    await TenantPackageRepository.delete(id)
    domainLog.event("system.tenantPackage.delete", { packageId: id })
    domainLog.audit("system.tenantPackage.delete", { targetType: "TENANT_PACKAGE", targetId: id })
    return { success: true }
  }
}
