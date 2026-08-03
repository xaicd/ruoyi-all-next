export const nextReactAdminRouteTemplate = `import { NextResponse } from "next/server"
import { apiResponse, parseBody } from "@/lib/api-response"
import { withAuth } from "@/lib/rbac"
import { PERMISSIONS } from "@/lib/rbac-registry"
import { handleRouteError } from "@/backend/utils/route-handler"
import { {{serviceName}} } from "@/backend/services/{{modulePath}}/{{serviceFile}}"
import { {{validatorName}} } from "@/backend/validators/{{modulePath}}/{{validatorFile}}"

export const GET = withAuth(async (request: Request, ...args: unknown[]) => {
  try {
    const query = {{validatorName}}.parse(Object.fromEntries(new URL(request.url).searchParams))
    const data = await {{serviceName}}.list(query)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionView}} })

export const POST = withAuth(async (request: Request) => {
  try {
    const body = await parseBody(request)
    const input = {{validatorName}}.parse(body)
    const data = await {{serviceName}}.create(input)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleRouteError(error)
  }
}, { permission: PERMISSIONS.{{permissionUpdate}} })
`
