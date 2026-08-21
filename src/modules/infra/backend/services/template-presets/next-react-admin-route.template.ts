export const nextReactAdminRouteTemplate = `import { NextResponse } from "next/server"
import { {{serviceName}} } from "@/modules/{{moduleName}}/backend/services/{{serviceFile}}"
import { {{validatorName}} } from "@/modules/{{moduleName}}/backend/validators/{{validatorFile}}"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request: Request) => {
  const query = parseActionQuery({{validatorName}}, request)
  const data = await {{serviceName}}.list(query)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionView}}" })

export const POST = withAdminRoute(async (request: Request) => {
  const input = parseActionBody({{validatorName}}, await request.json())
  const data = await {{serviceName}}.create(input)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionUpdate}}" })
`
