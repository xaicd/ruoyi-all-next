import { NextResponse } from "next/server"
import { PayOrderService } from "@/modules/pay/backend/services/order.service"
import { PAY_ACTION_SCHEMAS } from "@/modules/pay/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(PAY_ACTION_SCHEMAS["pay.listOrders"], request)
    const data = await PayOrderService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.PAY_ORDER_VIEW })
