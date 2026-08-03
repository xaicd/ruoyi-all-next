import { describe, expect, it } from "vitest"
import { ruoyiPrisma } from "../../../../shared/backend/prisma"
import { SystemCaptchaService } from "../captcha.service"
import { SystemDictService } from "../dict.service"
import { SystemPermissionService } from "../permission.service"

describe("system persistence services", () => {
  it("persists captcha records and verifies them", async () => {
    const generated = await SystemCaptchaService.generate()
    const decoded = Buffer.from(generated.imageBase64, "base64").toString("utf8")
    const verified = await SystemCaptchaService.verify({
      captchaId: generated.captchaId,
      code: decoded.split(":")[1] ?? "",
    })

    expect(verified.success).toBe(true)
  })

  it("stores and lists dict items from the database", async () => {
    const created = await SystemDictService.create("op-1", {
      dictType: "common_status",
      label: "测试",
      value: "TEST",
      status: "ACTIVE",
    })

    const result = await SystemDictService.list({ page: 1, pageSize: 20, keyword: "TEST" })

    expect(created.value).toBe("TEST")
    expect(result.items.some((item) => item.value === "TEST")).toBe(true)
  })

  it("assigns user roles and role menus through the database", async () => {
    const stamp = Date.now()
    const role = await ruoyiPrisma.adminRole.create({
      data: { id: `role-test-${stamp}`, name: "测试角色", code: `TEST_ROLE_${stamp}`, sortOrder: 999, status: "ACTIVE" },
    })
    const menu = await ruoyiPrisma.adminMenu.create({
      data: { id: `menu-test-${stamp}`, key: `menu-test-${stamp}`, name: "测试菜单", path: "/test", permission: "test:view", type: "MENU", sortOrder: 1 },
    })
    const admin = await ruoyiPrisma.admin.create({
      data: { id: `admin-test-${stamp}`, username: `test-${stamp}`, password: "x", phone: `1380000${stamp.toString().slice(-4)}`, status: "ACTIVE" },
    })

    const userRole = await SystemPermissionService.assignUserRole("op-1", {
      userId: admin.id,
      roleIds: [role.id],
    })
    const roleMenu = await SystemPermissionService.assignRoleMenu("op-1", {
      roleId: role.id,
      menuIds: [menu.id],
    })

    expect(userRole.roleIds).toContain(role.id)
    expect(roleMenu.menuIds).toContain(menu.id)
  })
})
