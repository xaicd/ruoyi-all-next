import { NextResponse } from "next/server"
import { z } from "zod"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

const querySchema = z.object({ field: z.string().regex(/^[a-z][a-z0-9_]{1,63}$/) })
type RouteContext = { params: Promise<{ code: string }> }

/**
 * Release-scoped dictionary options for generated Online pages.
 * The caller chooses a field, never an arbitrary system dictionary type.
 */
export const GET = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code } = await context.params
  const { field } = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams))
  const data = await OnlineDefinitionService.lookupDictionaryOptions(auth, code, field)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })
