import { NextResponse } from "next/server"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"

/**
 * POST /api/v1/admin/infra/codegen/generate
 *
 * 低代码生成接口：传入配置，返回生成的代码文件列表
 *
 * Body:
 * {
 *   moduleName: "ticket",
 *   businessName: "工单",
 *   className: "Ticket",
 *   template: "CRUD",
 *   scene: "ADMIN",
 *   tableName: "system_user",    // 可选：从表结构生成
 *   generateFrontend: true,
 *   generateTest: true
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      moduleName,
      businessName,
      className,
      template = "CRUD",
      scene = "ADMIN",
      tableName,
      subModule,
      generateFrontend = true,
      generateTest = true,
    } = body

    if (!moduleName || !businessName || !className) {
      return NextResponse.json(
        { success: false, error: "moduleName, businessName, className 必填" },
        { status: 400 },
      )
    }

    // 获取表结构（如果指定了 tableName）
    let table = tableName ? await SchemaReaderService.getTable(tableName) : null

    // 如果没有表结构，生成一个最小默认结构
    if (!table) {
      table = {
        name: moduleName + "_" + className.toLowerCase(),
        comment: businessName,
        schema: "public",
        type: "TABLE",
        primaryKey: ["id"],
        indexes: [],
        columns: [
          { name: "id", type: "uuid", tsType: "string", nullable: false, isPrimary: true, isAutoIncrement: false, uiComponent: "HIDDEN" },
          { name: "name", type: "varchar", tsType: "string", comment: "名称", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 100, uiComponent: "INPUT" },
          { name: "status", type: "varchar", tsType: "string", comment: "状态", nullable: false, isPrimary: false, isAutoIncrement: false, enumValues: ["ACTIVE", "DISABLED"], uiComponent: "SELECT" },
          { name: "remark", type: "text", tsType: "string", comment: "备注", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "TEXTAREA" },
          { name: "created_at", type: "timestamptz", tsType: "string", comment: "创建时间", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "DATETIME" },
        ],
      }
    }

    const outputs = CodegenEngineService.generate({
      moduleName,
      subModule,
      businessName,
      className,
      template,
      scene,
      table,
      generateFrontend,
      generateTest,
    })

    return NextResponse.json({
      success: true,
      data: {
        fileCount: outputs.length,
        files: outputs.map((f) => ({ path: f.path, type: f.type, lines: f.content.split("\n").length })),
        // 预览模式：返回完整代码内容
        preview: outputs,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "生成失败" }, { status: 400 })
  }
}

/**
 * GET /api/v1/admin/infra/codegen/generate
 * 获取可用的模板列表
 */
export async function GET() {
  const templates = CodegenEngineService.listTemplates()
  const tables = await SchemaReaderService.listTables()
  return NextResponse.json({
    success: true,
    data: { templates, tables: tables.map((t) => ({ name: t.name, comment: t.comment, columns: t.columns.length })) },
  })
}
