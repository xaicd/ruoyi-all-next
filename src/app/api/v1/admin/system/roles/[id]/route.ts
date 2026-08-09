import { NextResponse } from "next/server"
import { SystemRoleService } from "@/modules/system/backend/services/role.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

const updateRoleSchema = z.object({
  name: z.string().trim().min(1).max(30).optional(),
  code: z.string().trim().min(1).max(100).optional(),
  sort: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  dataScope: z.enum(["ALL", "DEPT", "DEPT_AND_CHILD", "SELF"]).optional(),
  remark: z.string().trim().max(500).optional(),
})

export async function GET(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_VIEW)
    const { id } = await context.params
    const data = await SystemRoleService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_UPDATE)
    const { id } = await context.params
    const body = await request.json()
    const input = updateRoleSchema.parse(body)
    const data = await SystemRoleService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_DELETE)
    const { id } = await context.params
    const data = await SystemRoleService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("不允许") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_UPDATE)
    const { id } = await context.params
    const body = await request.json()

    // 状态变更
    if (body.action === "updateStatus" && ["ACTIVE", "DISABLED"].includes(body.status)) {
      const data = await SystemRoleService.updateStatus(id, body.status)
      return NextResponse.json({ success: true, data })
    }

    // 分配菜单
    if (body.action === "assignMenus" && Array.isArray(body.menuIds)) {
      const { PermissionService } = await import("@/modules/system/backend/services/permission.service")
      const data = await PermissionService.assignRoleMenu({ roleId: id, menuIds: body.menuIds })
      return NextResponse.json({ success: true, data })
    }

    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
