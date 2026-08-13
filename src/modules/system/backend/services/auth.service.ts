/**
 * System Auth Service
 *
 * 登录/鉴权/权限信息
 * 使用 Repository 模式，不直接依赖 Prisma Client
 */

import type { LoginInput } from "@/modules/system/backend/validators"
import { SystemUserRepository, type SystemUserRow } from "@/modules/system/backend/repositories/user.repository"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { issueJwt, verifyJwt, type JwtPayload } from "@/modules/shared/backend/auth/jwt"
import { getPlatformRole, isPlatformUsername, runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

type TokenPayload = JwtPayload

// === 密码校验 ===

import { verifyPassword as cryptoVerifyPassword } from "@/modules/shared/backend/lib/crypto"

function verifyPasswordCheck(inputPassword: string, storedHash: string, salt: string): boolean {
  return cryptoVerifyPassword(inputPassword, storedHash, salt)
}

function resolveLoginRoles(username: string): string[] {
  return isPlatformUsername(username) ? ["admin", getPlatformRole()] : ["admin"]
}

async function resolveLoginTenantId(tenantCode: string | undefined): Promise<string | undefined> {
  if (!tenantCode) return undefined
  const tenant = await SystemTenantRepository.findByTenantCode(tenantCode)
  if (!tenant) throw new Error("租户编码不存在")
  return tenant.id
}

async function requireUsableTenant(user: SystemUserRow, isPlatform: boolean): Promise<void> {
  if (isPlatform) return
  if (!user.tenantId) throw new Error("账号未绑定租户")
  const tenant = await SystemTenantRepository.findById(user.tenantId)
  if (!tenant || tenant.status !== "ACTIVE") throw new Error("租户不存在或已停用")
  if (tenant.expireTime && new Date(tenant.expireTime).getTime() <= Date.now()) throw new Error("租户已过期")
  if (!tenant.packageId) throw new Error("租户未分配套餐")
  const pkg = await TenantPackageRepository.findById(tenant.packageId)
  if (!pkg || pkg.status !== "ACTIVE") throw new Error("租户套餐不可用")
}

async function getEffectivePermissions(user: SystemUserRow, roles: string[]): Promise<{ menuIds: Set<string>; permissions: string[] }> {
  const isPlatform = roles.includes(getPlatformRole())
  await requireUsableTenant(user, isPlatform)
  const menuIds = new Set(await runWithTenantContext(
    { tenantId: user.tenantId ?? undefined, actorId: user.id, endpoint: "admin", isPlatform },
    () => SystemPermissionService.getEffectiveUserMenuIds(user.id),
  ))
  const permissions = (await SystemMenuRepository.findAll({ status: "ACTIVE" }))
    .filter((menu) => menuIds.has(menu.id) && menu.permission)
    .map((menu) => menu.permission!)
  return { menuIds, permissions }
}

// === 菜单树构建 ===

type MenuTreeNode = {
  id: string
  name: string
  path: string | null
  icon: string | null
  permission: string | null
  children: MenuTreeNode[]
}

function buildMenuTree(menus: SystemMenuRow[]): MenuTreeNode[] {
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

// === Service ===

export class SystemAuthService {
  /** 登录 */
  static async login(input: LoginInput) {
    domainLog.event("system.auth.login.attempt", { username: input.username })

    const tenantId = await resolveLoginTenantId(input.tenantCode)
    if (!tenantId && !isPlatformUsername(input.username)) throw new Error("租户账号登录必须填写租户标识")
    const user = await SystemUserRepository.findByUsername(input.username, tenantId)
    if (!user) {
      domainLog.audit("system.auth.login.fail", { targetType: "USER", targetId: input.username, reason: "not_found" })
      throw new Error("用户名或密码错误")
    }

    if (user.status !== "ACTIVE") {
      domainLog.audit("system.auth.login.fail", { targetType: "USER", targetId: user.id, reason: "disabled" })
      throw new Error("账号已禁用，请联系管理员")
    }

    const valid = verifyPasswordCheck(input.password, user.password, user.salt)
    if (!valid) {
      domainLog.audit("system.auth.login.fail", { targetType: "USER", targetId: user.id, reason: "wrong_password" })
      throw new Error("用户名或密码错误")
    }

    const roles = resolveLoginRoles(user.username)
    const { permissions } = await getEffectivePermissions(user, roles)

    // Full RuoYi menu catalogs can contain thousands of button permissions. A platform
    // administrator is already explicitly authorized by role, so store one wildcard in
    // the JWT instead of an oversized Authorization header that proxies reject with 431.
    const jwtPermissions = roles.includes(getPlatformRole()) ? ["*"] : permissions
    if (process.env.TENANT_MODE === "required" && !roles.includes(getPlatformRole()) && !user.tenantId) {
      throw new Error("账号未绑定租户")
    }

    // 签发 JWT
    const { token, expiresIn } = issueJwt({
      sub: user.id,
      username: user.username,
      permissions: jwtPermissions,
      roles,
      tenantId: user.tenantId ?? undefined,
      type: "admin",
    })

    domainLog.audit("system.auth.login.success", { targetType: "USER", targetId: user.id })

    return {
      token,
      expiresIn,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    }
  }

  /** 获取当前用户权限信息 */
  static async getPermissionInfo(userId: string) {
    const user = await SystemUserRepository.findById(userId)
    if (!user) throw new Error("用户不存在")

    const roles = resolveLoginRoles(user.username)
    const { menuIds, permissions } = await getEffectivePermissions(user, roles)
    const allowedMenus = (await SystemMenuRepository.findAll({ status: "ACTIVE" }))
      .filter((menu) => menuIds.has(menu.id))

    // 菜单树
    const menus = buildMenuTree(allowedMenus)

    domainLog.event("system.auth.permissionInfo", { userId })

    return {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      roles,
      permissions,
      menus,
    }
  }

  /** 验证 token 并返回用户信息 */
  static async verifyToken(token: string): Promise<TokenPayload> {
    return verifyJwt(token, "admin")
  }

  /** 刷新 token */
  static async refreshToken(token: string) {
    const payload = verifyJwt(token, "admin")
    const issued = issueJwt({
      sub: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
      roles: payload.roles,
      tenantId: payload.tenantId,
      type: "admin",
    })
    return issued
  }
}
