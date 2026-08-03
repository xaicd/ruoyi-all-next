import { NextResponse } from "next/server"
import { mpSendMessageSchema } from "@/backend/validators/mp.validator"
import { MpService } from "@/backend/services/mp.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.MP_MESSAGE_SEND)
    const body = await request.json()
    const input = mpSendMessageSchema.parse(body)

    const data = await MpService.sendMessage(input)
    await writeAuditLog({
      action: "mp.message.send",
      operatorId: auth.userId,
      targetType: "MP_ACCOUNT",
      targetId: input.accountId,
      detail: { contentLength: input.content.length },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "发送失败" }, { status: 400 })
  }
}
