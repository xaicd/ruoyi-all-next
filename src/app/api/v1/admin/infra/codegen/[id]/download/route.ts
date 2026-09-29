import { zipSync, strToU8 } from "fflate"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { id } = await context.params
  const archive = await CodegenTableService.generateCodegenArchive(parseActionBody(INFRA_ACTION_SCHEMAS["infra.generateCodegenArchive"], { id, tenantId: auth.tenantId }))
  const files: Record<string, Uint8Array> = {}
  for (const file of archive.files) files[file.path] = strToU8(file.content)
  return new Response(zipSync(files), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="codegen-${archive.className}.zip"`,
    },
  })
}, { permission: PERMISSIONS.INFRA_CODEGEN_DOWNLOAD })
