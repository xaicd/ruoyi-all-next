import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMailService } from "@/modules/system/backend/services/mail.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemMailService.listAccounts(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listMailAccounts"], request)) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_ACCOUNT_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createMailAccount"], await request.json())
  return NextResponse.json({ success: true, data: await SystemMailService.createMailAccount({ ...input, operatorId: auth.userId }) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_ACCOUNT_CREATE })
