import { NextResponse } from "next/server"
import { bpmPageQuerySchema } from "@/modules/bpm/backend/validators"
import { BpmProcessService } from "@/modules/bpm/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.BPM_PROCESS_DEFINITION_VIEW)
    const { searchParams } = new URL(request.url)
    const input = bpmPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await BpmProcessService.listDefinitions(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
