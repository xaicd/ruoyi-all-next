import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { NoticeService } from "@/modules/system/backend/services/notice.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await NoticeService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageNotices"], request)) })
}, { permission: PERMISSIONS.SYSTEM_NOTICE_QUERY })

export const POST = withAdminRoute(async (request) => {
  const data = await NoticeService.createNotice(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createNotice"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_NOTICE_CREATE })
