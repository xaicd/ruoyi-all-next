import { NextResponse } from "next/server"
import { InfraFileService } from "@/modules/infra/backend/services/file.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraFileService.getFile(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getFile"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraFileService.deleteFile(parseActionBody(INFRA_ACTION_SCHEMAS["infra.deleteFile"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })
