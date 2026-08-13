import { NextResponse } from "next/server"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(50).optional(), contactName: z.string().trim().max(30).optional(), contactPhone: z.string().trim().max(20).optional(), domain: z.string().trim().max(100).optional(), packageId: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), effectiveAt: z.string().datetime().optional(), expireTime: z.string().datetime().nullable().optional(), accountLimit: z.coerce.number().int().min(1).nullable().optional() })

function errorStatus(error: unknown, fallback = 400): number {
  const status = getAuthErrorStatus(error)
  return status === 400 ? fallback : status
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const { id } = await context.params
    const data = await SystemTenantService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const { id } = await context.params
    const input = updateSchema.parse(await request.json())
    const data = await SystemTenantService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const { id } = await context.params
    const data = await SystemTenantService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : error?.message?.includes("不允许") ? 409 : 400) }) }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS)
    const { id } = await context.params
    const body = await request.json()
    if (body.action !== "updateStatus" || !["ACTIVE", "DISABLED"].includes(body.status)) return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
    const data = await SystemTenantService.updateStatus(id, body.status)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}
