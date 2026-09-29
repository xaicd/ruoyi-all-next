import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listDictTypes"], request)
  return NextResponse.json({ success: true, data: await SystemDictService.listTypes(input) })
}, { permission: PERMISSIONS.SYSTEM_DICT_QUERY })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemDictService.createType(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createDictType"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_DICT_CREATE })
