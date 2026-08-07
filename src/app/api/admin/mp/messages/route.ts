import { NextResponse } from "next/server"
import { mpSendMessageSchema } from "@/modules/mp/backend/validators"
import { MpService } from "@/modules/mp/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

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
    return NextResponse.json({ success: false, error: error?.message ?? "发送失�? }, { status: 400 })
  }
}
