import { NextResponse } from "next/server"
import { AiAccessTokenService } from "@/modules/ai/backend/services/ai-access-token.service"
import { aiIdSchema, aiAccessTokenUpdateSchema } from "@/modules/ai/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type Ctx = { params: Promise<{ id: string }> }

export const PUT = withAdminRoute(async (request, _auth, context: Ctx) => {
  const { id } = aiIdSchema.parse(await context.params)
  const body = aiAccessTokenUpdateSchema.parse(await request.json())
  const data = await AiAccessTokenService.update({ ...body, id })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_TOKEN_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: Ctx) => {
  const { id } = aiIdSchema.parse(await context.params)
  const data = await AiAccessTokenService.delete(id)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.AI_TOKEN_DELETE })
