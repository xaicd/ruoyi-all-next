import { NextResponse } from "next/server"
import { wmsCheckinSchema } from "@/backend/validators/wms.validator"
import { WmsService } from "@/backend/services/wms.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.WMS_OPERATION_CHECKIN)
    const body = await request.json()
    const input = wmsCheckinSchema.parse(body)

    const data = await WmsService.checkin(input)
    await writeAuditLog({
      action: "wms.operation.checkin",
      operatorId: auth.userId,
      targetType: "WMS_WAREHOUSE",
      targetId: input.warehouseId,
      detail: { quantity: input.quantity, note: input.note ?? null },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
