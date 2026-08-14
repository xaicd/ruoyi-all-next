import { NextResponse } from "next/server"
import { oauth2UserInfoSchema } from "@/modules/system/backend/validators"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/**
 * @deprecated This legacy admin endpoint is deliberately platform-admin-only.
 * A public userinfo endpoint must require Authorization: Bearer and a secure OAuth token model.
 */
export const GET = withAdminRoute(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = oauth2UserInfoSchema.parse({
      accessToken: searchParams.get("accessToken") ?? "",
    })
    const data = await SystemOauth2Service.getUserInfo(input)
    return NextResponse.json({ success: true, data }, { headers: { Deprecation: "true" } })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "查询用户信息失败" },
      { status: 400, headers: { Deprecation: "true" } },
    )
  }
}, { platformOnly: true })
