import { NextResponse } from "next/server"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(50), contactName: z.string().trim().max(30).optional(), contactPhone: z.string().trim().max(20).optional(), domain: z.string().trim().max(100).optional(), packageId: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"), expireTime: z.string().trim().optional(), accountCount: z.coerce.number().int().min(0).default(0) })

function errorStatus(error: unknown): number {
  return getAuthErrorStatus(error)
}

export async function GET(request: Request) {
  try {
    requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined })
    const data = await SystemTenantService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error) }) }
}

export async function POST(request: Request) {
  try {
    requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const body = await request.json()
    const input = createSchema.parse(body)
    const data = await SystemTenantService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: errorStatus(error) }) }
}
