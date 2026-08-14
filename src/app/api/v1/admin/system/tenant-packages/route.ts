import { NextResponse } from "next/server"
import { z } from "zod"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(50), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"), accountLimit: z.coerce.number().int().min(1, "默认账号席位至少为 1").nullable().optional(), menuIds: z.array(z.string()).optional(), remark: z.string().trim().max(500).optional() })

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("all") === "true") return NextResponse.json({ success: true, data: await SystemTenantPackageService.getAll() })
  const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined })
  return NextResponse.json({ success: true, data: await SystemTenantPackageService.list(input) })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemTenantPackageService.create(createSchema.parse(await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_CREATE, platformOnly: true })
