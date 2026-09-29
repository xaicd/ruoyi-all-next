import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  try {
    const type = new URL(request.url).searchParams.get("type")
    if (type) {
      const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.getDictDataByType"], request)
      const data = await SystemDictService.getDictDataByType(input)
      return NextResponse.json({ success: true, data })
    }
    const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listDictTypes"], request)
    const data = await SystemDictService.listTypes(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.SYSTEM_DICT_QUERY })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createDictType"], await request.json())
    const data = await SystemDictService.createType(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.SYSTEM_DICT_CREATE })
