import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"

export const POST = withAdminRoute(async (request) => {
  const data = await SystemOauth2Service.openToken(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.openOauth2Token"], await request.json()))
  return NextResponse.json({ success: true, data }, { headers: { Deprecation: "true" } })
}, { platformOnly: true })
