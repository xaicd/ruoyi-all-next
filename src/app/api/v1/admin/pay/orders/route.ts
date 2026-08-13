import { NextResponse } from "next/server"
import { PayOrderService } from "@/modules/pay/backend/services/order.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["WAITING", "SUCCESS", "CLOSED", "REFUND"]).optional(), channelCode: z.string().trim().optional() })

export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.PAY_ORDER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined, channelCode: searchParams.get("channelCode") ?? undefined })
    const data = await PayOrderService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
