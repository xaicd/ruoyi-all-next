import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantService.getTenantSubscriptions(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getTenantSubscriptions"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_VIEW, platformOnly: true })
