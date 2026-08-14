import { NextResponse } from "next/server"
import { oauth2OpenTokenSchema } from "@/modules/system/backend/validators"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/**
 * @deprecated This legacy admin endpoint is deliberately platform-admin-only.
 * A standards-compliant public OAuth endpoint is pending secure client and token storage.
 */
export const POST = withAdminRoute(async (request) => {
  try {
    const body = await request.json()
    const input = oauth2OpenTokenSchema.parse(body)
    const data = await SystemOauth2Service.openToken(input)
    return NextResponse.json({ success: true, data }, { headers: { Deprecation: "true" } })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message ?? "获取 token 失败" },
      { status: 400, headers: { Deprecation: "true" } },
    )
  }
}, { platformOnly: true })
