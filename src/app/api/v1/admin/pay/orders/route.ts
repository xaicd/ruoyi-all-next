import { NextResponse } from "next/server"
import { PayOrderService } from "@/modules/pay/backend/services/order.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["WAITING", "SUCCESS", "CLOSED", "REFUND"]).optional(), channelCode: z.string().trim().optional() })

export const GET = withAdminRoute(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined, channelCode: searchParams.get("channelCode") ?? undefined })
    const data = await PayOrderService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.PAY_ORDER_VIEW })
