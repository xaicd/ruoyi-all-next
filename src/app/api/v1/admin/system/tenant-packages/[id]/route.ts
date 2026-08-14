import { NextResponse } from "next/server"
import { z } from "zod"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(50).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), accountLimit: z.coerce.number().int().min(1, "默认账号席位至少为 1").nullable().optional(), menuIds: z.array(z.string()).optional(), remark: z.string().trim().max(500).optional() })

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.getById(id) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemTenantPackageService.update({ id, ...updateSchema.parse(await request.json()) })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_UPDATE, platformOnly: true })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.delete(id) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_DELETE, platformOnly: true })
