import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `邮件模板 ${id} 详情待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_QUERY })

export const PUT = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `邮件模板 ${id} 更新待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_UPDATE })

export const DELETE = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `邮件模板 ${id} 删除待实现` }, { status: 501 })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_DELETE })
