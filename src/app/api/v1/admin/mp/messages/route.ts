import { NextResponse } from "next/server"
import { mpSendMessageSchema } from "@/modules/mp/backend/validators"
import { MpService } from "@/modules/mp/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.MP_MESSAGE_SEND)
    const body = await request.json()
    const input = mpSendMessageSchema.parse(body)
    const data = await MpService.sendMessage(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "发送失败" }, { status: 400 })
  }
}
