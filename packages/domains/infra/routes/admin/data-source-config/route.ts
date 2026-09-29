import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { createDataSourceConfigSchema, updateDataSourceConfigSchema } from "@/modules/infra/backend/validators/data-source-config.validator"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const tenantId = params.get("tenantId")?.trim() ?? ""
  const id = params.get("id")
  const data = id
    ? await DataSourceConfigService.get(tenantId, id)
    : await DataSourceConfigService.page(parseActionQuery(INFRA_ACTION_SCHEMAS["infra.pageDataSourceConfigs"], request))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_QUERY, platformOnly: true })

export const POST = withAdminRoute(async (request) => NextResponse.json({ success: true, data: await DataSourceConfigService.create(createDataSourceConfigSchema.parse(await request.json())) }, { status: 201 }), { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_CREATE, platformOnly: true })
export const PUT = withAdminRoute(async (request) => NextResponse.json({ success: true, data: await DataSourceConfigService.update(updateDataSourceConfigSchema.parse(await request.json())) }), { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_UPDATE, platformOnly: true })
export const DELETE = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  const tenantId = params.get("tenantId")?.trim()
  if (!id || !tenantId) return NextResponse.json({ success: false, error: "数据源 ID 和归属租户不能为空" }, { status: 400 })
  return NextResponse.json({ success: true, data: await DataSourceConfigService.delete(tenantId, id) })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_DELETE, platformOnly: true })
