import { NextResponse } from "next/server"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(50).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), accountLimit: z.coerce.number().int().min(1, "默认账号席位至少为 1").nullable().optional(), menuIds: z.array(z.string()).optional(), remark: z.string().trim().max(500).optional() })

function errorStatus(error: unknown, fallback = 400): number {
  const status = getAuthErrorStatus(error)
  return status === 400 ? fallback : status
}

export async function GET(request: Request, context: RouteContext) {
  try {
    requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW)
    const { id } = await context.params
    return NextResponse.json({ success: true, data: await SystemTenantPackageService.getById(id) })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW)
    const { id } = await context.params
    const data = await SystemTenantPackageService.update({ id, ...updateSchema.parse(await request.json()) })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW)
    const { id } = await context.params
    const data = await SystemTenantPackageService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error, error?.message?.includes("不存在") ? 404 : 400) }) }
}
