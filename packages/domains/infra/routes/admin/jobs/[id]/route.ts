import { NextResponse } from "next/server"
import { InfraJobService } from "@/modules/infra/backend/services/job.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraJobService.getJob(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getJob"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraJobService.update(parseActionBody(INFRA_ACTION_SCHEMAS["infra.updateJob"], { ...await request.json(), id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_OPERATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await InfraJobService.deleteJob(parseActionBody(INFRA_ACTION_SCHEMAS["infra.deleteJob"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_OPERATE })

export const PATCH = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    if (body.action === "trigger") {
      const data = await InfraJobService.triggerJob(parseActionBody(INFRA_ACTION_SCHEMAS["infra.triggerJob"], { id }))
      return NextResponse.json({ success: true, data })
    }
    if (body.action === "updateStatus") {
      const data = await InfraJobService.updateJobStatus(parseActionBody(INFRA_ACTION_SCHEMAS["infra.updateJobStatus"], { id, status: body.status }))
      return NextResponse.json({ success: true, data })
    }
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_OPERATE })
