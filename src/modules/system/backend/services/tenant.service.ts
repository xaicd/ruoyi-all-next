/**
 * System Tenant Service - 租户管理
 */

import { randomUUID } from "node:crypto"
import type { CreateTenantWithAdminInput } from "@/modules/system/backend/validators"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemRoleRepository } from "@/modules/system/backend/repositories/role.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { generateSalt, hashPassword } from "@/modules/shared/backend/lib/crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

async function requireActivePackage(packageId: string | undefined): Promise<void> {
  if (!packageId) return
  const pkg = await TenantPackageRepository.findById(packageId)
  if (!pkg) throw new Error(`套餐不存在: ${packageId}`)
  if (pkg.status !== "ACTIVE") throw new Error(`套餐已停用: ${pkg.name}`)
}

async function enrichTenantPackageNames<T extends { packageId: string | null }>(value: T | T[]): Promise<(T & { packageName: string | null }) | Array<T & { packageName: string | null }>> {
  const packages = new Map((await TenantPackageRepository.findAll()).map((pkg) => [pkg.id, pkg.name]))
  const enrich = (tenant: T) => ({ ...tenant, packageName: tenant.packageId ? packages.get(tenant.packageId) ?? null : null })
  return Array.isArray(value) ? value.map(enrich) : enrich(value)
}

async function createInMemory(input: CreateTenantWithAdminInput): Promise<{ id: string; adminUserId: string }> {
  await requireActivePackage(input.packageId)
  const duplicate = await SystemUserRepository.findByUsername(input.adminUsername)
  if (duplicate) throw new Error(`管理员账号已存在: ${input.adminUsername}`)
  const tenant = await SystemTenantRepository.create(input)
  return runWithTenantContext({ tenantId: tenant.id, endpoint: "admin", isPlatform: false }, async () => {
    const salt = generateSalt()
    const admin = await SystemUserRepository.create({ username: input.adminUsername, nickname: input.adminNickname, password: hashPassword(input.adminPassword, salt), salt, phone: input.adminPhone, email: input.adminEmail, tenantId: tenant.id })
    const role = await SystemRoleRepository.create({ name: "租户管理员", code: `tenant_admin_${tenant.id}`, remark: "租户创建时自动初始化" })
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
    const salt = generateSalt()
    const menuRows = await trx.selectFrom("system_tenant_package_menu").select("menu_id").where("package_id", "=", input.packageId).execute()

    await trx.insertInto("system_tenant").values({ id: tenantId, name: input.name, contact_name: input.contactName ?? null, contact_phone: input.contactPhone ?? null, domain: input.domain ?? null, package_id: input.packageId, status: input.status, expire_time: input.expireTime ? new Date(input.expireTime) : null, account_count: input.accountCount, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_user").values({ id: adminUserId, username: input.adminUsername, nickname: input.adminNickname, password: hashPassword(input.adminPassword, salt), salt, phone: input.adminPhone ?? null, email: input.adminEmail ?? null, avatar: null, status: "ACTIVE", dept_id: null, remark: "租户创建时自动初始化的管理员", login_ip: null, login_date: now, tenant_id: tenantId, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_role").values({ id: roleId, name: "租户管理员", code: `tenant_admin_${tenantId}`, sort: 0, status: "ACTIVE", remark: "租户创建时自动初始化", data_scope: "ALL", tenant_id: tenantId, created_at: now, updated_at: now, deleted: false }).execute()
    await trx.insertInto("system_user_role").values({ id: randomUUID(), user_id: adminUserId, role_id: roleId }).execute()
    if (menuRows.length) await trx.insertInto("system_role_menu").values(menuRows.map((row) => ({ id: randomUUID(), role_id: roleId, menu_id: row.menu_id }))).execute()
    return { id: tenantId, adminUserId }
  })
}

export class SystemTenantService {
  static async list(input: any) {
    const result = await SystemTenantRepository.findList(input)
    const items = await enrichTenantPackageNames(result.items) as typeof result.items & Array<{ packageName: string | null }>
    domainLog.event("system.tenant.list", { page: input.page, total: result.total })
    return { ...result, items }
  }

  static async getById(id: string) {
    const tenant = await SystemTenantRepository.findById(id)
    if (!tenant) throw new Error(`租户不存在: ${id}`)
    return enrichTenantPackageNames(tenant)
  }

  /** Creates a usable tenant and its first administrator as one database transaction. */
  static async create(input: CreateTenantWithAdminInput) {
    const result = hasRealDatabase() ? await createInDatabase(input) : await createInMemory(input)
    domainLog.event("system.tenant.create", { tenantId: result.id, adminUserId: result.adminUserId })
    domainLog.audit("system.tenant.create", { targetType: "TENANT", targetId: result.id, adminUserId: result.adminUserId })
    return result
  }

  static async update(input: { id: string; name?: string; contactName?: string; contactPhone?: string; domain?: string; packageId?: string; status?: string; expireTime?: string; accountCount?: number }) {
    const existing = await SystemTenantRepository.findById(input.id)
    if (!existing) throw new Error(`租户不存在: ${input.id}`)
    await requireActivePackage(input.packageId)
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

  static async assignPackage(_operatorId: string, input: { tenantId: string; packageId: string }) {
    const tenant = await SystemTenantRepository.findById(input.tenantId)
    if (!tenant) throw new Error(`租户不存在: ${input.tenantId}`)
    await requireActivePackage(input.packageId)
    await SystemTenantRepository.update(input.tenantId, { packageId: input.packageId })
    domainLog.event("system.tenant.assignPackage", { tenantId: input.tenantId, packageId: input.packageId })
    domainLog.audit("system.tenant.assignPackage", { targetType: "TENANT", targetId: input.tenantId, packageId: input.packageId })
    return { success: true }
  }
}
