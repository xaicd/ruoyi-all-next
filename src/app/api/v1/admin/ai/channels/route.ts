import { NextResponse } from "next/server"
import { AiChannelService } from "@/modules/ai/backend/services/ai-channel.service"
import { aiPageQuerySchema, aiChannelWriteSchema } from "@/modules/ai/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const query = aiPageQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
  })
  const data = await AiChannelService.page(query)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_CHANNEL_VIEW })

export const POST = withAdminRoute(async (request) => {
  const body = aiChannelWriteSchema.parse(await request.json())
  const data = await AiChannelService.create(body)
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.AI_CHANNEL_CREATE })
