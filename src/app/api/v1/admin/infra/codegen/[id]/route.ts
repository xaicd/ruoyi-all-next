import { NextResponse } from "next/server"
import { z } from "zod"
import { CodegenTableRepository, type CodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

const identifier = z.string().regex(/^[a-z][a-z0-9_]{0,63}$/)
const permissionPrefix = z.string().regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/).nullable().optional()
const mutableColumnSchema = z.object({
  name: identifier,
  uiComponent: z.enum(["INPUT", "TEXTAREA", "NUMBER", "SELECT", "RADIO", "CHECKBOX", "SWITCH", "DATE", "DATETIME", "UPLOAD", "RICH_TEXT", "TREE_SELECT", "HIDDEN"]),
  listShow: z.boolean(), formShow: z.boolean(), queryShow: z.boolean(),
  queryType: z.enum(["=", "LIKE", "BETWEEN", ">", "<", "IN"]),
  dictType: identifier.nullable(), formValidation: z.enum(["required"]).nullable(),
}).strict()
const updateSchema = z.object({
  tableComment: z.string().trim().min(1).max(100).optional(),
  moduleName: identifier.optional(), businessName: z.string().trim().min(1).max(100).optional(),
  className: z.string().regex(/^[A-Z][A-Za-z0-9]{0,63}$/).optional(),
  template: z.literal("CRUD").optional(), scene: z.enum(["ADMIN", "APP"]).optional(),
  permissionPrefix, columns: z.array(mutableColumnSchema).min(1).max(128).optional(),
}).strict()

export const GET = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await CodegenTableRepository.findById(id)
  if (!data) return NextResponse.json({ success: false, error: "表配置不存在" }, { status: 404 })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })

export const PUT = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const current = await CodegenTableRepository.findById(id)
  if (!current) return NextResponse.json({ success: false, error: "表配置不存在" }, { status: 404 })
  const input = updateSchema.parse(await request.json())
  const { columns: requestedColumns, ...metadata } = input
  const columns: CodegenColumnConfig[] | undefined = requestedColumns && (() => {
    const patches = new Map(requestedColumns.map((column) => [column.name, column]))
    if (patches.size !== current.columns.length || current.columns.some((column) => !patches.has(column.name))) throw new Error("字段结构不可变；仅可调整字段生成配置")
    return current.columns.map((column) => ({ ...column, ...patches.get(column.name)! }))
  })()
  const data = await CodegenTableRepository.update(id, { ...metadata, ...(columns ? { columns } : {}) })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_UPDATE })

export const DELETE = withAdminRoute(async (_request: Request, _auth, context: RouteContext) => {
  const { id } = await context.params
  await CodegenTableRepository.delete(id)
  return NextResponse.json({ success: true })
}, { permission: PERMISSIONS.INFRA_CODEGEN_DELETE })
