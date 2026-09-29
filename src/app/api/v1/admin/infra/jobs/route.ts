import { NextResponse } from "next/server"
import { InfraJobService } from "@/modules/infra/backend/services/job.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.listJobs"], request)
    const data = await InfraJobService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.createJob"], await request.json())
    const data = await InfraJobService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_OPERATE })
