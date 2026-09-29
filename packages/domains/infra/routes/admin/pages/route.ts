import { NextResponse } from "next/server"
import { InfraPageService } from "@/modules/infra/backend/services/page.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

/**
 * Compatibility-only read endpoint for legacy Puck data. It is not part of the
 * Online engine and cannot create definitions, releases, or runtime pages.
 */
export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.listPages"], request)
  return NextResponse.json({ success: true, data: await InfraPageService.listPages(input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })

export const POST = withAdminRoute(async () => {
  return NextResponse.json({ success: false, error: "旧页面构建 API 已退役；请使用 Online Definition 工作台。" }, { status: 410 })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_CREATE })
