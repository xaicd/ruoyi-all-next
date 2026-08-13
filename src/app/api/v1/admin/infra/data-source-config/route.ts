import { NextResponse } from "next/server"
import { DataSourceConfigService } from "@/modules/infra/backend/services/data-source-config.service"
import { createDataSourceConfigSchema, dataSourceConfigPageSchema, updateDataSourceConfigSchema } from "@/modules/infra/backend/validators/data-source-config.validator"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requireAdminAuth } from "@/modules/shared/backend/auth/guards"

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "数据源配置操作失败"
  return NextResponse.json({ success: false, error: message }, { status: getAuthErrorStatus(error) || 400 })
}

export async function GET(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_QUERY)
    const params = new URL(request.url).searchParams
    const id = params.get("id")
    const data = id
      ? await DataSourceConfigService.get(id)
      : await DataSourceConfigService.page(dataSourceConfigPageSchema.parse(Object.fromEntries(params)))
    return NextResponse.json({ success: true, data })
  } catch (error) { return failure(error) }
}

export async function POST(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_CREATE)
    const data = await DataSourceConfigService.create(createDataSourceConfigSchema.parse(await request.json()))
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) { return failure(error) }
}

export async function PUT(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_UPDATE)
    const data = await DataSourceConfigService.update(updateDataSourceConfigSchema.parse(await request.json()))
    return NextResponse.json({ success: true, data })
  } catch (error) { return failure(error) }
}

export async function DELETE(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.INFRA_DATA_SOURCE_CONFIG_DELETE)
    const id = new URL(request.url).searchParams.get("id")
    if (!id) throw new Error("数据源 ID 不能为空")
    return NextResponse.json({ success: true, data: await DataSourceConfigService.delete(id) })
  } catch (error) { return failure(error) }
}
