import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemPostService } from "@/modules/system/backend/services/post.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemPostService.getPost(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getPost"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.SYSTEM_POST_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemPostService.update(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updatePost"], { ...await request.json(), id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.SYSTEM_POST_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemPostService.deletePost(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deletePost"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.SYSTEM_POST_DELETE })
