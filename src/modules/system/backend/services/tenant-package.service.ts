/**
 * System TenantPackage Service - 租户套餐
 */

import { SystemMenuRepository } from "@/modules/system/backend/repositories/menu.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

async function requireGlobalMenus(menuIds: string[] | undefined): Promise<void> {
  if (!menuIds) return
  for (const menuId of menuIds) {
    const menu = await SystemMenuRepository.findById(menuId)
    if (!menu) throw new Error(`菜单不存在: ${menuId}`)
    if (menu.status !== "ACTIVE") throw new Error(`菜单已停用: ${menuId}`)
  }
}

export class SystemTenantPackageService {
  static async list(input: any) {
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

  static async create(input: any) {
    await requireGlobalMenus(input.menuIds)
    const pkg = await TenantPackageRepository.create(input)
    domainLog.event("system.tenantPackage.create", { packageId: pkg.id })
    domainLog.audit("system.tenantPackage.create", { targetType: "TENANT_PACKAGE", targetId: pkg.id })
    return { id: pkg.id }
  }

  static async update(input: { id: string; name?: string; status?: string; menuIds?: string[]; remark?: string }) {
    const existing = await TenantPackageRepository.findById(input.id)
    if (!existing) throw new Error(`套餐不存在: ${input.id}`)
    await requireGlobalMenus(input.menuIds)
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
