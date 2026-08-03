import { NextResponse } from "next/server"
import { oauth2UserInfoSchema } from "@/backend/validators/system.validator"
import { SystemOauth2Service } from "@/backend/services/system-oauth2.service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const input = oauth2UserInfoSchema.parse({
      accessToken: searchParams.get("accessToken") ?? "",
    })
    const data = await SystemOauth2Service.getUserInfo(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询用户信息失败" }, { status: 400 })
  }
}
