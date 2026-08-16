import { NextResponse } from "next/server"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { CodegenTableRepository } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/**
 * POST /api/v1/admin/infra/codegen/preview
 * 预览生成代码（不写入文件）
 */
export const POST = withAdminRoute(async (request: Request, auth) => {
  try {
    const body = await request.json()

    const stored = body.tableId
      ? await CodegenTableRepository.findById(String(body.tableId), auth.tenantId)
      : body.tableName
        ? await CodegenTableRepository.findByTableName(String(body.tableName), auth.tenantId)
        : null
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

    const outputs = CodegenEngineService.preview(config)

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
