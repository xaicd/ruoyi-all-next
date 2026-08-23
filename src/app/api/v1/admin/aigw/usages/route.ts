import { NextResponse } from "next/server"
import { AigwUsageService } from "@/modules/aigw/backend/services/aigw-usage.service"
import { aigwPageQuerySchema } from "@/modules/aigw/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const query = aigwPageQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
  })
  const data = await AigwUsageService.page(query as any)
  return NextResponse.json({ success: true, data })

}, { permission: PERMISSIONS.AIGW_USAGE_VIEW })
