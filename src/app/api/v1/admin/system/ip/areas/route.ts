import { NextResponse } from "next/server"
import { systemModulePageQuerySchema } from "@/modules/system/backend/validators"
import { IpAreaService } from "@/modules/system/backend/services/ip-area.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_IP_AREA_VIEW)
    const { searchParams } = new URL(request.url)
    const input = systemModulePageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await IpAreaService.listAreas(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
