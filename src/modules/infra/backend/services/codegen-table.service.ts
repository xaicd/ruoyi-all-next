import { createHash } from "crypto"
import { CodegenTableRepository, toCodegenColumnConfig, type CodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import type { CodegenAdvancedConfig, CodegenScene, CodegenTemplate } from "@/modules/infra/contract/codegen.types"
import type { CodegenCandidateQueryInput, CodegenImportInput } from "@/modules/infra/backend/validators"
import { onlineFacade } from "@/modules/online/contract/online.facade"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type OnlineDefinitionPage = {
  items: Array<{
    code: string
    name: string
    publishedReleaseId?: string | null
    currentRelease?: { releaseNo: number; schemaRevision: number } | null
  }>
  total: number
}

type PublishedRelease = {
  model: { fields: unknown[]; storage: { kind: "GENERIC_RECORD" | "MANAGED_TABLE" } }
}

type CodegenImportPayload = {
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

async function unwrap<T>(result: { success: boolean; error?: string; data?: unknown }, message: string): Promise<T> {
  if (!result.success) throw new Error(result.error ?? message)
  return result.data as T
}

async function publishedDefinitions(tenantId: string) {
  const items: OnlineDefinitionPage["items"] = []
  let page = 1
  while (true) {
    const data = await unwrap<OnlineDefinitionPage>(
      await onlineFacade.pageDefinitions({ tenantId, page, pageSize: 100, status: "ACTIVE" }, { caller: "infra.codegen" }),
      "online pageDefinitions 调用失败",
    )
    items.push(...data.items.filter((item) => item.publishedReleaseId && item.currentRelease))
    if (items.length >= data.total || data.items.length < 100) return items
    page += 1
  }
}

function inferModuleName(tableName: string): string {
  const prefixes = ["system", "infra", "pay", "mall", "crm", "erp", "bpm", "wms", "mes", "ai", "iot", "im", "mp", "member", "report"]
  for (const prefix of prefixes) if (tableName.startsWith(`${prefix}_`)) return prefix
  return "system"
}

function toPascalCase(str: string): string {
  return str.split(/[_-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")
}

function onlineStorageName(tenantId: string, definitionCode: string, releaseId: string): string {
  const suffix = createHash("sha256").update(`${tenantId}:${definitionCode}:${releaseId}`).digest("hex").slice(0, 7)
  return `online_${definitionCode.slice(0, 48)}_${suffix}`
}

function onlineColumns(payload: CodegenImportPayload): CodegenColumnConfig[] {
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

export class CodegenTableService {
  static async listCodegenTables(input: { page: number; pageSize: number; keyword?: string; tenantId?: string }) {
    const data = await CodegenTableRepository.findList(input)
    domainLog.event("infra.codegen.table.list", { total: data.total, tenantId: input.tenantId })
    return data
  }

  static async getCodegenTable(input: { id: string; tenantId?: string }) {
    const data = await CodegenTableRepository.findById(input.id, input.tenantId)
    if (!data) throw new Error("表配置不存在")
    return data
  }

  static async updateCodegenTable(input: {
    id: string
    tenantId?: string
    tableComment?: string
    moduleName?: string
    businessName?: string
    className?: string
    template?: "CRUD"
    scene?: "ADMIN" | "APP"
    permissionPrefix?: string | null
    columns?: Array<Partial<CodegenColumnConfig> & { name: string }>
  }) {
    const current = await this.getCodegenTable(input)
    const { id, tenantId: _tenantId, columns: requestedColumns, ...metadata } = input
    const columns = requestedColumns && (() => {
      const patches = new Map(requestedColumns.map((column) => [column.name, column]))
      if (patches.size !== current.columns.length || current.columns.some((column) => !patches.has(column.name))) {
        throw new Error("字段结构不可变；仅可调整字段生成配置")
      }
      return current.columns.map((column) => ({ ...column, ...patches.get(column.name)! }))
    })()
    const data = await CodegenTableRepository.update(id, { ...metadata, ...(columns ? { columns } : {}) })
    domainLog.event("infra.codegen.table.update", { id })
    return data
  }

  static async deleteCodegenTable(input: { id: string; tenantId?: string }) {
    await this.getCodegenTable(input)
    await CodegenTableRepository.delete(input.id)
    domainLog.event("infra.codegen.table.delete", { id: input.id })
    return { success: true }
  }

  static async deleteCodegenTables(input: { ids: string[]; tenantId?: string }) {
    const deletable = (await Promise.all(input.ids.map((id) => CodegenTableRepository.findById(id, input.tenantId)))).flatMap((table) => table ? [table.id] : [])
    await CodegenTableRepository.deleteByIds(deletable)
    domainLog.event("infra.codegen.table.deleteMany", { deleted: deletable.length })
    return { deleted: deletable.length }
  }

  static async findStoredTable(input: { id?: string; tableName?: string; tenantId?: string }) {
    if (input.id) return CodegenTableRepository.findById(input.id, input.tenantId)
    if (input.tableName) return CodegenTableRepository.findByTableName(input.tableName, input.tenantId)
    return null
  }

  static async listCodegenCandidates(input: CodegenCandidateQueryInput) {
    const [tables, definitions] = await Promise.all([SchemaReaderService.listTables(), publishedDefinitions(input.tenantId)])
    const physicalNames = new Set(tables.map((table) => table.name))
    const onlineCandidates = await Promise.all(definitions.map(async (definition) => {
      const releaseId = definition.publishedReleaseId!
      const runtime = await unwrap<PublishedRelease>(
        await onlineFacade.resolvePublishedRelease({ tenantId: input.tenantId, definitionCode: definition.code, releaseId }, { caller: "infra.codegen" }),
        "online resolvePublishedRelease 调用失败",
      )
      return {
        id: `ONLINE:${releaseId}`,
        name: definition.code,
        comment: definition.name,
        columns: [] as unknown[],
        fieldCount: runtime.model.fields.length,
        source: "ONLINE" as const,
        physical: physicalNames.has(definition.code),
        storageKind: runtime.model.storage.kind,
        online: { definitionCode: definition.code, definitionName: definition.name, releaseId, releaseNo: definition.currentRelease!.releaseNo, schemaRevision: definition.currentRelease!.schemaRevision },
      }
    }))
    const databaseCandidates = tables.map((table) => ({
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
    const keyword = input.keyword?.toLowerCase()
    const candidates = [...onlineCandidates, ...databaseCandidates].filter((candidate) => {
      if (input.source !== "ALL" && candidate.source !== input.source) return false
      if (!keyword) return true
      return candidate.name.toLowerCase().includes(keyword) || candidate.comment?.toLowerCase().includes(keyword) || candidate.online?.definitionName.toLowerCase().includes(keyword)
    }).sort((left, right) => (left.source === right.source ? left.name.localeCompare(right.name) : left.source === "ONLINE" ? -1 : 1))
    const start = (input.page - 1) * input.pageSize
    domainLog.event("infra.codegen.candidate.list", { total: candidates.length, tenantId: input.tenantId })
    return {
      items: candidates.slice(start, start + input.pageSize),
      total: candidates.length,
      page: input.page,
      pageSize: input.pageSize,
      sourceMode: { ...SchemaReaderService.getSourceMode(), description: `${SchemaReaderService.getSourceMode().description}；已发布 Online 定义以虚拟设计表提供` },
    }
  }

  static async importCodegenTables(input: CodegenImportInput) {
    const imported: { tableName: string; id: string }[] = []
    const skipped: string[] = []
    for (const candidate of input.candidates) {
      if (candidate.source === "DATABASE") {
        const existing = await CodegenTableRepository.findByTableName(candidate.tableName, input.tenantId)
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
      const existing = await CodegenTableRepository.findByOnlineRelease({ tenantId: input.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId })
      if (existing) { skipped.push(candidate.definitionCode); continue }
      const payload = await unwrap<CodegenImportPayload>(
        await onlineFacade.resolveCodegenImport({ tenantId: input.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId }, { caller: "infra.codegen" }),
        "online resolveCodegenImport 调用失败",
      )
      const tableName = onlineStorageName(input.tenantId, payload.definitionCode, payload.releaseId)
      const row = await CodegenTableRepository.create({
        tableName,
        tableComment: `${payload.definitionName}（Online Release）`,
        moduleName: payload.moduleName,
        businessName: payload.businessName,
        className: payload.className,
        template: payload.template,
        scene: payload.scene,
        permissionPrefix: payload.permissionPrefix,
        source: "ONLINE",
        tenantId: input.tenantId,
        onlineDefinitionCode: payload.definitionCode,
        onlineReleaseId: payload.releaseId,
        onlineSchemaRevision: payload.schemaRevision,
        onlineStorageKind: payload.storageKind,
        onlineAdvanced: payload.advanced,
        columns: onlineColumns(payload),
      })
      imported.push({ tableName: row.tableName, id: row.id })
    }
    domainLog.event("infra.codegen.import", { imported: imported.length, skipped: skipped.length, sources: input.candidates.map((candidate) => candidate.source) })
    return { imported, skipped }
  }

  static async generateCodegenArchive(input: { id: string; tenantId?: string }) {
    const table = await this.getCodegenTable(input)
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
        primaryKey: table.columns.filter((column) => column.isPrimary).map((column) => column.name),
        indexes: [],
      },
      permissionPrefix: table.permissionPrefix ?? undefined,
      advanced: table.onlineAdvanced ?? undefined,
      generateFrontend: true,
      generateTest: true,
    })
    domainLog.event("infra.codegen.archive", { tableId: table.id, className: table.className, fileCount: outputs.length })
    return { className: table.className, files: outputs.map((output) => ({ path: output.path, content: output.content })) }
  }

  static async listCodegenCatalog(_input: Record<string, never> = {}) {
    const templates = CodegenEngineService.listTemplates()
    const tables = await SchemaReaderService.listTables()
    return { templates, tables: tables.map((table) => ({ name: table.name, comment: table.comment, columns: table.columns.length })) }
  }
}
