import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { UserProfileService } from "@/modules/system/backend/services/user-profile.service"

export const GET = withAdminRoute(async (_request, auth) => {
  const data = await UserProfileService.getUserProfile(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getUserProfile"], { userId: auth.userId }))
  return NextResponse.json({ success: true, data })
})

export const PUT = withAdminRoute(async (request, auth) => {
  const body = await request.json()
  const data = await UserProfileService.updateUserProfile(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateUserProfile"], { ...body, userId: auth.userId }))
  return NextResponse.json({ success: true, data })
})
