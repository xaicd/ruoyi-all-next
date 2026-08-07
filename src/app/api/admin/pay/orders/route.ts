import { NextResponse } from "next/server"
import { payPageQuerySchema, payOrderCreateSchema } from "@/modules/pay/backend/validators"
import { PayService } from "@/modules/pay/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.PAY_ORDER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = payPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    })
    const data = await PayService.listOrders(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.PAY_ORDER_CREATE)
    const body = await request.json()
    const input = payOrderCreateSchema.parse(body)
    const data = await PayService.createOrder(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
