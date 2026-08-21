/**
 * System Tenant Service - 租户管理
 */

import { randomUUID } from "node:crypto"
import type { CreateTenantWithAdminInput } from "@/modules/system/backend/validators"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository, convergeTenantRoleMenus } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemRoleRepository } from "@/modules/system/backend/repositories/role.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { getTenantAssignableMenuIds } from "@/modules/system/backend/services/tenant-menu-scope.service"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { generateSalt, hashPassword } from "@/modules/shared/backend/lib/crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

type TenantUpdateInput = {
  id: string
  name?: string
  contactName?: string
  contactPhone?: string
  domain?: string
  packageId?: string
  status?: string
  effectiveAt?: string
  expireTime?: string | null
  accountLimit?: number | null
  createdBy?: string
}

async function requireActivePackage(packageId: string | undefined): Promise<void> {
  if (!packageId) return
  const pkg = await TenantPackageRepository.findById(packageId)
  if (!pkg) throw new Error(`套餐不存在: ${packageId}`)
  if (pkg.status !== "ACTIVE") throw new Error(`套餐已停用: ${pkg.name}`)
}

function normalizeTenantCode(code: string): string {
  return code.trim().toLowerCase()
}

function tenantAdminRoleCode(tenantCode: string): string {
  return `tenant-admin-${tenantCode}`
}

async function requireAvailableTenantCode(tenantCode: string, currentTenantId?: string): Promise<void> {
  const existing = await SystemTenantRepository.findByTenantCode(normalizeTenantCode(tenantCode))
  if (existing && existing.id !== currentTenantId) throw new Error(`租户编码已存在: ${tenantCode}`)
}

async function enrichTenantEntitlements<T extends { id: string; packageId: string | null; accountLimit: number | null }>(value: T | T[]): Promise<(T & { packageName: string | null; accountUsed: number; effectiveAccountLimit: number | null }) | Array<T & { packageName: string | null; accountUsed: number; effectiveAccountLimit: number | null }>> {
  const packages = new Map((await TenantPackageRepository.findAll()).map((pkg) => [pkg.id, pkg]))
  const enrich = async (tenant: T) => {
    const pkg = tenant.packageId ? packages.get(tenant.packageId) : undefined
    return {
      ...tenant,
      packageName: pkg?.name ?? null,
      accountUsed: await SystemUserRepository.count({ tenantId: tenant.id }),
      effectiveAccountLimit: tenant.accountLimit ?? pkg?.accountLimit ?? null,
    }
  }
  return Array.isArray(value) ? Promise.all(value.map(enrich)) : enrich(value)
}

function defaultExpireTime(effectiveAt: Date): Date {
  const expireAt = new Date(effectiveAt)
  expireAt.setUTCFullYear(expireAt.getUTCFullYear() + 10)
  return expireAt
}

function validateSubscriptionWindow(effectiveAt: string, expireTime: string | null | undefined): void {
  if (Number.isNaN(new Date(effectiveAt).getTime())) throw new Error("生效时间格式无效")
  if (expireTime && new Date(effectiveAt).getTime() >= new Date(expireTime).getTime()) throw new Error("过期时间必须晚于生效时间")
}

async function createInMemory(input: CreateTenantWithAdminInput): Promise<{ id: string; adminUserId: string }> {
  await requireActivePackage(input.packageId)
  const duplicate = await SystemUserRepository.findByUsername(input.adminUsername)
  if (duplicate) throw new Error(`管理员账号已存在: ${input.adminUsername}`)
  const effectiveAt = input.effectiveAt ?? new Date().toISOString()
  const expireTime = input.expireTime === undefined ? defaultExpireTime(new Date(effectiveAt)).toISOString() : input.expireTime
  validateSubscriptionWindow(effectiveAt, expireTime)
  const tenant = await SystemTenantRepository.create({ tenantCode: input.tenantCode, name: input.name, contactName: input.contactName, contactPhone: input.contactPhone, domain: input.domain, packageId: input.packageId, status: input.status, effectiveAt, expireTime, accountLimit: input.accountLimit })
  return runWithTenantContext({ tenantId: tenant.id, endpoint: "admin", isPlatform: false }, async () => {
    const salt = generateSalt()
    const admin = await SystemUserRepository.create({ username: input.adminUsername, nickname: input.adminNickname, password: hashPassword(input.adminPassword, salt), salt, phone: input.adminPhone, email: input.adminEmail, tenantId: tenant.id })
    const role = await SystemRoleRepository.create({ name: "租户管理员", code: tenantAdminRoleCode(tenant.tenantCode), remark: "租户创建时自动初始化" })
    const pkg = await TenantPackageRepository.findById(input.packageId)
    await SystemPermissionService.assignRoleMenu({ roleId: role.id, menuIds: pkg!.menuIds })
    await SystemPermissionService.assignUserRole({ userId: admin.id, roleIds: [role.id] })
    return { id: tenant.id, adminUserId: admin.id }
  })
}

async function createInDatabase(input: CreateTenantWithAdminInput): Promise<{ id: string; adminUserId: string }> {
  const db = await getKyselyDb()
  return db.transaction().execute(async (trx) => {
    const pkg = await trx.selectFrom("system_tenant_package").select("id").where("id", "=", input.packageId).where("status", "=", "ACTIVE").where("deleted", "=", false).executeTakeFirst()
    if (!pkg) throw new Error("套餐不存在或已停用")
    const duplicate = await trx.selectFrom("system_user").select("id").where("username", "=", input.adminUsername).where("deleted", "=", false).executeTakeFirst()
    if (duplicate) throw new Error(`管理员账号已存在: ${input.adminUsername}`)
    const tenantId = randomUUID()
    const adminUserId = randomUUID()
    const roleId = randomUUID()
    const now = new Date()
    const effectiveAt = input.effectiveAt ? new Date(input.effectiveAt) : now
    const expireAt = input.expireTime === undefined ? defaultExpireTime(effectiveAt) : input.expireTime ? new Date(input.expireTime) : null
    validateSubscriptionWindow(effectiveAt.toISOString(), expireAt?.toISOString())
    const salt = generateSalt()
    const menuRows = await trx.selectFrom("system_tenant_package_menu").select("menu_id").where("package_id", "=", input.packageId).execute()
    const safeMenuIds = await getTenantAssignableMenuIds(menuRows.map((row) => row.menu_id))
    await trx.insertInto("system_tenant").values({ id: tenantId, tenant_code: input.tenantCode, name: input.name, contact_name: input.contactName ?? null, contact_phone: input.contactPhone ?? null, domain: input.domain ?? null, package_id: input.packageId, status: input.status, effective_at: effectiveAt, expire_time: expireAt, account_limit: input.accountLimit ?? null, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_tenant_subscription").values({ id: randomUUID(), tenant_id: tenantId, package_id: input.packageId, effective_at: effectiveAt, expire_at: expireAt, account_limit: input.accountLimit ?? null, status: "ACTIVE", change_type: "CREATE", remark: "创建租户时初始化", created_by: null, created_at: now }).execute()
    await trx.insertInto("system_user").values({ id: adminUserId, username: input.adminUsername, nickname: input.adminNickname, password: hashPassword(input.adminPassword, salt), salt, phone: input.adminPhone ?? null, email: input.adminEmail ?? null, avatar: null, status: "ACTIVE", dept_id: null, remark: "租户创建时自动初始化的管理员", login_ip: null, login_date: now.toISOString(), tenant_id: tenantId, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_role").values({ id: roleId, name: "租户管理员", code: tenantAdminRoleCode(input.tenantCode), sort: 0, status: "ACTIVE", remark: "租户创建时自动初始化", data_scope: "ALL", tenant_id: tenantId, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_user_role").values({ id: randomUUID(), user_id: adminUserId, role_id: roleId }).execute()
    if (safeMenuIds.size) await trx.insertInto("system_role_menu").values([...safeMenuIds].map((menuId) => ({ id: randomUUID(), role_id: roleId, menu_id: menuId }))).execute()
    return { id: tenantId, adminUserId }
  })
}

async function updateInDatabase(input: TenantUpdateInput): Promise<void> {
  const db = await getKyselyDb()
  await db.transaction().execute(async (trx) => {
    const existing = await trx.selectFrom("system_tenant").selectAll().where("id", "=", input.id).where("deleted", "=", false).forUpdate().executeTakeFirst()
    if (!existing) throw new Error(`租户不存在: ${input.id}`)
    const packageId = input.packageId ?? existing.package_id
    if (input.packageId !== undefined) {
      const pkg = await trx.selectFrom("system_tenant_package").select("id").where("id", "=", packageId).where("status", "=", "ACTIVE").where("deleted", "=", false).executeTakeFirst()
      if (!pkg) throw new Error("套餐不存在或已停用")
    }
    if (!packageId && (input.effectiveAt !== undefined || input.expireTime !== undefined || input.accountLimit !== undefined)) throw new Error("租户未分配套餐")
    const effectiveAt = input.effectiveAt ? new Date(input.effectiveAt) : existing.effective_at
    const expireAt = input.expireTime === undefined ? existing.expire_time : input.expireTime ? new Date(input.expireTime) : null
    validateSubscriptionWindow(effectiveAt.toISOString(), expireAt?.toISOString())
    const updates: Record<string, unknown> = { updated_at: new Date() }
    if (input.name !== undefined) updates.name = input.name
    if (input.contactName !== undefined) updates.contact_name = input.contactName || null
    if (input.contactPhone !== undefined) updates.contact_phone = input.contactPhone || null
    if (input.domain !== undefined) updates.domain = input.domain || null
    if (input.packageId !== undefined) updates.package_id = input.packageId
    if (input.status !== undefined) updates.status = input.status
    if (input.effectiveAt !== undefined) updates.effective_at = effectiveAt
    if (input.expireTime !== undefined) updates.expire_time = expireAt
    if (input.accountLimit !== undefined) updates.account_limit = input.accountLimit
    await trx.updateTable("system_tenant").set(updates as any).where("id", "=", input.id).execute()
    const entitlementChanged = input.packageId !== undefined || input.effectiveAt !== undefined || input.expireTime !== undefined || input.accountLimit !== undefined
    if (!entitlementChanged || !packageId) return
    await trx.updateTable("system_tenant_subscription").set({ status: "SUPERSEDED" }).where("tenant_id", "=", input.id).where("status", "=", "ACTIVE").execute()
    await trx.insertInto("system_tenant_subscription").values({ id: randomUUID(), tenant_id: input.id, package_id: packageId, effective_at: effectiveAt, expire_at: expireAt, account_limit: input.accountLimit !== undefined ? input.accountLimit : existing.account_limit, status: "ACTIVE", change_type: input.packageId !== undefined ? "PACKAGE_CHANGE" : "MANUAL", remark: "租户权益调整", created_by: input.createdBy ?? null, created_at: new Date() }).execute()
    if (input.packageId !== undefined) {
      const menuRows = await trx.selectFrom("system_tenant_package_menu").select("menu_id").where("package_id", "=", packageId).execute()
      await convergeTenantRoleMenus(trx, packageId, [...await getTenantAssignableMenuIds(menuRows.map((row) => row.menu_id))], [input.id])
    }
  })
}

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
    const result = hasRealDatabase() ? await createInDatabase(normalizedInput) : await createInMemory(normalizedInput)
    domainLog.event("system.tenant.create", { tenantId: result.id, adminUserId: result.adminUserId })
    domainLog.audit("system.tenant.create", { targetType: "TENANT", targetId: result.id, adminUserId: result.adminUserId })
    return result
  }

  static async update(input: TenantUpdateInput) {
    if (hasRealDatabase()) await updateInDatabase(input)
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
