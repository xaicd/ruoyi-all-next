export const nextReactAdminTreeRouteTemplate = `import { NextResponse } from "next/server"
import { {{entityName}}TreeService } from "@/modules/{{moduleName}}/backend/services/tree.service"
import { {{entityName}}TreeInputSchema } from "@/modules/{{moduleName}}/backend/validators/tree.validator"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async () => {
  const data = await {{entityName}}TreeService.listTree()
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionView}}" })

export const PATCH = withAdminRoute(async (request: Request) => {
  const input = {{entityName}}TreeInputSchema.parse(await request.json())
  const data = await {{entityName}}TreeService.moveNode(input)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionUpdate}}" })
`
