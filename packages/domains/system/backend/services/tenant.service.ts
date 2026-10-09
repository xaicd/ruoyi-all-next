/**
 * System Tenant Service - 租户管理
 */

import type { CreateTenantWithAdminInput } from "@/modules/system/backend/validators"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import {
  type TenantUpdateInput,
  requireActivePackage,
  normalizeTenantCode,
  requireAvailableTenantCode,
  enrichTenantEntitlements,
  validateSubscriptionWindow,
} from "./tenant-subscription.helper"
import {
  createTenantInMemory,
  createTenantInDatabase,
  updateTenantInDatabase,
} from "./tenant-lifecycle.executor"

export class SystemTenantService {
  static async list(input: any) {
    const result = await SystemTenantRepository.findList(input)
    const items = await enrichTenantEntitlements(result.items)
    domainLog.event("system.tenant.list", { page: input.page, total: result.total })
    return { ...result, items }
  }

  static async getById(id: string) {
    const tenant = await SystemTenantRepository.findById(id)
    if (!tenant) throw new Error(`租户不存在: ${id}`)
    return enrichTenantEntitlements(tenant)
  }

  /**
   * 平台面：按租户编码解析租户 id。
   *
   * 未认证登录（C 端会员等外部入口）没有租户上下文，只能依赖调用方提供的租户标识；
   * 该方法只做「编码 → 已存在租户 id」的查表，不授予任何数据访问权，也不返回租户其他信息。
   * 由 shared 助手调用；业务域禁止直连平台面（microservice:check 强制）。
   */
  static async resolveTenantIdByCode(input: { tenantCode: string }): Promise<{ tenantId: string | null }> {
    const tenant = await SystemTenantRepository.findByTenantCode(input.tenantCode)
    domainLog.event("system.tenant.resolve-id-by-code", {
      tenantCode: input.tenantCode,
      found: Boolean(tenant),
    })
    return { tenantId: tenant?.id ?? null }
  }

  static async getSubscriptionHistory(id: string) {
    const tenant = await SystemTenantRepository.findById(id)
    if (!tenant) throw new Error(`租户不存在: ${id}`)
    if (!hasRealDatabase()) return []
    const db = await getKyselyDb()
    const [rows, packages] = await Promise.all([
      db.selectFrom("system_tenant_subscription").selectAll().where("tenant_id", "=", id).orderBy("created_at", "desc").execute(),
      TenantPackageRepository.findAll(),
    ])
    const packageNames = new Map(packages.map((pkg) => [pkg.id, pkg.name]))
    return rows.map((row) => ({
      id: row.id,
      packageId: row.package_id,
      packageName: packageNames.get(row.package_id) ?? null,
      effectiveAt: row.effective_at instanceof Date ? row.effective_at.toISOString() : String(row.effective_at),
      expireAt: row.expire_at instanceof Date ? row.expire_at.toISOString() : row.expire_at,
      accountLimit: row.account_limit,
      status: row.status,
      changeType: row.change_type,
      remark: row.remark,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    }))
  }

  static async create(input: CreateTenantWithAdminInput) {
    const normalizedInput = { ...input, tenantCode: normalizeTenantCode(input.tenantCode) }
    await requireAvailableTenantCode(normalizedInput.tenantCode)
    const result = hasRealDatabase() ? await createTenantInDatabase(normalizedInput) : await createTenantInMemory(normalizedInput)
    domainLog.event("system.tenant.create", { tenantId: result.id, adminUserId: result.adminUserId })
    domainLog.audit("system.tenant.create", { targetType: "TENANT", targetId: result.id, adminUserId: result.adminUserId })
    return result
  }

  static async update(input: TenantUpdateInput) {
    if (hasRealDatabase()) await updateTenantInDatabase(input)
    else {
      const existing = await SystemTenantRepository.findById(input.id)
      if (!existing) throw new Error(`租户不存在: ${input.id}`)
      await requireActivePackage(input.packageId)
      validateSubscriptionWindow(input.effectiveAt ?? existing.effectiveAt, input.expireTime === undefined ? existing.expireTime : input.expireTime)
      const { id, createdBy: _createdBy, ...data } = input
      await SystemTenantRepository.update(id, data)
    }
    domainLog.event("system.tenant.update", { tenantId: input.id })
    domainLog.audit("system.tenant.update", { targetType: "TENANT", targetId: input.id })
    return { id: input.id }
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
    return this.update({ id, status })
  }

  static async assignPackage(operatorId: string, input: { tenantId: string; packageId: string }) {
    await this.update({ id: input.tenantId, packageId: input.packageId, createdBy: operatorId })
    domainLog.event("system.tenant.assignPackage", { tenantId: input.tenantId, packageId: input.packageId, operatorId })
    domainLog.audit("system.tenant.assignPackage", { targetType: "TENANT", targetId: input.tenantId, packageId: input.packageId, operatorId })
    return { success: true }
  }

  static async getTenant(input: { id: string }) { return this.getById(input.id) }
  static async deleteTenant(input: { id: string }) { return this.delete(input.id) }
  static async updateTenantStatus(input: { id: string; status: "ACTIVE" | "DISABLED" }) { return this.updateStatus(input.id, input.status) }
  static async assignTenantPackage(input: { tenantId: string; packageId: string; operatorId?: string }) {
    return this.assignPackage(input.operatorId ?? "system", { tenantId: input.tenantId, packageId: input.packageId })
  }
  static async getTenantSubscriptions(input: { id: string }) { return this.getSubscriptionHistory(input.id) }
}

export const systemTenantService = SystemTenantService
