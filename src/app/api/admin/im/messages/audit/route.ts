import { NextResponse } from "next/server"
import { imMessageAuditSchema } from "@/backend/validators/im.validator"
import { ImService } from "@/backend/services/im.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.IM_MESSAGE_AUDIT)
    const body = await request.json()
    const input = imMessageAuditSchema.parse(body)

    const data = await ImService.auditMessage(input)
    await writeAuditLog({
      action: "im.message.audit",
      operatorId: auth.userId,
      targetType: "IM_MESSAGE",
      targetId: input.messageId,
      detail: { decision: input.decision, reason: input.reason ?? null },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
