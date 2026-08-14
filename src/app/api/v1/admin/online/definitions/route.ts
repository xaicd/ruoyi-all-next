import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { onlineDefinitionPageSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/** Phase-1 Online management boundary; metadata CRUD is enabled with the tenant-scoped schema migration. */
export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = onlineDefinitionPageSchema.parse(Object.fromEntries(params))
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.page(input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })
