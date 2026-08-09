import { NextResponse } from "next/server"
import { SystemTenantPackageService } from "@/modules/system/backend/services/tenant-package.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(50), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"), menuIds: z.array(z.string()).optional(), remark: z.string().trim().max(500).optional() })

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW)
    const { searchParams } = new URL(request.url)

    // 返回全部（下拉选择用）
    if (searchParams.get("all") === "true") {
      const data = await SystemTenantPackageService.getAll()
      return NextResponse.json({ success: true, data })
    }

    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined })
    const data = await SystemTenantPackageService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW)
    const body = await request.json()
    const input = createSchema.parse(body)
    const data = await SystemTenantPackageService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
