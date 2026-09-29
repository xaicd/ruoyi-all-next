import { NextResponse } from "next/server"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

/**
 * POST /api/v1/admin/infra/codegen/preview
 * 预览生成代码（不写入文件）
 */
export const POST = withAdminRoute(async (request: Request, auth) => {
  try {
    const body = await request.json()

    const stored = await CodegenTableService.findStoredTable({
      id: body.tableId ? String(body.tableId) : undefined,
      tableName: body.tableName ? String(body.tableName) : undefined,
      tenantId: auth.tenantId,
    })
    if (!body.table && !stored) throw new Error("请提供已导入的 tableId/tableName，或完整 table 配置")

    const config = {
      moduleName: body.moduleName ?? stored?.moduleName,
      subModule: body.subModule,
      businessName: body.businessName ?? stored?.businessName,
      className: body.className ?? stored?.className,
      template: body.template ?? stored?.template ?? "CRUD",
      scene: body.scene ?? stored?.scene ?? "ADMIN",
      table: body.table ?? {
        name: stored!.tableName,
        comment: stored!.tableComment,
        schema: "public",
        type: "TABLE" as const,
        columns: stored!.columns,
        primaryKey: stored!.columns.filter((column) => column.isPrimary).map((column) => column.name),
        indexes: [],
      },
      author: body.author ?? stored?.author,
      permissionPrefix: body.permissionPrefix ?? stored?.permissionPrefix ?? undefined,
      advanced: stored?.onlineAdvanced ?? undefined,
      generateFrontend: body.generateFrontend ?? true,
      generateTest: body.generateTest ?? false,
    }

    const outputs = CodegenEngineService.preview(parseActionBody(INFRA_ACTION_SCHEMAS["infra.previewCodegen"], config))

    return NextResponse.json({
      success: true,
      data: outputs.map((o) => ({
        path: o.path,
        type: o.type,
        content: o.content,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "生成失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.INFRA_CODEGEN_PREVIEW })
