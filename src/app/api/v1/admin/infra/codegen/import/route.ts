import { NextResponse } from "next/server"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import { CodegenTableRepository, toCodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { z } from "zod"

const importSchema = z.object({
  tableNames: z.array(z.string().min(1)).min(1, "至少选择一张表"),
})

/**
 * POST /api/v1/admin/infra/codegen/import
 * 导入表：从 Schema Reader 读取表结构，保存到 CodegenTable
 */
export const POST = withAdminRoute(async (request: Request, _auth) => {
  try {
    const body = await request.json()
    const { tableNames } = importSchema.parse(body)

    const imported: { tableName: string; id: string }[] = []
    const skipped: string[] = []

    for (const tableName of tableNames) {
      // 检查是否已导入
      const existing = await CodegenTableRepository.findByTableName(tableName)
      if (existing) {
        skipped.push(tableName)
        continue
      }

      // 从 Schema Reader 获取表结构
      const tableInfo = await SchemaReaderService.getTable(tableName)
      if (!tableInfo) {
        skipped.push(tableName)
        continue
      }

      // 推断模块名和类名
      const moduleName = inferModuleName(tableName)
      const className = toPascalCase(tableName.replace(/^(system_|infra_|pay_|mall_|crm_|erp_|bpm_|wms_|mes_|ai_|iot_|im_|mp_|member_|report_)/, ""))
      const businessName = tableInfo.comment || className

      // 转换列配置
      const columns = tableInfo.columns.map(toCodegenColumnConfig)

      const row = await CodegenTableRepository.create({
        tableName,
        tableComment: businessName,
        moduleName,
        businessName,
        className,
        columns,
      })

      imported.push({ tableName, id: row.id })
    }

    domainLog.event("infra.codegen.import", { imported: imported.length, skipped: skipped.length })

    return NextResponse.json({ success: true, data: { imported, skipped } })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_UPDATE })

function inferModuleName(tableName: string): string {
  const prefixes = ["system", "infra", "pay", "mall", "crm", "erp", "bpm", "wms", "mes", "ai", "iot", "im", "mp", "member", "report"]
  for (const prefix of prefixes) {
    if (tableName.startsWith(prefix + "_")) return prefix
  }
  return "system"
}

function toPascalCase(str: string): string {
  return str.split(/[_-]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("")
}
