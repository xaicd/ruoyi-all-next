import { NextResponse } from "next/server"
import { createNotifyMessageSchema, pageQuerySchema } from "@/modules/system/backend/validators"
import { NotifyMessageService } from "@/modules/system/backend/services/notify-message.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_NOTIFY_MESSAGE_VIEW)
    const { searchParams } = new URL(request.url)
    const input = pageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await NotifyMessageService.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await ensurePermission(request, PERMISSIONS.SYSTEM_NOTIFY_MESSAGE_CREATE)
    const body = await request.json()
    const input = createNotifyMessageSchema.parse(body)

    const data = await NotifyMessageService.create(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
