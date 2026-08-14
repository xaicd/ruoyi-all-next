import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDictService.getType(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.SYSTEM_DICT_VIEW })

export const PUT = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    const input = z.object({ name: z.string().trim().min(1).max(100).optional(), type: z.string().trim().max(100).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), remark: z.string().trim().max(500).optional() }).parse(body)
    const data = await SystemDictService.updateType({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.SYSTEM_DICT_CREATE })

export const DELETE = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDictService.deleteType(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.SYSTEM_DICT_CREATE })
