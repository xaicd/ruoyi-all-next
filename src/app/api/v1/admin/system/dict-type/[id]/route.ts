import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDictService.get(id)
    if (!data) return NextResponse.json({ success: false, error: "不存在" }, { status: 404 })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_DICT_QUERY })

export const PUT = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    const data = await SystemDictService.update({ ...body, id })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_DICT_UPDATE })

export const DELETE = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDictService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_DICT_DELETE })
