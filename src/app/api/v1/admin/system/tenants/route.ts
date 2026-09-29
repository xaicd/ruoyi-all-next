import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listTenants"], request)
  return NextResponse.json({ success: true, data: await SystemTenantService.list(input) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_VIEW, platformOnly: true })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemTenantService.create(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createTenant"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_TENANT_CREATE, platformOnly: true })
