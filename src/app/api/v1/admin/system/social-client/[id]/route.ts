import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `社交客户端 ${id} 详情待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_QUERY })

export const PUT = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `社交客户端 ${id} 更新待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_UPDATE })

export const DELETE = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `社交客户端 ${id} 删除待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_DELETE })
