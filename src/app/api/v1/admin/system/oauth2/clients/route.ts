import { NextResponse } from "next/server"
import { pageQuerySchema } from "@/modules/system/backend/validators"
import { SystemOauth2Service } from "@/modules/system/backend/services/oauth2.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const input = pageQuerySchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined })
  return NextResponse.json({ success: true, data: await SystemOauth2Service.listClients(input) })
}, { permission: PERMISSIONS.SYSTEM_OAUTH2_CLIENT_VIEW, platformOnly: true })
