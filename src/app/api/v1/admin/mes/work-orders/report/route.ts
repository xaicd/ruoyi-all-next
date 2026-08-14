import { NextResponse } from "next/server"
import { mesReportWorkSchema } from "@/modules/mes/backend/validators"
import { MesService } from "@/modules/mes/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const input = mesReportWorkSchema.parse(body)

    const data = await MesService.reportWork(input)
    await writeAuditLog({
      action: "mes.work-order.report",
      operatorId: auth.userId,
      targetType: "MES_WORK_ORDER",
      targetId: input.workOrderId,
      detail: { outputQty: input.outputQty, scrapQty: input.scrapQty },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.MES_WORK_ORDER_REPORT })
