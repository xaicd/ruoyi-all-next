import { NextResponse } from "next/server"
import { infraPageQuerySchema, triggerJobSchema } from "@/modules/infra/backend/validators"
import { InfraJobCenterService } from "@/modules/infra/backend/services/job-center.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_JOB_VIEW)
    const { searchParams } = new URL(request.url)
    const input = infraPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await InfraJobCenterService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.INFRA_JOB_OPERATE)
    const body = await request.json()
    const input = triggerJobSchema.parse(body)
    const data = await InfraJobCenterService.trigger(input)
    await writeAuditLog({
      action: "infra.job.operate",
      operatorId: auth.userId,
      targetType: "JOB",
      targetId: input.jobId,
      detail: { action: input.action },
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
