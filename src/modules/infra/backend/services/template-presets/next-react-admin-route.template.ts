export const nextReactAdminRouteTemplate = `import { NextResponse } from "next/server"
import { {{serviceName}} } from "@/modules/{{moduleName}}/backend/services/{{serviceFile}}"
import { {{validatorName}} } from "@/modules/{{moduleName}}/backend/validators/{{validatorFile}}"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request: Request) => {
  const query = {{validatorName}}.parse(Object.fromEntries(new URL(request.url).searchParams))
  const data = await {{serviceName}}.list(query)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionView}}" })

export const POST = withAdminRoute(async (request: Request) => {
  const input = {{validatorName}}.parse(await request.json())
  const data = await {{serviceName}}.create(input)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionUpdate}}" })
`
