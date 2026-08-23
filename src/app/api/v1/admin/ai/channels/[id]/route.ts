import { NextResponse } from "next/server"
import { AiChannelService } from "@/modules/ai/backend/services/ai-channel.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type Ctx = { params: Promise<{ id: string }> }

export const PUT = withAdminRoute(async (request, _auth, context: Ctx) => {
  const { id } = await context.params
  const body = await request.json()
  const data = await AiChannelService.update({ ...body, id })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_CHANNEL_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: Ctx) => {
  const { id } = await context.params
  const data = await AiChannelService.delete(id)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_CHANNEL_DELETE })
