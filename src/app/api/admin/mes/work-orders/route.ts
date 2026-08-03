import { NextResponse } from "next/server"
import { mesPageQuerySchema } from "@/backend/validators/mes.validator"
import { MesService } from "@/backend/services/mes.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MES_WORK_ORDER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = mesPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await MesService.listWorkOrders(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
