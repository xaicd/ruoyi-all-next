import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"

export const GET = withAdminRoute(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const input = {
    page: Number(searchParams.get("page") || 1),
    pageSize: Number(searchParams.get("pageSize") || 20),
    keyword: searchParams.get("keyword") || undefined,
  }
  const data = await SystemDictService.page(input)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_DICT_QUERY })

export const POST = withAdminRoute(async (request: Request) => {
  const body = await request.json()
  const data = await SystemDictService.create(body)
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_DICT_CREATE })
