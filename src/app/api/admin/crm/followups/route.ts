import { NextResponse } from "next/server"
import { crmFollowupSchema } from "@/backend/validators/crm.validator"
import { CrmService } from "@/backend/services/crm.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.CRM_FOLLOWUP_CREATE)
    const body = await request.json()
    const input = crmFollowupSchema.parse(body)

    const data = await CrmService.createFollowup(input)
    await writeAuditLog({
      action: "crm.followup.create",
      operatorId: auth.userId,
      targetType: "CRM_CUSTOMER",
      targetId: input.customerId,
      detail: { contentLength: input.content.length },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
