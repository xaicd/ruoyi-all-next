export const nextReactAdminWorkflowRouteTemplate = `import { NextResponse } from "next/server"
import { {{entityName}}WorkflowService } from "@/modules/{{moduleName}}/backend/services/workflow.service"
import {
  create{{entityName}}WorkflowSchema,
  audit{{entityName}}WorkflowSchema,
} from "@/modules/{{moduleName}}/backend/validators/workflow.validator"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async () => {
  const data = await {{entityName}}WorkflowService.list()
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionView}}" })

export const POST = withAdminRoute(async (request: Request) => {
  const input = create{{entityName}}WorkflowSchema.parse(await request.json())
  const data = await {{entityName}}WorkflowService.create(input)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionUpdate}}" })

export const PATCH = withAdminRoute(async (request: Request) => {
  const input = audit{{entityName}}WorkflowSchema.parse(await request.json())
  const data = await {{entityName}}WorkflowService.audit(input)
  return NextResponse.json({ success: true, data })
}, { permission: "{{permissionUpdate}}" })
`
