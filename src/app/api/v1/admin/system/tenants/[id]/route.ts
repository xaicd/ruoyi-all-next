import { NextResponse } from "next/server"
import { z } from "zod"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(50).optional(), contactName: z.string().trim().max(30).optional(), contactPhone: z.string().trim().max(20).optional(), domain: z.string().trim().max(100).optional(), packageId: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), effectiveAt: z.string().datetime().optional(), expireTime: z.string().datetime().nullable().optional(), accountLimit: z.coerce.number().int().min(1).nullable().optional() })

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantService.getById(id) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_VIEW, platformOnly: true })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemTenantService.update({ id, ...updateSchema.parse(await request.json()) })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE, platformOnly: true })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemTenantService.delete(id) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_DELETE, platformOnly: true })

export const PATCH = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const body = await request.json()
  if (body.action !== "updateStatus" || !["ACTIVE", "DISABLED"].includes(body.status)) {
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  }
  return NextResponse.json({ success: true, data: await SystemTenantService.updateStatus(id, body.status) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS, platformOnly: true })
