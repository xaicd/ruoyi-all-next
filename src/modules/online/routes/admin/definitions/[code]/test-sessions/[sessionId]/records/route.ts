import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { createOnlineRuntimeRecordSchema, onlineRuntimeRecordPageSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; sessionId: string }> }

export const GET = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code, sessionId } = await context.params
  const input = onlineRuntimeRecordPageSchema.parse(Object.fromEntries(new URL(request.url).searchParams))
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.pageTestRecords(auth, code, sessionId, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_TEST })

export const POST = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code, sessionId } = await context.params
  const input = createOnlineRuntimeRecordSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.createTestRecord(auth, code, sessionId, input) }, { status: 201 })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_TEST })
