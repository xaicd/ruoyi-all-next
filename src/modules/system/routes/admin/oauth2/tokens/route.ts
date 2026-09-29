import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemOauth2Service.listTokens(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listOauth2Tokens"], request)) })
}, { permission: PERMISSIONS.SYSTEM_OAUTH2_TOKEN_VIEW, platformOnly: true })
