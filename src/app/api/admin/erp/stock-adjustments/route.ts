import { NextResponse } from "next/server"
import { erpStockAdjustmentSchema } from "@/backend/validators/erp.validator"
import { ErpService } from "@/backend/services/erp.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.ERP_STOCK_ADJUST)
    const body = await request.json()
    const input = erpStockAdjustmentSchema.parse(body)

    const data = await ErpService.adjustStock(input)
    await writeAuditLog({
      action: "erp.stock.adjust",
      operatorId: auth.userId,
      targetType: "ERP_PRODUCT",
      targetId: input.productId,
      detail: { delta: input.delta, reason: input.reason },
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
