import { NextResponse } from "next/server"
import { InfraFileService } from "@/modules/infra/backend/services/file.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_FILE_VIEW)
    const { id } = await context.params
    const data = await InfraFileService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_FILE_VIEW)
    const { id } = await context.params
    const data = await InfraFileService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
