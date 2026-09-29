import { NextResponse } from "next/server"
import { requireAppLogin } from "@/modules/shared/backend/lib/app-auth-guard"
import { getAuthErrorStatus } from "@/modules/shared/backend/auth/guards"

/**
 * 收银台 - 创建支付单
 * POST /api/v1/app/pay/cashier
 */
export async function POST(request: Request) {
  try {
    const auth = requireAppLogin(request)
    const body = await request.json()

    // TODO: 调用 PayService.createOrderFromApp(auth.userId, body)
    return NextResponse.json({
      success: true,
      data: {
        payOrderId: `pay-${Date.now()}`,
        payUrl: "https://mock-pay-url.com",
        expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    })
  } catch (error: any) {
    const status = getAuthErrorStatus(error)
    return NextResponse.json({ success: false, error: error?.message || "创建支付单失败" }, { status })
  }
}
