import { CodegenTableRepository, type CodegenColumnConfig } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import type { CodegenCandidateQueryInput, CodegenImportInput } from "@/modules/infra/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import {
  type OnlineDefinitionPage,
  type PublishedRelease,
  type CodegenImportPayload,
  buildDatabaseCandidates,
  buildCodegenArchiveOutputs,
  createDatabaseImportedTable,
  createOnlineImportedTable,
} from "./codegen-table.types"

/**
 * 按需获取 online 域的公开面。
 * 必须通过 onlineFacade 访问，禁止直接 import online Service / Repository。
 */
async function requireOnlineFacade() {
  try {
    const mod = await import("@/modules/online/contract/online.facade")
    return mod.onlineFacade
  } catch {
    throw new Error("该功能依赖 online 域（低代码在线表单），当前工程未包含它")
  }
}

function unwrap<T>(result: { success: boolean; error?: string; data?: unknown }, message: string): T {
  if (!result.success) throw new Error(result.error ?? message)
  return result.data as T
}

async function publishedDefinitions(tenantId: string) {
  const items: OnlineDefinitionPage["items"] = []
  let page = 1
  while (true) {
    const facade = await requireOnlineFacade()
    const data = await unwrap<OnlineDefinitionPage>(
      await facade.pageDefinitions({ tenantId, page, pageSize: 100, status: "ACTIVE" }, { caller: "infra.codegen" }),
      "online pageDefinitions 调用失败",
    )
    items.push(...data.items.filter((item) => item.publishedReleaseId && item.currentRelease))
    if (items.length >= data.total || data.items.length < 100) return items
    page += 1
  }
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
    parentMenuId?: string | null
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
      const facade = await requireOnlineFacade()
      const runtime = await unwrap<PublishedRelease>(
        await facade.resolvePublishedRelease({ tenantId: input.tenantId, definitionCode: definition.code, releaseId }, { caller: "infra.codegen" }),
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
    const databaseCandidates = buildDatabaseCandidates(tables)
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
        const row = await createDatabaseImportedTable(candidate.tableName, tableInfo)
        imported.push({ tableName: row.tableName, id: row.id })
        continue
      }
      const existing = await CodegenTableRepository.findByOnlineRelease({ tenantId: input.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId })
      if (existing) { skipped.push(candidate.definitionCode); continue }
      const facade = await requireOnlineFacade()
      const payload = await unwrap<CodegenImportPayload>(
        await facade.resolveCodegenImport({ tenantId: input.tenantId, definitionCode: candidate.definitionCode, releaseId: candidate.releaseId }, { caller: "infra.codegen" }),
        "online resolveCodegenImport 调用失败",
      )
      const row = await createOnlineImportedTable(input.tenantId, payload)
      imported.push({ tableName: row.tableName, id: row.id })
    }
    domainLog.event("infra.codegen.import", { imported: imported.length, skipped: skipped.length, sources: input.candidates.map((candidate) => candidate.source) })
    return { imported, skipped }
  }

  static async generateCodegenArchive(input: { id: string; tenantId?: string }) {
    const table = await this.getCodegenTable(input)
    const outputs = buildCodegenArchiveOutputs(table)
    domainLog.event("infra.codegen.archive", { tableId: table.id, className: table.className, fileCount: outputs.length })
    return { className: table.className, files: outputs.map((output: any) => ({ path: output.path, content: output.content })) }
  }

  static async listCodegenCatalog(_input: Record<string, never> = {}) {
    const templates = CodegenEngineService.listTemplates()
    const tables = await SchemaReaderService.listTables()
    return { templates, tables: tables.map((table) => ({ name: table.name, comment: table.comment, columns: table.columns.length })) }
  }
}

export const codegenTableService = CodegenTableService
