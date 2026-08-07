import CryptoJS from "crypto-js"
import type { LoginInput } from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"
import { comparePasswordMD5 } from "@/modules/shared/backend/lib/crypto"
import { WILDCARD_PERMISSION } from "@/modules/shared/backend/lib/rbac-registry/role-permissions"

type MenuNode = {
  key: string
  name: string
  path?: string
  children?: MenuNode[]
}

type MenuRow = {
  id: string
  key: string
  name: string
  parentId: string | null
  path: string | null
  type: string
}

function buildMenuTree(rows: MenuRow[]) {
  const nodes = new Map(rows.map((row) => [row.id, { key: row.key, name: row.name, path: row.path ?? undefined, children: [] as MenuNode[] }]))
  const roots: MenuNode[] = []

  for (const row of rows) {
    const node = nodes.get(row.id)
    if (!node) continue
    if (row.parentId) {
      const parent = nodes.get(row.parentId)
      if (parent) {
        parent.children?.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }

  const sort = (items: MenuNode[]) => {
    items.sort((left, right) => left.name.localeCompare(right.name, "zh-CN"))
    items.forEach((item) => {
      if (item.children?.length) sort(item.children)
    })
  }
  sort(roots)
  return roots
}

function verifyStoredPassword(password: string, storedHash: string, salt?: string | null) {
  if (comparePasswordMD5(password, storedHash, salt ?? undefined)) return true
  const md5Password = CryptoJS.MD5(password).toString()
  return comparePasswordMD5(md5Password, storedHash, salt ?? undefined)
}

export class SystemAuthService {
  static async login(input: LoginInput) {
    domainLog.event("system.auth.login", {
      username: input.username,
    })

    const admin = await ruoyiPrisma.admin.findFirst({
      where: {
        OR: [{ username: input.username }, { phone: input.username }],
      },
      select: {
        id: true,
        username: true,
        phone: true,
        name: true,
        password: true,
        salt: true,
        status: true,
        role: true,
      },
    })

    if (!admin) {
      domainLog.audit("system.auth.login.fail", {
        targetType: "ADMIN",
        targetId: input.username,
        reason: "not_found",
      })
      throw new Error("用户名或密码错误")
    }

    if (admin.status !== "ACTIVE") {
      domainLog.audit("system.auth.login.fail", {
        targetType: "ADMIN",
        targetId: admin.id,
        reason: "account_disabled",
      })
      throw new Error("账号已禁用，请联系管理员")
    }

    const isValid = verifyStoredPassword(input.password, admin.password, admin.salt)
    if (!isValid) {
      domainLog.audit("system.auth.login.fail", {
        targetType: "ADMIN",
        targetId: admin.id,
        reason: "wrong_password",
      })
      throw new Error("用户名或密码错误")
    }

    await ruoyiPrisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    domainLog.audit("system.auth.login.success", {
      targetType: "ADMIN",
      targetId: admin.id,
      role: admin.role,
    })

    return {
      token: `ruoyi-token-${admin.id}`,
      user: {
        id: admin.id,
        username: admin.username ?? admin.phone,
        nickname: admin.name ?? admin.username ?? admin.phone,
      },
    }
  }

  static async getPermissionInfo(userId: string) {
    domainLog.event("system.auth.permission-info", { userId })

    const admin = await ruoyiPrisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, username: true, phone: true, name: true, role: true },
    })

    if (!admin) {
      throw new Error("管理员不存在")
    }

    const roleAssignments = await ruoyiPrisma.adminRoleAssignment.findMany({
      where: { adminId: userId, role: { status: "ACTIVE" } },
      select: {
        role: {
          select: {
            code: true,
            name: true,
            menuGrants: {
              select: {
                menu: {
                  select: {
                    id: true,
                    key: true,
                    name: true,
                    parentId: true,
                    path: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const roles = roleAssignments.map((assignment) => assignment.role.code)
    const permissions = roleAssignments.flatMap((assignment) =>
      assignment.role.menuGrants
        .map((grant) => grant.menu)
        .filter((menu) => menu.type === "MENU" && menu.path)
        .map((menu) => menu.path),
    )

    const menuRows: MenuRow[] = roleAssignments.flatMap((assignment) =>
      assignment.role.menuGrants
        .map((grant) => grant.menu)
        .filter((menu) => (menu.type === "DIRECTORY" || menu.type === "MENU") && menu.path !== null)
        .map((menu) => ({
          id: menu.id,
          key: menu.key,
          name: menu.name,
          parentId: menu.parentId,
          path: menu.path,
          type: menu.type,
        })),
    )

    const uniqueMenuRows = Array.from(new Map<string, MenuRow>(menuRows.map((row) => [row.id, row])).values())
    const menus = buildMenuTree(uniqueMenuRows)

    const effectivePermissions = admin.role === "PLATFORM_ADMIN"
      ? [WILDCARD_PERMISSION]
      : Array.from(new Set([...permissions, ...(admin.role === "PLATFORM_ADMIN" ? [WILDCARD_PERMISSION] : [])]))

    return {
      user: {
        id: admin.id,
        username: admin.username ?? admin.phone,
        nickname: admin.name ?? admin.username ?? admin.phone,
      },
      roles,
      permissions: effectivePermissions,
      menus,
    }
  }
}
