import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { createDataSourceConfigSchema, dataSourceConfigPageSchema, updateDataSourceConfigSchema } from "@/modules/infra/backend/validators/data-source-config.validator"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  const data = id
    ? await DataSourceConfigService.get(id)
    : await DataSourceConfigService.page(dataSourceConfigPageSchema.parse(Object.fromEntries(params)))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_QUERY, platformOnly: true })

export const POST = withAdminRoute(async (request) => {
  const data = await DataSourceConfigService.create(createDataSourceConfigSchema.parse(await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_CREATE, platformOnly: true })

export const PUT = withAdminRoute(async (request) => {
  const data = await DataSourceConfigService.update(updateDataSourceConfigSchema.parse(await request.json()))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_UPDATE, platformOnly: true })

export const DELETE = withAdminRoute(async (request) => {
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "数据源 ID 不能为空" }, { status: 400 })
  return NextResponse.json({ success: true, data: await DataSourceConfigService.delete(id) })
}, { permission: PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_DELETE, platformOnly: true })
