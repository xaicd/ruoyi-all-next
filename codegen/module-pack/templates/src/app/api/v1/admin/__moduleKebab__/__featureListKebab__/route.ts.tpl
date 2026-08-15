import { NextResponse } from "next/server"
import { {{featureListPascal}}Service } from "@/modules/{{moduleKebab}}/backend/services/{{featureListKebab}}.service"
import { {{featureCamel}}CreateSchema, {{featureCamel}}PageQuerySchema, {{featureCamel}}UpdateSchema } from "@/modules/{{moduleKebab}}/backend/validators/{{featureListKebab}}.validator"
import { {{featureListPascal}}PermissionCodes } from "@/modules/{{moduleKebab}}/backend/constants/{{featureListKebab}}.permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const id = searchParams.get("id")
  if (id) return NextResponse.json({ success: true, data: await {{featureListPascal}}Service.get(id) })
  const input = {{featureCamel}}PageQuerySchema.parse(Object.fromEntries(searchParams))
  return NextResponse.json({ success: true, data: await {{featureListPascal}}Service.page(input) })
}, { permission: {{featureListPascal}}PermissionCodes.query })

export const POST = withAdminRoute(async (request: Request) => {
  const input = {{featureCamel}}CreateSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await {{featureListPascal}}Service.create(input) }, { status: 201 })
}, { permission: {{featureListPascal}}PermissionCodes.create })

export const PUT = withAdminRoute(async (request: Request) => {
  const input = {{featureCamel}}UpdateSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await {{featureListPascal}}Service.update(input) })
}, { permission: {{featureListPascal}}PermissionCodes.update })
export const DELETE = withAdminRoute(async (request: Request) => {
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "id 不能为空" }, { status: 400 })
  return NextResponse.json({ success: true, data: await {{featureListPascal}}Service.delete(id) })
}, { permission: {{featureListPascal}}PermissionCodes.delete })
