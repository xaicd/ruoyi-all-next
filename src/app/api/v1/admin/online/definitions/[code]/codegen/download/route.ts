import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { strToU8, zipSync } from "fflate"

type RouteContext = { params: Promise<{ code: string }> }

/** Download the same review-only CRUD ZIP emitted by CodegenEngineService; no server-side write occurs. */
export const GET = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { code } = await context.params
  const result = await OnlineDefinitionService.generateCode(auth, code)
  const archive: Record<string, Uint8Array> = {}
  for (const file of result.files) archive[file.path] = strToU8(file.content)
  return new Response(zipSync(archive), { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="online-${code}-release-${result.schemaRevision}.zip"`, "X-Online-Release-Id": result.releaseId } })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_GENERATE })
