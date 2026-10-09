/**
 * System Auth Permission & Menu Tree Helpers
 */

import { SystemUserRepository, type SystemUserRow } from "@/modules/system/backend/repositories/user.repository"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantEntitlementService } from "@/modules/system/backend/services/tenant-entitlement.service"
import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { verifyPassword as cryptoVerifyPassword } from "@/modules/shared/backend/lib/crypto"
import { getPlatformRole, isPlatformUsername, runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

export type MenuTreeNode = {
  id: string
  name: string
  path: string | null
  icon: string | null
  permission: string | null
  children: MenuTreeNode[]
}

export function verifyPasswordCheck(inputPassword: string, storedHash: string, salt: string): boolean {
  return cryptoVerifyPassword(inputPassword, storedHash, salt)
}

export function resolveLoginRoles(username: string): string[] {
  return isPlatformUsername(username) ? ["admin", getPlatformRole()] : ["admin"]
}

export async function resolveLoginTenantId(tenantCode: string | undefined): Promise<string | undefined> {
  if (!tenantCode) return undefined
  const tenant = await SystemTenantRepository.findByTenantCode(tenantCode)
  if (!tenant) throw new Error("租户编码不存在")
  return tenant.id
}

export async function requireUsableTenant(user: SystemUserRow, isPlatform: boolean): Promise<void> {
  if (isPlatform) return
  if (!user.tenantId) throw new Error("账号未绑定租户")
  await TenantEntitlementService.resolve(user.tenantId)
}

export async function getEffectivePermissions(
  user: SystemUserRow,
  roles: string[]
): Promise<{ menuIds: Set<string>; permissions: string[] }> {
  const isPlatform = roles.includes(getPlatformRole())
  await requireUsableTenant(user, isPlatform)
  const menuIds = new Set(
    await runWithTenantContext(
      { tenantId: user.tenantId ?? undefined, actorId: user.id, endpoint: "admin", isPlatform },
      () => SystemPermissionService.getEffectiveUserMenuIds(user.id),
    )
  )
  const permissions = (await SystemMenuRepository.findAll({ status: "ACTIVE" }))
    .filter((menu) => menuIds.has(menu.id) && menu.permission)
    .map((menu) => menu.permission!)
  return { menuIds, permissions }
}

export function buildMenuTree(menus: SystemMenuRow[]): MenuTreeNode[] {
  const map = new Map<string, MenuTreeNode>()
  const roots: MenuTreeNode[] = []

  // 只取目录和菜单，不取按钮
  const filtered = menus.filter((m) => m.type === "DIR" || m.type === "MENU")

  for (const m of filtered) {
    map.set(m.id, { id: m.id, name: m.name, path: m.path, icon: m.icon, permission: m.permission, children: [] })
  }

  for (const m of filtered) {
    const node = map.get(m.id)!
    if (m.parentId && map.has(m.parentId)) {
      map.get(m.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
