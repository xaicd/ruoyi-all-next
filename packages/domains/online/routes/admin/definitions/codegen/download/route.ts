import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { batchDownloadOnlineCodeSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { strToU8, zipSync } from "fflate"

/** Builds one review ZIP from selected tenant-scoped, immutable Published Releases. */
export const POST = withAdminRoute(async (request, auth) => {
  const input = batchDownloadOnlineCodeSchema.parse(await request.json())
  const results = await OnlineDefinitionService.generateCodeBatch(auth, input)
  const archive: Record<string, Uint8Array> = {}
  for (const result of results) {
    const prefix = `online-${result.code}-release-${result.schemaRevision}`
    for (const file of result.files) archive[`${prefix}/${file.path}`] = strToU8(file.content)
  }
  return new Response(zipSync(archive), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=online-codegen-batch.zip",
    },
  })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_GENERATE })
