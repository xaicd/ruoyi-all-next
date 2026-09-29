import { NextResponse } from "next/server"
import { AigwAccessTokenService } from "@/modules/aigw/backend/services/aigw-access-token.service"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")
  if (!token) {
    return NextResponse.json({ error: { message: "缺少 Authorization Bearer 令牌", type: "invalid_request_error" } }, { status: 401 })
  }

  try {
    const record = AigwAccessTokenService.assertUsable(token)
    return NextResponse.json({
      code: 0,
      msg: "success",
      data: {
        tokenId: record.id,
        name: record.name,
        remainQuota: record.remainQuota,
        totalUsed: record.totalUsed,
        status: record.status,
      },
    })
  } catch (err: any) {
    const status = err.status || 401
    return NextResponse.json({ error: { message: err.message || "无效或封禁的 API 密钥", type: "auth_error" } }, { status })
  }
}
