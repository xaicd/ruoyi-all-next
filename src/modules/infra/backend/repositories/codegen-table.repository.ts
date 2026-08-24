/**
 * CodegenTable Repository - 已导入的代码生成表配置
 */

import type { PageResult } from "@/modules/shared/backend/lib/database"
import type { CodegenAdvancedConfig, CodegenQueryOperator } from "../services/codegen-engine.service"
import type { ColumnInfo, UiComponentType } from "../services/schema-reader.service"

export type CodegenTableSource = "DATABASE" | "ONLINE"

export type CodegenTableRow = {
  id: string
  tableName: string
  tableComment: string
  moduleName: string
  businessName: string
  className: string
  template: "CRUD" | "TREE" | "MASTER_CHILD" | "MASTER_DETAIL" | "WORKFLOW" | "SINGLETON"
  scene: "ADMIN" | "APP"
  author: string
  parentMenuId: string | null
  /** Resource permission prefix, e.g. infra:codegen-table. */
  permissionPrefix: string | null
  /** DATABASE entries are legacy/global; ONLINE entries are always tenant-scoped. */
  source: CodegenTableSource
  tenantId: string | null
  onlineDefinitionCode: string | null
  onlineReleaseId: string | null
  onlineSchemaRevision: number | null
  onlineStorageKind: "GENERIC_RECORD" | "MANAGED_TABLE" | null
  /** Immutable Online Release metadata retained for safe Tree/Master-Detail generation. */
  onlineAdvanced: CodegenAdvancedConfig | null
  columns: CodegenColumnConfig[]
  createdAt: string
  updatedAt: string
}

export type CodegenColumnConfig = ColumnInfo & {
  /** 是否在列表中显示 */
  listShow: boolean
  /** 是否在表单中显示 */
  formShow: boolean
  /** 是否在查询条件中 */
  queryShow: boolean
  /** 查询方式 */
  queryType: CodegenQueryOperator
  /** 关联字典类型 */
  dictType: string | null
  /** 表单校验规则描述 */
  formValidation: string | null
}

export type CreateCodegenTableData = {
  tableName: string
  tableComment: string
  moduleName: string
  businessName: string
  className: string
  template?: string
  scene?: string
  author?: string
  parentMenuId?: string | null
  permissionPrefix?: string | null
  source?: CodegenTableSource
  tenantId?: string | null
  onlineDefinitionCode?: string | null
  onlineReleaseId?: string | null
  onlineSchemaRevision?: number | null
  onlineStorageKind?: "GENERIC_RECORD" | "MANAGED_TABLE" | null
  onlineAdvanced?: CodegenAdvancedConfig | null
  columns: CodegenColumnConfig[]
}

export type UpdateCodegenTableData = Partial<Omit<CreateCodegenTableData, "tableName">> & {
  columns?: CodegenColumnConfig[]
}

// === 内存存储 ===
const MEMORY_STORE: CodegenTableRow[] = []
let memoryIdSeq = 100

export const CodegenTableRepository = {
  async findList(params: { page: number; pageSize: number; keyword?: string; tenantId?: string | null }): Promise<PageResult<CodegenTableRow>> {
    let filtered = MEMORY_STORE.filter((table) => table.source === "DATABASE" || Boolean(params.tenantId) && table.tenantId === params.tenantId)
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter((t) => t.tableName.toLowerCase().includes(kw) || t.tableComment.toLowerCase().includes(kw) || t.className.toLowerCase().includes(kw))
    }
    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string, tenantId?: string | null): Promise<CodegenTableRow | null> {
    return MEMORY_STORE.find((table) => table.id === id && (table.source === "DATABASE" || Boolean(tenantId) && table.tenantId === tenantId)) ?? null
  },

  async findByTableName(tableName: string, tenantId?: string | null): Promise<CodegenTableRow | null> {
    return MEMORY_STORE.find((table) => table.tableName === tableName && (table.source === "DATABASE" || Boolean(tenantId) && table.tenantId === tenantId)) ?? null
  },

  async findByOnlineRelease(input: { tenantId: string; definitionCode: string; releaseId: string }): Promise<CodegenTableRow | null> {
    return MEMORY_STORE.find((table) => table.source === "ONLINE" && table.tenantId === input.tenantId && table.onlineDefinitionCode === input.definitionCode && table.onlineReleaseId === input.releaseId) ?? null
  },

  async create(data: CreateCodegenTableData): Promise<CodegenTableRow> {
    const now = new Date().toISOString()
    const row: CodegenTableRow = {
      id: String(++memoryIdSeq),
      tableName: data.tableName,
      tableComment: data.tableComment,
      moduleName: data.moduleName,
      businessName: data.businessName,
      className: data.className,
      template: (data.template as any) ?? "CRUD",
      scene: (data.scene as any) ?? "ADMIN",
      author: data.author ?? "admin",
      parentMenuId: null,
      permissionPrefix: data.permissionPrefix ?? null,
      source: data.source ?? "DATABASE",
      tenantId: data.tenantId ?? null,
      onlineDefinitionCode: data.onlineDefinitionCode ?? null,
      onlineReleaseId: data.onlineReleaseId ?? null,
      onlineSchemaRevision: data.onlineSchemaRevision ?? null,
      onlineStorageKind: data.onlineStorageKind ?? null,
      onlineAdvanced: data.onlineAdvanced ?? null,
      columns: data.columns,
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateCodegenTableData): Promise<CodegenTableRow> {
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`表配置不存在: ${id}`)
    const table = MEMORY_STORE[idx]
    const updated: CodegenTableRow = {
      ...table,
      tableComment: data.tableComment ?? table.tableComment,
      moduleName: data.moduleName ?? table.moduleName,
      businessName: data.businessName ?? table.businessName,
      className: data.className ?? table.className,
      template: (data.template as any) ?? table.template,
      scene: (data.scene as any) ?? table.scene,
      author: data.author ?? table.author,
      parentMenuId: data.parentMenuId !== undefined ? data.parentMenuId : table.parentMenuId,
      permissionPrefix: data.permissionPrefix ?? table.permissionPrefix,
      columns: data.columns ?? table.columns,
      updatedAt: new Date().toISOString(),
    }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`表配置不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },

  async deleteByIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      const idx = MEMORY_STORE.findIndex((t) => t.id === id)
      if (idx !== -1) MEMORY_STORE.splice(idx, 1)
    }
  },
}

/** 从 SchemaReader 的 ColumnInfo 转为 CodegenColumnConfig */
export function toCodegenColumnConfig(col: ColumnInfo): CodegenColumnConfig {
  const hidden = col.uiComponent === "HIDDEN"
  return {
    ...col,
    listShow: !hidden && col.name !== "password",
    formShow: !hidden && !col.isPrimary,
    queryShow: !hidden && !col.isPrimary && ["status", "type", "name", "username", "phone"].some((k) => col.name.includes(k)),
    queryType: col.name.includes("name") || col.name.includes("title") ? "LIKE" : "=",
    dictType: col.enumValues?.length ? `${col.name}_dict` : null,
    formValidation: col.nullable ? null : "required",
  }
}
