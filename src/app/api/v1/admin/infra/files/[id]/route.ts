import { NextResponse } from "next/server"
import { InfraFileService } from "@/modules/infra/backend/services/file.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraFileService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })

export const DELETE = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraFileService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })
