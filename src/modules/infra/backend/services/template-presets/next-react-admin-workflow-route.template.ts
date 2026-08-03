export const nextReactAdminWorkflowRouteTemplate = `import { apiResponse, parseBody } from "@/lib/api-response"
import { withAuth } from "@/lib/rbac"
import { PERMISSIONS } from "@/lib/rbac-registry"
import { handleRouteError } from "@/backend/utils/route-handler"
import { {{entityName}}WorkflowService } from "@/backend/services/{{modulePath}}/workflow.service"
import {
  create{{entityName}}WorkflowSchema,
  audit{{entityName}}WorkflowSchema,
} from "@/backend/validators/{{modulePath}}/workflow.validator"

export const GET = withAuth(async () => {
  try {
    const data = await {{entityName}}WorkflowService.list()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionView}} })

export const POST = withAuth(async (request: Request) => {
  try {
    const body = await parseBody(request)
    const input = create{{entityName}}WorkflowSchema.parse(body)
    const data = await {{entityName}}WorkflowService.create(input)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionUpdate}} })

export const PATCH = withAuth(async (request: Request) => {
  try {
    const body = await parseBody(request)
    const input = audit{{entityName}}WorkflowSchema.parse(body)
    const data = await {{entityName}}WorkflowService.audit(input)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionUpdate}} })
`
