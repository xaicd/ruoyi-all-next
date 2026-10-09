/**
 * Codegen Table Types & Formatters
 */

import { createHash } from "node:crypto"
import { CodegenTableRepository, toCodegenColumnConfig, type CodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import type { CodegenAdvancedConfig, CodegenScene, CodegenTemplate } from "@/modules/infra/contract/codegen.types"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import type { TableInfo } from "@/modules/infra/backend/services/schema-reader.service"

export type OnlineDefinitionPage = {
  items: Array<{
    code: string
    name: string
    publishedReleaseId?: string | null
    currentRelease?: { releaseNo: number; schemaRevision: number } | null
  }>
  total: number
}

export type PublishedRelease = {
  model: { fields: unknown[]; storage: { kind: "GENERIC_RECORD" | "MANAGED_TABLE" } }
}

export type CodegenImportPayload = {
  definitionCode: string
  definitionName: string
  releaseId: string
  schemaRevision: number
  storageKind: "GENERIC_RECORD" | "MANAGED_TABLE"
  moduleName: string
  businessName: string
  className: string
  template: CodegenTemplate
  scene: CodegenScene
  permissionPrefix: string
  advanced: CodegenAdvancedConfig
}

export function inferModuleName(tableName: string): string {
  const prefixes = ["system", "infra", "pay", "mall", "crm", "erp", "bpm", "wms", "mes", "ai", "iot", "im", "mp", "member", "report"]
  for (const prefix of prefixes) if (tableName.startsWith(`${prefix}_`)) return prefix
  return "system"
}

export function toPascalCase(str: string): string {
  return str.split(/[_-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")
}

export function onlineStorageName(tenantId: string, definitionCode: string, releaseId: string): string {
  const suffix = createHash("sha256").update(`${tenantId}:${definitionCode}:${releaseId}`).digest("hex").slice(0, 7)
  return `online_${definitionCode.slice(0, 48)}_${suffix}`
}

export function onlineColumns(payload: CodegenImportPayload): CodegenColumnConfig[] {
  return payload.advanced.fields.map((field) => ({
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

export function buildDatabaseCandidates(tables: TableInfo[]) {
  return tables.map((table) => ({
    id: `DATABASE:${table.name}`,
    name: table.name,
    comment: table.comment,
    columns: table.columns,
    fieldCount: table.columns.length,
    source: "DATABASE" as const,
    physical: true,
    storageKind: null,
    online: null,
  }))
}

export function buildCodegenArchiveOutputs(table: any) {
  return CodegenEngineService.generate({
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
      primaryKey: table.columns.filter((column: any) => column.isPrimary).map((column: any) => column.name),
      indexes: [],
    },
    permissionPrefix: table.permissionPrefix ?? undefined,
    advanced: table.onlineAdvanced ?? undefined,
    generateFrontend: true,
    generateTest: true,
  })
}

export async function createDatabaseImportedTable(tableName: string, tableInfo: TableInfo) {
  const moduleName = inferModuleName(tableName)
  const className = toPascalCase(tableName.replace(/^(system_|infra_|pay_|mall_|crm_|erp_|bpm_|wms_|mes_|ai_|iot_|im_|mp_|member_|report_)/, ""))
  const businessName = tableInfo.comment || className
  return CodegenTableRepository.create({
    tableName,
    tableComment: businessName,
    moduleName,
    businessName,
    className,
    columns: tableInfo.columns.map(toCodegenColumnConfig),
  })
}

export async function createOnlineImportedTable(tenantId: string, payload: CodegenImportPayload) {
  const tableName = onlineStorageName(tenantId, payload.definitionCode, payload.releaseId)
  return CodegenTableRepository.create({
    tableName,
    tableComment: `${payload.definitionName}（Online Release）`,
    moduleName: payload.moduleName,
    businessName: payload.businessName,
    className: payload.className,
    template: payload.template,
    scene: payload.scene,
    permissionPrefix: payload.permissionPrefix,
    source: "ONLINE",
    tenantId,
    onlineDefinitionCode: payload.definitionCode,
    onlineReleaseId: payload.releaseId,
    onlineSchemaRevision: payload.schemaRevision,
    onlineStorageKind: payload.storageKind,
    onlineAdvanced: payload.advanced,
    columns: onlineColumns(payload),
  })
}
