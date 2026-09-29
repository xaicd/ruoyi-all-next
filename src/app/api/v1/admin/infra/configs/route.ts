import { NextResponse } from "next/server"
import { InfraConfigService } from "@/modules/infra/backend/services/config.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  try {
    if (new URL(request.url).searchParams.get("key")) {
      const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.getConfigByKey"], request)
      const data = await InfraConfigService.getConfigByKey(input)
      return NextResponse.json({ success: true, data })
    }
    const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.listConfigs"], request)
    const data = await InfraConfigService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CONFIG_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.createConfig"], await request.json())
    const data = await InfraConfigService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CONFIG_UPDATE })
