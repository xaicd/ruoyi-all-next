import { NextResponse } from "next/server"
import { SystemRoleService } from "@/modules/system/backend/services/role.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(50).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

const createRoleSchema = z.object({
  name: z.string().trim().min(1, "角色名不能为空").max(30),
  code: z.string().trim().min(1, "角色编码不能为空").max(100),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  dataScope: z.enum(["ALL", "DEPT", "DEPT_AND_CHILD", "SELF"]).default("ALL"),
  remark: z.string().trim().max(500).optional(),
})

export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    }) as any
    const data = await SystemRoleService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_CREATE)
    const body = await request.json()
    const input = createRoleSchema.parse(body) as any
    const data = await SystemRoleService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
