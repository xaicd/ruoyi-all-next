/**
 * Tenant Lifecycle Database and In-Memory Persistence Executor
 */

import { randomUUID } from "node:crypto"
import type { CreateTenantWithAdminInput } from "@/modules/system/backend/validators"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository, convergeTenantRoleMenus } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemRoleRepository } from "@/modules/system/backend/repositories/role.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { getTenantAssignableMenuIds } from "@/modules/system/backend/services/tenant-menu-scope.service"
import { generateSalt, hashPassword } from "@/modules/shared/backend/lib/crypto"
import { getKyselyDb } from "@/modules/shared/backend/lib/database"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import {
  type TenantUpdateInput,
  requireActivePackage,
  tenantAdminRoleCode,
  defaultExpireTime,
  validateSubscriptionWindow,
} from "./tenant-subscription.helper"

export async function createTenantInMemory(input: CreateTenantWithAdminInput): Promise<{ id: string; adminUserId: string }> {
  await requireActivePackage(input.packageId)
  const duplicate = await SystemUserRepository.findByUsername(input.adminUsername)
  if (duplicate) throw new Error(`管理员账号已存在: ${input.adminUsername}`)
  const effectiveAt = input.effectiveAt ?? new Date().toISOString()
  const expireTime = input.expireTime === undefined ? defaultExpireTime(new Date(effectiveAt)).toISOString() : input.expireTime
  validateSubscriptionWindow(effectiveAt, expireTime)
  const tenant = await SystemTenantRepository.create({
    tenantCode: input.tenantCode,
    name: input.name,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    domain: input.domain,
    packageId: input.packageId,
    status: input.status,
    effectiveAt,
    expireTime,
    accountLimit: input.accountLimit,
  })
  return runWithTenantContext({ tenantId: tenant.id, endpoint: "admin", isPlatform: false }, async () => {
    const salt = generateSalt()
    const admin = await SystemUserRepository.create({
      username: input.adminUsername,
      nickname: input.adminNickname,
      password: hashPassword(input.adminPassword, salt),
      salt,
      phone: input.adminPhone,
      email: input.adminEmail,
      tenantId: tenant.id,
    })
    const role = await SystemRoleRepository.create({ name: "租户管理员", code: tenantAdminRoleCode(tenant.tenantCode), remark: "租户创建时自动初始化" })
    const pkg = await TenantPackageRepository.findById(input.packageId)
    await SystemPermissionService.assignRoleMenu({ roleId: role.id, menuIds: pkg!.menuIds })
    await SystemPermissionService.assignUserRole({ userId: admin.id, roleIds: [role.id] })
    return { id: tenant.id, adminUserId: admin.id }
  })
}

export async function createTenantInDatabase(input: CreateTenantWithAdminInput): Promise<{ id: string; adminUserId: string }> {
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
    await trx.insertInto("system_tenant").values({
      id: tenantId,
      tenant_code: input.tenantCode,
      name: input.name,
      contact_name: input.contactName ?? null,
      contact_phone: input.contactPhone ?? null,
      domain: input.domain ?? null,
      package_id: input.packageId,
      status: input.status,
      effective_at: effectiveAt,
      expire_time: expireAt,
      account_limit: input.accountLimit ?? null,
      created_at: now,
      updated_at: now,
      deleted: false,
    }).execute()
    await trx.insertInto("system_tenant_subscription").values({
      id: randomUUID(),
      tenant_id: tenantId,
      package_id: input.packageId,
      effective_at: effectiveAt,
      expire_at: expireAt,
      account_limit: input.accountLimit ?? null,
      status: "ACTIVE",
      change_type: "CREATE",
      remark: "创建租户时初始化",
      created_by: null,
      created_at: now,
    }).execute()
    await trx.insertInto("system_user").values({
      id: adminUserId,
      username: input.adminUsername,
      nickname: input.adminNickname,
      password: hashPassword(input.adminPassword, salt),
      salt,
      phone: input.adminPhone ?? null,
      email: input.adminEmail ?? null,
      avatar: null,
      status: "ACTIVE",
      dept_id: null,
      remark: "租户创建时自动初始化的管理员",
      login_ip: null,
      login_date: now.toISOString(),
      tenant_id: tenantId,
      created_at: now,
      updated_at: now,
      deleted: false,
    }).execute()
    await trx.insertInto("system_role").values({
      id: roleId,
      name: "租户管理员",
      code: tenantAdminRoleCode(input.tenantCode),
      sort: 0,
      status: "ACTIVE",
      remark: "租户创建时自动初始化",
      data_scope: "ALL",
      tenant_id: tenantId,
      created_at: now,
      updated_at: now,
      deleted: false,
    }).execute()
    await trx.insertInto("system_user_role").values({ id: randomUUID(), user_id: adminUserId, role_id: roleId }).execute()
    if (safeMenuIds.size) await trx.insertInto("system_role_menu").values([...safeMenuIds].map((menuId) => ({ id: randomUUID(), role_id: roleId, menu_id: menuId }))).execute()
    return { id: tenantId, adminUserId }
  })
}

export async function updateTenantInDatabase(input: TenantUpdateInput): Promise<void> {
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
    await trx.insertInto("system_tenant_subscription").values({
      id: randomUUID(),
      tenant_id: input.id,
      package_id: packageId,
      effective_at: effectiveAt,
      expire_at: expireAt,
      account_limit: input.accountLimit !== undefined ? input.accountLimit : existing.account_limit,
      status: "ACTIVE",
      change_type: input.packageId !== undefined ? "PACKAGE_CHANGE" : "MANUAL",
      remark: "租户权益调整",
      created_by: input.createdBy ?? null,
      created_at: new Date(),
    }).execute()
    if (input.packageId !== undefined) {
      const menuRows = await trx.selectFrom("system_tenant_package_menu").select("menu_id").where("package_id", "=", packageId).execute()
      await convergeTenantRoleMenus(trx, packageId, [...await getTenantAssignableMenuIds(menuRows.map((row) => row.menu_id))], [input.id])
    }
  })
}
