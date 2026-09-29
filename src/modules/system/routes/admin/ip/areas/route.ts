import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { IpAreaService } from "@/modules/system/backend/services/ip-area.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await IpAreaService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageIpAreas"], request)) })
}, { permission: PERMISSIONS.SYSTEM_IP_AREA_VIEW })
