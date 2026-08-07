import { NextResponse } from "next/server"
import { payPageQuerySchema, payRefundCreateSchema } from "@/modules/pay/backend/validators"
import { PayService } from "@/modules/pay/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.PAY_REFUND_VIEW)
    const { searchParams } = new URL(request.url)
    const input = payPageQuerySchema.parse({
      page: searchParams.get("page") || 1,
      pageSize: searchParams.get("pageSize") || 20,
    })
    const data = await PayService.listRefunds(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.PAY_REFUND_CREATE)
    const body = await request.json()
    const input = payRefundCreateSchema.parse(body)
    const data = await PayService.createRefund(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "退款申请失败" }, { status: 400 })
  }
}
