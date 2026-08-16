import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { CodegenTableRepository, toCodegenColumnConfig, type CodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import { toOnlineCodegenConfig } from "@/modules/online/backend/application/online-codegen.adapter"
import { KyselyOnlineRuntimeRepository } from "@/modules/online/backend/adapters/persistence/online-runtime.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

const databaseCandidateSchema = z.object({ source: z.literal("DATABASE"), tableName: z.string().trim().min(1).max(100) }).strict()
const onlineCandidateSchema = z.object({ source: z.literal("ONLINE"), definitionCode: z.string().trim().regex(/^[a-z][a-z0-9_]{1,63}$/), releaseId: z.string().uuid() }).strict()
const importSchema = z.object({ candidates: z.array(z.discriminatedUnion("source", [databaseCandidateSchema, onlineCandidateSchema])).min(1, "至少选择一张表").max(100) }).strict()

function onlineStorageName(tenantId: string, definitionCode: string, releaseId: string): string {
  const suffix = createHash("sha256").update(`${tenantId}:${definitionCode}:${releaseId}`).digest("hex").slice(0, 7)
  return `online_${definitionCode.slice(0, 48)}_${suffix}`
}

function onlineColumns(config: ReturnType<typeof toOnlineCodegenConfig>): CodegenColumnConfig[] {
  return config.advanced.fields.map((field) => ({
    name: field.name,
    type: field.type,
    tsType: field.tsType,
    comment: field.comment,
    nullable: field.nullable,
    defaultValue: field.defaultValue,
    isPrimary: field.isPrimary,
    isAutoIncrement: field.isAutoIncrement,
    maxLength: field.maxLength,
    enumValues: field.enumValues,
    uiComponent: field.widget === "DICTIONARY" || field.widget === "SELECT" ? "SELECT" : field.uiComponent,
    listShow: field.listShow,
    formShow: field.formShow,
    queryShow: field.queryShow,
    queryType: field.queryType,
    dictType: field.dictType,
    formValidation: field.formValidation,
  }))
}

/**
 * Imports physical tables or a server-resolved, tenant-scoped immutable Online Release.
 * Browser input identifies only the candidate; all Online fields and behaviors come from the Release snapshot.
 */
export const POST = withAdminRoute(async (request: Request, auth) => {
  try {
    const { candidates } = importSchema.parse(await request.json())
    const imported: { tableName: string; id: string }[] = []
    const skipped: string[] = []

    for (const candidate of candidates) {
      if (candidate.source === "DATABASE") {
        const existing = await CodegenTableRepository.findByTableName(candidate.tableName, auth.tenantId)
        if (existing) { skipped.push(candidate.tableName); continue }
        const tableInfo = await SchemaReaderService.getTable(candidate.tableName)
        if (!tableInfo) { skipped.push(candidate.tableName); continue }
        const moduleName = inferModuleName(candidate.tableName)
        const className = toPascalCase(candidate.tableName.replace(/^(system_|infra_|pay_|mall_|crm_|erp_|bpm_|wms_|mes_|ai_|iot_|im_|mp_|member_|report_)/, ""))
        const businessName = tableInfo.comment || className
        const row = await CodegenTableRepository.create({ tableName: candidate.tableName, tableComment: businessName, moduleName, businessName, className, columns: tableInfo.columns.map(toCodegenColumnConfig) })
        imported.push({ tableName: row.tableName, id: row.id })
        continue
      }

      if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online 设计表必须在租户上下文中导入")
      const existing = await CodegenTableRepository.findByOnlineRelease({ tenantId: auth.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId })
      if (existing) { skipped.push(candidate.definitionCode); continue }
      const runtime = await KyselyOnlineRuntimeRepository.resolvePublishedReleaseById({ tenantId: auth.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId })
      const childRuntimes = await KyselyOnlineRuntimeRepository.resolveMasterDetailChildReleases({ tenantId: auth.tenantId, runtime })
      const config = toOnlineCodegenConfig(runtime, childRuntimes)
      const tableName = onlineStorageName(auth.tenantId, runtime.definitionCode, runtime.releaseId)
      const row = await CodegenTableRepository.create({
        tableName,
        tableComment: `${runtime.definitionName}（Online Release）`,
        moduleName: config.moduleName,
        businessName: config.businessName,
        className: config.className,
        template: config.template,
        scene: config.scene,
        permissionPrefix: config.permissionPrefix,
        source: "ONLINE",
        tenantId: auth.tenantId,
        onlineDefinitionCode: runtime.definitionCode,
        onlineReleaseId: runtime.releaseId,
        onlineSchemaRevision: runtime.schemaRevision,
        onlineStorageKind: runtime.model.storage.kind,
        onlineAdvanced: config.advanced,
        columns: onlineColumns(config),
      })
      imported.push({ tableName: row.tableName, id: row.id })
    }

    domainLog.event("infra.codegen.import", { imported: imported.length, skipped: skipped.length, sources: candidates.map((candidate) => candidate.source) })
    return NextResponse.json({ success: true, data: { imported, skipped } })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_CREATE })

function inferModuleName(tableName: string): string {
  const prefixes = ["system", "infra", "pay", "mall", "crm", "erp", "bpm", "wms", "mes", "ai", "iot", "im", "mp", "member", "report"]
  for (const prefix of prefixes) if (tableName.startsWith(`${prefix}_`)) return prefix
  return "system"
}

function toPascalCase(str: string): string {
  return str.split(/[_-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")
}
