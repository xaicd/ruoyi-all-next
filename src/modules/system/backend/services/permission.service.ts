import { SystemMenuRepository } from "@/modules/system/backend/repositories/menu.repository"
import { SystemPermissionRepository } from "@/modules/system/backend/repositories/permission.repository"
import { SystemRoleRepository } from "@/modules/system/backend/repositories/role.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { getCurrentTenantId, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

type AssignUserRoleInput = { userId: string; roleIds: string[] }
type AssignRoleMenuInput = { roleId: string; menuIds: string[] }

function resolveInput<T>(operatorOrInput: string | T, possibleInput?: T): T {
  return (typeof operatorOrInput === "string" ? possibleInput : operatorOrInput) as T
}

async function requireUserAndRoles(input: AssignUserRoleInput): Promise<void> {
  const user = await SystemUserRepository.findById(input.userId)
  if (!user) throw new Error(`用户不存在或不属于当前租户: ${input.userId}`)

  for (const roleId of input.roleIds) {
    const role = await SystemRoleRepository.findById(roleId)
    if (!role) throw new Error(`角色不存在或不属于当前租户: ${roleId}`)
  }
}

async function requireRoleAndMenus(input: AssignRoleMenuInput): Promise<void> {
  const role = await SystemRoleRepository.findById(input.roleId)
  if (!role) throw new Error(`角色不存在或不属于当前租户: ${input.roleId}`)

  const tenantId = getCurrentTenantId()
  let allowedMenuIds: Set<string> | undefined
  if (tenantId && !isPlatformContext()) {
    const tenant = await SystemTenantRepository.findById(tenantId)
    if (!tenant?.packageId) throw new Error("当前租户未分配套餐，不能配置角色菜单")
    const pkg = await TenantPackageRepository.findById(tenant.packageId)
    if (!pkg || pkg.status !== "ACTIVE") throw new Error("当前租户套餐不可用，不能配置角色菜单")
    allowedMenuIds = new Set(pkg.menuIds)
  }
  for (const menuId of input.menuIds) {
    const menu = await SystemMenuRepository.findById(menuId)
    if (!menu) throw new Error(`菜单不存在: ${menuId}`)
    if (allowedMenuIds && !allowedMenuIds.has(menuId)) throw new Error(`菜单不在当前租户套餐范围内: ${menuId}`)
  }
}

/** 用户角色与角色菜单关联；用户/角色由当前 tenant context 过滤，菜单为显式平台全局目录。 */
export class SystemPermissionService {
  static async assignUserRole(input: AssignUserRoleInput): Promise<{ success: true; roleIds: string[] }>
  static async assignUserRole(operatorId: string, input: AssignUserRoleInput): Promise<{ success: true; roleIds: string[] }>
  static async assignUserRole(operatorOrInput: string | AssignUserRoleInput, possibleInput?: AssignUserRoleInput) {
    const input = resolveInput(operatorOrInput, possibleInput)
    await requireUserAndRoles(input)
    await SystemPermissionRepository.replaceUserRoles(input.userId, input.roleIds)
    const roleIds = await SystemPermissionRepository.findUserRoleIds(input.userId)
    domainLog.event("system.permission.assignUserRole", { userId: input.userId, roleCount: roleIds.length })
    domainLog.audit("system.permission.assignUserRole", { targetType: "USER", targetId: input.userId })
    return { success: true as const, roleIds }
  }

  static async assignRoleMenu(input: AssignRoleMenuInput): Promise<{ success: true; menuIds: string[] }>
  static async assignRoleMenu(operatorId: string, input: AssignRoleMenuInput): Promise<{ success: true; menuIds: string[] }>
  static async assignRoleMenu(operatorOrInput: string | AssignRoleMenuInput, possibleInput?: AssignRoleMenuInput) {
    const input = resolveInput(operatorOrInput, possibleInput)
    await requireRoleAndMenus(input)
    await SystemPermissionRepository.replaceRoleMenus(input.roleId, input.menuIds)
    const menuIds = await SystemPermissionRepository.findRoleMenuIds(input.roleId)
    domainLog.event("system.permission.assignRoleMenu", { roleId: input.roleId, menuCount: menuIds.length })
    domainLog.audit("system.permission.assignRoleMenu", { targetType: "ROLE", targetId: input.roleId })
    return { success: true as const, menuIds }
  }

  static async getRoleMenuIds(roleId: string): Promise<string[]> {
    const role = await SystemRoleRepository.findById(roleId)
    if (!role) throw new Error(`角色不存在或不属于当前租户: ${roleId}`)
    return SystemPermissionRepository.findRoleMenuIds(roleId)
  }

  /** 聚合用户所有角色的菜单，用于导航与资源权限判断。 */
  static async getUserMenuIds(userId: string): Promise<string[]> {
    const roleIds = await SystemPermissionService.getUserRoleIds(userId)
    const menuIdGroups = await Promise.all(roleIds.map((roleId) => SystemPermissionService.getRoleMenuIds(roleId)))
    return [...new Set(menuIdGroups.flat())]
  }

  static async getUserRoleIds(userId: string): Promise<string[]> {
    const user = await SystemUserRepository.findById(userId)
    if (!user) throw new Error(`用户不存在或不属于当前租户: ${userId}`)
    return SystemPermissionRepository.findUserRoleIds(userId)
  }

  static async page(_input: unknown) { return { items: [], total: 0, page: 1, pageSize: 20 } }
  static async get(_id: string) { return null }
  static async create(input: AssignUserRoleInput) { return SystemPermissionService.assignUserRole(input) }
  static async update(input: AssignRoleMenuInput) { return SystemPermissionService.assignRoleMenu(input) }
  static async delete(_id: string) { return { success: true } }
}
