import { NextResponse } from "next/server"
import { mesReportWorkSchema } from "@/backend/validators/mes.validator"
import { MesService } from "@/backend/services/mes.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.MES_WORK_ORDER_REPORT)
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
}
