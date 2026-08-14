import { NextResponse } from "next/server"
import { z } from "zod"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { createTenantWithAdminSchema } from "@/modules/system/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined })
  return NextResponse.json({ success: true, data: await SystemTenantService.list(input) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_VIEW, platformOnly: true })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemTenantService.create(createTenantWithAdminSchema.parse(await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_TENANT_CREATE, platformOnly: true })
