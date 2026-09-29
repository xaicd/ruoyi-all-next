import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listTenantPackages"], request)
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.listTenantPackages(input) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemTenantPackageService.createTenantPackage(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createTenantPackage"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_CREATE, platformOnly: true })
