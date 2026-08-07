import { NextResponse } from "next/server"
import { oauth2OpenTokenSchema } from "@/modules/system/backend/validators"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = oauth2OpenTokenSchema.parse(body)
    const data = await SystemOauth2Service.openToken(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "获取 token 失败" }, { status: 400 })
  }
}
