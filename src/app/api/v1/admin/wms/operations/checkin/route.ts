import { NextResponse } from "next/server"
import { wmsCheckinSchema } from "@/modules/wms/backend/validators"
import { WmsService } from "@/modules/wms/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

export const POST = withAdminRoute(async (request, auth) => {
  try {
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
}, { permission: PERMISSIONS.WMS_OPERATION_CHECKIN })
