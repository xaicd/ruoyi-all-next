import { NextResponse } from "next/server"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

/**
 * GET /api/v1/admin/infra/codegen/tables
 * 获取可导入的数据库表列表（从 Schema Reader 读取）
 */
export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const tables = await SchemaReaderService.listTables()
    const sourceMode = SchemaReaderService.getSourceMode()
    return NextResponse.json({ success: true, data: { tables, sourceMode } })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
