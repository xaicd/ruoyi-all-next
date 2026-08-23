import { NextResponse } from "next/server"
import { AiGatewayRelayService } from "@/modules/ai/backend/services/ai-gateway-relay.service"
import { aiRelayChatSchema } from "@/modules/ai/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const POST = withAdminRoute(async (request) => {
  const body = aiRelayChatSchema.parse(await request.json())
  const data = await AiGatewayRelayService.relayChatCompletion({
    apiKey: body.apiKey || "sk-ruoyi-demo-gateway",
    model: body.model,
    messages: body.messages,
  })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_PLAYGROUND_VIEW })
