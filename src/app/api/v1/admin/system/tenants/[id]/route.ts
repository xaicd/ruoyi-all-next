import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantService.getTenant(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getTenant"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_VIEW, platformOnly: true })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemTenantService.update(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateTenant"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE, platformOnly: true })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantService.deleteTenant(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteTenant"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_DELETE, platformOnly: true })

export const PATCH = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const body = await request.json()
  if (body.action !== "updateStatus") {
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  }
  return NextResponse.json({ success: true, data: await SystemTenantService.updateTenantStatus(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateTenantStatus"], { id, status: body.status })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS, platformOnly: true })
