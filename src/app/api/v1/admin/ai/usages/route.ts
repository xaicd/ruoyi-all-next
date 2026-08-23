import { NextResponse } from "next/server"
import { AiUsageService } from "@/modules/ai/backend/services/ai-usage.service"
import { aiPageQuerySchema } from "@/modules/ai/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const query = aiPageQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
  })
  const data = await AiUsageService.page(query)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_USAGE_VIEW })
