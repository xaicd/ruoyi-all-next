import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

export const POST = withAdminRoute(async (request) => {
  const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.testDataSourceConnection"], await request.json())
  return NextResponse.json({ success: true, data: await DataSourceConfigService.testConnection(input) })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_TEST, platformOnly: true })
