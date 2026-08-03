import { NextResponse } from "next/server"
import { pageQuerySchema } from "@/backend/validators/system.validator"
import { SystemOauth2Service } from "@/backend/services/system-oauth2.service"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { PERMISSIONS } from "@/backend/constants/permissions"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_OAUTH2_TOKEN_VIEW)
    const { searchParams } = new URL(request.url)
    const input = pageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await SystemOauth2Service.listTokens(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
