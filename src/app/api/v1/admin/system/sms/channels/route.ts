import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { createSmsChannelSchema, systemModulePageQuerySchema } from "@/modules/system/backend/validators"
import { SystemSmsService } from "@/modules/system/backend/services/sms.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request, auth) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = systemModulePageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await SystemSmsService.listChannels(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_SMS_CHANNEL_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const input = createSmsChannelSchema.parse(body)
    const data = await SystemSmsService.createChannel(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_SMS_CHANNEL_CREATE })
