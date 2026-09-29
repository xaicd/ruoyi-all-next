import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { createOnlineDefinitionSchema, onlineDefinitionPageSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request, auth) => {
  const input = onlineDefinitionPageSchema.parse(Object.fromEntries(new URL(request.url).searchParams))
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.page(auth, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })

export const POST = withAdminRoute(async (request, auth) => {
  const input = createOnlineDefinitionSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.create(auth, input) }, { status: 201 })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_CREATE })
