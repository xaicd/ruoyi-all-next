/**
 * System Auth Service
 *
 * 登录/鉴权/权限信息
 * 使用 Repository 模式，不直接依赖 Prisma Client
 */

import type { LoginInput } from "@/modules/system/backend/validators"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// === JWT 工具（轻量实现，不依赖外部库）===

const JWT_SECRET = process.env.JWT_SECRET || "ruoyi-all-next-dev-secret-key-2026"
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 86400 // 24h

type TokenPayload = {
  sub: string
  username: string
  permissions: string[]
  roles: string[]
  tenantId?: string
  iat: number
  exp: number
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64url")
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString()
}

function createHmacSignature(data: string, secret: string): string {
  const crypto = require("crypto")
  return crypto.createHmac("sha256", secret).update(data).digest("base64url")
}

function signToken(payload: Omit<TokenPayload, "iat" | "exp">): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRES_IN,
  }

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = createHmacSignature(`${header}.${body}`, JWT_SECRET)

  return `${header}.${body}.${signature}`
}

function verifyToken(token: string): TokenPayload {
  const parts = token.split(".")
  if (parts.length !== 3) throw new Error("Invalid token format")

  const [header, body, signature] = parts
  const expectedSig = createHmacSignature(`${header}.${body}`, JWT_SECRET)

  if (signature !== expectedSig) {
    throw new Error("Invalid token signature")
  }

  const payload: TokenPayload = JSON.parse(base64UrlDecode(body))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired")
  }

  return payload
}

// === 密码校验 ===

import { verifyPassword as cryptoVerifyPassword, hashPassword, generateSalt } from "@/modules/shared/backend/lib/crypto"

function verifyPasswordCheck(inputPassword: string, storedHash: string, salt: string): boolean {
  return cryptoVerifyPassword(inputPassword, storedHash, salt)
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

    const user = await SystemUserRepository.findByUsername(input.username)
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

    // 获取权限码（从菜单中提取 BUTTON 类型的 permission）
    const allMenus = await SystemMenuRepository.findAll({ status: "ACTIVE" })
    const permissions = allMenus
      .filter((m) => m.type === "BUTTON" && m.permission)
      .map((m) => m.permission!)

    // 签发 JWT
    const token = signToken({
      sub: user.id,
      username: user.username,
      permissions,
      roles: ["admin"], // TODO: 从 user-role 关联表获取
      tenantId: user.tenantId ?? undefined,
    })

    domainLog.audit("system.auth.login.success", { targetType: "USER", targetId: user.id })

    return {
      token,
      expiresIn: JWT_EXPIRES_IN,
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

    const allMenus = await SystemMenuRepository.findAll({ status: "ACTIVE" })

    // 权限码
    const permissions = allMenus
      .filter((m) => m.type === "BUTTON" && m.permission)
      .map((m) => m.permission!)

    // 菜单树
    const menus = buildMenuTree(allMenus)

    domainLog.event("system.auth.permissionInfo", { userId })

    return {
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      roles: ["admin"], // TODO: 从 user-role 关联表获取
      permissions,
      menus,
    }
  }

  /** 验证 token 并返回用户信息 */
  static async verifyToken(token: string): Promise<TokenPayload> {
    return verifyToken(token)
  }

  /** 刷新 token */
  static async refreshToken(token: string) {
    const payload = verifyToken(token)
    const newToken = signToken({
      sub: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
      roles: payload.roles,
      tenantId: payload.tenantId,
    })
    return { token: newToken, expiresIn: JWT_EXPIRES_IN }
  }
}
