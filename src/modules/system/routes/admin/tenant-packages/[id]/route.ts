import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.getTenantPackage(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getTenantPackage"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemTenantPackageService.updateTenantPackage(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateTenantPackage"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_UPDATE, platformOnly: true })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.deleteTenantPackage(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteTenantPackage"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_DELETE, platformOnly: true })
