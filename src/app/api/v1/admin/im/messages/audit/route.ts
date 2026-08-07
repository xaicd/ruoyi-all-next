import { NextResponse } from "next/server"
import { imMessageAuditSchema } from "@/modules/im/backend/validators"
import { ImService } from "@/modules/im/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

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
