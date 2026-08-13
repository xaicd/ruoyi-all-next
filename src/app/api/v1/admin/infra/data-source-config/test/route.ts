import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { testDataSourceConnectionSchema } from "@/modules/infra/backend/validators/data-source-config.validator"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requireAdminAuth } from "@/modules/shared/backend/auth/guards"

export async function POST(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_TEST)
    const input = testDataSourceConnectionSchema.parse(await request.json())
    const data = await DataSourceConfigService.testConnection(input)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "数据源连接测试失败"
    return NextResponse.json({ success: false, error: message }, { status: getAuthErrorStatus(error) || 400 })
  }
}
