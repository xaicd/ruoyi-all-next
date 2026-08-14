import { NextResponse } from "next/server"
import { AiApiKeyService } from "@/modules/ai/backend/services/ai-api-key.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const input = {
    page: Number(searchParams.get("page") || 1),
    pageSize: Number(searchParams.get("pageSize") || 20),
    keyword: searchParams.get("keyword") || undefined,
  }
  const data = await AiApiKeyService.page(input)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_API_KEY_VIEW })

export const POST = withAdminRoute(async (request) => {
  const body = await request.json()
  const data = await AiApiKeyService.create(body)
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.AI_API_KEY_CREATE })
