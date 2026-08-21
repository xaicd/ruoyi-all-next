import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { NoticeService } from "@/modules/system/backend/services/notice.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await NoticeService.getNotice(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getNotice"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_NOTICE_QUERY })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await NoticeService.updateNotice(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateNotice"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_NOTICE_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await NoticeService.deleteNotice(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteNotice"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_NOTICE_DELETE })
