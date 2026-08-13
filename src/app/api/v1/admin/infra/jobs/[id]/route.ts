import { NextResponse } from "next/server"
import { InfraJobService } from "@/modules/infra/backend/services/job.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

const updateSchema = z.object({ name: z.string().trim().min(1).max(100).optional(), handlerName: z.string().trim().max(200).optional(), handlerParam: z.string().trim().max(500).optional(), cronExpression: z.string().trim().max(50).optional(), retryCount: z.coerce.number().int().min(0).optional(), retryInterval: z.coerce.number().int().min(0).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_JOB_VIEW)
    const { id } = await context.params
    const data = await InfraJobService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_JOB_OPERATE)
    const { id } = await context.params
    const body = await request.json()
    const input = updateSchema.parse(body)
    const data = await InfraJobService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_JOB_OPERATE)
    const { id } = await context.params
    const data = await InfraJobService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_JOB_OPERATE)
    const { id } = await context.params
    const body = await request.json()
    if (body.action === "trigger") {
      const data = await InfraJobService.trigger(id)
      return NextResponse.json({ success: true, data })
    }
    if (body.action === "updateStatus" && ["ACTIVE", "DISABLED"].includes(body.status)) {
      const data = await InfraJobService.updateStatus(id, body.status)
      return NextResponse.json({ success: true, data })
    }
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
