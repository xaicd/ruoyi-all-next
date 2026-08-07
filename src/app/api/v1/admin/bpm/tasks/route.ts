import { NextResponse } from "next/server"
import { bpmPageQuerySchema, bpmTaskActionSchema } from "@/modules/bpm/backend/validators"
import { BpmProcessService } from "@/modules/bpm/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.BPM_TASK_VIEW)
    const { searchParams } = new URL(request.url)
    const input = bpmPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await BpmProcessService.listTasks(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.BPM_TASK_APPROVE)
    const body = await request.json()
    const input = bpmTaskActionSchema.parse(body)
    const data = await BpmProcessService.actionTask(input)
    await writeAuditLog({
      action: "bpm.task.action",
      operatorId: auth.userId,
      targetType: "BPM_TASK",
      targetId: input.taskId,
      detail: { action: input.action },
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
