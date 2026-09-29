import { NextResponse } from "next/server"
import { InfraFileService } from "@/modules/infra/backend/services/file.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.listFiles"], request)
    const data = await InfraFileService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.recordFile"], await request.json())
    const data = await InfraFileService.recordUpload(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_FILE_VIEW })
