import { NextResponse } from "next/server"
import { AigwUsageService } from "@/modules/aigw/backend/services/aigw-usage.service"
import { aigwPageQuerySchema } from "@/modules/aigw/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request, auth) => {
  const { searchParams } = new URL(request.url)
  const query = aigwPageQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
  })
  const tenantId = auth.roles.includes("platform_admin") || auth.roles.includes("admin") ? (searchParams.get("tenantId") || auth.tenantId) : auth.tenantId
  const data = await AigwUsageService.page({ ...query, tenantId } as any)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AIGW_USAGE_VIEW })
