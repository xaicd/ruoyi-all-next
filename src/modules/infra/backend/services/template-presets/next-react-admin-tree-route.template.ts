export const nextReactAdminTreeRouteTemplate = `import { apiResponse, parseBody } from "@/lib/api-response"
import { withAuth } from "@/lib/rbac"
import { PERMISSIONS } from "@/lib/rbac-registry"
import { handleRouteError } from "@/backend/utils/route-handler"
import { {{entityName}}TreeService } from "@/backend/services/{{modulePath}}/tree.service"
import { {{entityName}}TreeInputSchema } from "@/backend/validators/{{modulePath}}/tree.validator"

export const GET = withAuth(async () => {
  try {
    const data = await {{entityName}}TreeService.listTree()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionView}} })

export const PATCH = withAuth(async (request: Request) => {
  try {
    const body = await parseBody(request)
    const input = {{entityName}}TreeInputSchema.parse(body)
    const data = await {{entityName}}TreeService.moveNode(input)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionUpdate}} })
`
