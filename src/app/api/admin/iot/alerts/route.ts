import { NextResponse } from "next/server"
import { iotPageQuerySchema, iotAlertHandleSchema } from "@/modules/iot/backend/validators"
import { IotService } from "@/modules/iot/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.IOT_ALERT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = iotPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await IotService.listAlerts(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.IOT_ALERT_HANDLE)
    const body = await request.json()
    const input = iotAlertHandleSchema.parse(body)
    const data = await IotService.handleAlert(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "处理失败" }, { status: 400 })
  }
}
