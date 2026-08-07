import { NextResponse } from "next/server"
import { InfraRedisService } from "@/modules/infra/backend/services/redis.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_REDIS_VIEW)
    const data = await InfraRedisService.metrics()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
