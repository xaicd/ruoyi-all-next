import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { testDataSourceConnectionSchema } from "@/modules/infra/backend/validators/data-source-config.validator"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const POST = withAdminRoute(async (request) => {
  const input = testDataSourceConnectionSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await DataSourceConfigService.testConnection(input) })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_TEST, platformOnly: true })
