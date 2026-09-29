import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"

export const GET = withAdminRoute(async (request) => {
  const data = await SystemOauth2Service.getUserInfo(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.getOauth2UserInfo"], request))
  return NextResponse.json({ success: true, data }, { headers: { Deprecation: "true" } })
}, { platformOnly: true })
