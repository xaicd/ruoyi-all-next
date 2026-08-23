import { NextResponse } from "next/server"
import { AiAccessTokenService } from "@/modules/ai/backend/services/ai-access-token.service"
import { aiPageQuerySchema, aiAccessTokenWriteSchema } from "@/modules/ai/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const query = aiPageQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
  })
  const data = await AiAccessTokenService.page(query)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_TOKEN_VIEW })

export const POST = withAdminRoute(async (request) => {
  const body = aiAccessTokenWriteSchema.parse(await request.json())
  const data = await AiAccessTokenService.create(body)
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.AI_TOKEN_CREATE })
