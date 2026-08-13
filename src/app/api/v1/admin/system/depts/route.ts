import { NextResponse } from "next/server"
import { SystemDeptService } from "@/modules/system/backend/services/dept.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const createDeptSchema = z.object({
  name: z.string().trim().min(1, "部门名称不能为空").max(50),
  parentId: z.string().trim().optional(),
  sort: z.coerce.number().int().min(0).default(0),
  leaderId: z.string().trim().optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

/**
 * GET /api/v1/admin/system/depts
 * 获取部门树/列表
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_DEPT_VIEW)
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode") // tree | list
    const status = searchParams.get("status") || undefined
    const keyword = searchParams.get("keyword") || undefined

    if (mode === "list") {
      const data = await SystemDeptService.list({ status, keyword })
      return NextResponse.json({ success: true, data })
    }

    const data = await SystemDeptService.tree({ status, keyword })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

/**
 * POST /api/v1/admin/system/depts
 * 创建部门
 */
export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_DEPT_CREATE)
    const body = await request.json()
    const input = createDeptSchema.parse(body) as any
    const data = await SystemDeptService.create({ ...input, email: input.email || undefined })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
