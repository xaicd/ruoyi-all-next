import { NextResponse } from "next/server"
import { pageQuerySchema } from "@/backend/validators/system.validator"
import { SystemUserService } from "@/backend/services/system-user.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_USER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = pageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await SystemUserService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
