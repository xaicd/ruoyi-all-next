import { NextResponse } from "next/server"
import { SystemDeptService } from "@/modules/system/backend/services/dept.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

const updateDeptSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  parentId: z.string().trim().optional(),
  sort: z.coerce.number().int().min(0).optional(),
  leaderId: z.string().trim().optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DEPT_VIEW)
    const { id } = await context.params
    const data = await SystemDeptService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DEPT_UPDATE)
    const { id } = await context.params
    const body = await request.json()
    const input = updateDeptSchema.parse(body)
    const data = await SystemDeptService.update({ id, ...input, email: input.email || undefined })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DEPT_DELETE)
    const { id } = await context.params
    const data = await SystemDeptService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("子部门") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}
