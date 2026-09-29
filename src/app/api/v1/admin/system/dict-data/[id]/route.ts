import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemDictService.getDictData(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getDictData"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_DICT_QUERY })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemDictService.updateDictData(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateDictData"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_DICT_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemDictService.deleteDictData(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteDictData"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_DICT_DELETE })
