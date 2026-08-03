import type {
  AssignRoleMenuInput,
  AssignUserRoleInput,
} from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

export class SystemPermissionService {
  static async assignUserRole(operatorId: string, input: AssignUserRoleInput) {
    domainLog.event("system.permission.assign-user-role", {
      operatorId,
      userId: input.userId,
      roleCount: input.roleIds.length,
    })

    const admin = await ruoyiPrisma.admin.findUnique({
      where: { id: input.userId },
      select: { id: true },
    })
    if (!admin) {
      throw new Error("admin-not-found-in-db")
    }

    const roles = await ruoyiPrisma.adminRole.findMany({
      where: { id: { in: input.roleIds } },
      select: { id: true },
    })

    const roleIds = roles.map((item) => item.id)
    if (roleIds.length !== input.roleIds.length) {
      throw new Error("role-not-found-in-db")
    }

    await ruoyiPrisma.$transaction(async (tx) => {
      await tx.adminRoleAssignment.deleteMany({ where: { adminId: input.userId } })
      await tx.adminRoleAssignment.createMany({
        data: roleIds.map((roleId) => ({
          adminId: input.userId,
          roleId,
        })),
        skipDuplicates: true,
      })
    })

    domainLog.audit("system.permission.assign-user-role", {
      operatorId,
      targetType: "USER",
      targetId: input.userId,
      roleIds,
      source: "db",
    })

    return {
      userId: input.userId,
      roleIds,
    }
  }

  static async assignRoleMenu(operatorId: string, input: AssignRoleMenuInput) {
    domainLog.event("system.permission.assign-role-menu", {
      operatorId,
      roleId: input.roleId,
      menuCount: input.menuIds.length,
    })

    const role = await ruoyiPrisma.adminRole.findUnique({
      where: { id: input.roleId },
      select: { id: true },
    })
    if (!role) {
      throw new Error("role-not-found-in-db")
    }

    const menus = await ruoyiPrisma.adminMenu.findMany({
      where: { id: { in: input.menuIds } },
      select: { id: true },
    })

    const menuIds = menus.map((item) => item.id)
    if (menuIds.length !== input.menuIds.length) {
      throw new Error("menu-not-found-in-db")
    }

    await ruoyiPrisma.$transaction(async (tx) => {
      await tx.adminRoleMenu.deleteMany({ where: { roleId: input.roleId } })
      await tx.adminRoleMenu.createMany({
        data: menuIds.map((menuId) => ({
          roleId: input.roleId,
          menuId,
        })),
        skipDuplicates: true,
      })
    })

    domainLog.audit("system.permission.assign-role-menu", {
      operatorId,
      targetType: "ROLE",
      targetId: input.roleId,
      menuIds,
      source: "db",
    })

    return {
      roleId: input.roleId,
      menuIds,
    }
  }
}
