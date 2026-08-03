import { describe, expect, it } from "vitest"
import { SystemAuthService } from "../system-auth.service"
import { SystemDeptService } from "../system-dept.service"
import { SystemPostService } from "../system-post.service"
import { SystemPermissionService } from "../system-permission.service"

describe("System org and permission service", () => {
  it("lists depts and posts", async () => {
    const depts = await SystemDeptService.list({ page: 1, pageSize: 20, keyword: "" })
    const posts = await SystemPostService.list({ page: 1, pageSize: 20, keyword: "" })

    expect(depts.total).toBeGreaterThan(0)
    expect(posts.total).toBeGreaterThan(0)
  })

  it("authenticates the documented superadmin credentials", async () => {
    const result = await SystemAuthService.login({
      username: "superadmin",
      password: "Townwenlv@2026",
    })

    expect(result.user.username).toBe("superadmin")
    expect(result.token).toContain("token")

    const info = await SystemAuthService.getPermissionInfo(result.user.id)
    expect(info.roles.length).toBeGreaterThan(0)
    expect(info.permissions.length).toBeGreaterThan(0)
  })

  it("assigns user roles and role menus", async () => {
    const userRole = await SystemPermissionService.assignUserRole("admin-1", {
      userId: "u-001",
      roleIds: ["r-001"],
    })
    const roleMenu = await SystemPermissionService.assignRoleMenu("admin-1", {
      roleId: "r-001",
      menuIds: ["m-001", "m-002"],
    })

    expect(userRole.userId).toBe("u-001")
    expect(roleMenu.roleId).toBe("r-001")
    expect(roleMenu.menuIds.length).toBe(2)
  })
})
