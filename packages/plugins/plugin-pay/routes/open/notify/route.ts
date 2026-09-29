import { NextResponse } from "next/server"

/**
 * 支付回调通知 - 开放接口（无鉴权，验签）
 * POST /api/v1/open/pay/notify
 */
export async function POST(request: Request) {
  try {
    const body = await request.text()

    // TODO: 验证签名 + 解析回调数据 + 更新订单状态
    // const signature = request.headers.get("x-signature")
    // if (!cryptoEngine.verifySignature(body, signature)) throw new Error("签名验证失败")

    return NextResponse.json({ success: true, message: "OK" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "处理失败" }, { status: 400 })
  }
}
