import { NextResponse } from "next/server"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

/**
 * POST /api/v1/admin/infra/codegen/preview
 * 预览生成代码（不写入文件）
 */
export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const body = await request.json()

    const config = {
      moduleName: body.moduleName,
      subModule: body.subModule,
      businessName: body.businessName,
      className: body.className,
      template: body.template || "CRUD",
      scene: body.scene || "ADMIN",
      table: body.table || { name: body.tableName || body.className?.toLowerCase(), comment: body.businessName, columns: [] },
      author: body.author,
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
}
