import { NextResponse } from "next/server"
import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

/** Compatibility-only legacy page lookup; mutations are retired. */
export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const page = await InfraPageRepository.findById(id)
  if (!page) return NextResponse.json({ success: false, error: "页面不存在" }, { status: 404 })
  return NextResponse.json({ success: true, data: page })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })

export const PUT = withAdminRoute(async () => {
  return NextResponse.json({ success: false, error: "旧页面构建 API 已退役；请使用 Online Definition 工作台。" }, { status: 410 })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_UPDATE })

export const DELETE = withAdminRoute(async () => {
  return NextResponse.json({ success: false, error: "旧页面构建 API 已退役；请使用 Online Definition 工作台。" }, { status: 410 })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_DELETE })
