import { NextResponse } from "next/server"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/**
 * GET /api/v1/admin/infra/codegen/tables
 * 获取可导入的数据库表列表（从 Schema Reader 读取）
 */
export const GET = withAdminRoute(async (request: Request, _auth) => {
  try {
    const tables = await SchemaReaderService.listTables()
    const sourceMode = SchemaReaderService.getSourceMode()
    return NextResponse.json({ success: true, data: { tables, sourceMode } })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })
