import { NextResponse } from "next/server"
import { CodegenTableRepository } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { zipSync, strToU8 } from "fflate"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/admin/infra/codegen/:id/download
 * 生成代码并下载 ZIP
 */
export const GET = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params

    const table = await CodegenTableRepository.findById(id)
    if (!table) return NextResponse.json({ success: false, error: "表配置不存在" }, { status: 404 })

    // 调用 CodegenEngine 生成代码
    const outputs = CodegenEngineService.generate({
      moduleName: table.moduleName,
      businessName: table.businessName,
      className: table.className,
      template: table.template,
      scene: table.scene,
      table: {
        name: table.tableName,
        comment: table.tableComment,
        schema: "public",
        type: "TABLE",
        columns: table.columns,
        primaryKey: table.columns.filter((c) => c.isPrimary).map((c) => c.name),
        indexes: [],
      },
      generateFrontend: true,
      generateTest: true,
    })

    // 打包为 ZIP
    const files: Record<string, Uint8Array> = {}
    for (const output of outputs) {
      files[output.path] = strToU8(output.content)
    }
    const zipped = zipSync(files)

    domainLog.event("infra.codegen.download", { tableId: id, className: table.className, fileCount: outputs.length })

    return new Response(zipped, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="codegen-${table.className}.zip"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.INFRA_CODEGEN_DOWNLOAD })
