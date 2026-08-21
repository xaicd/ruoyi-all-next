import { NextResponse } from "next/server"
import { z } from "zod"
import { SchemaReaderService } from "@/modules/infra/backend/services/schema-reader.service"
import { onlineFacade } from "@/modules/online/contract/online.facade"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  source: z.enum(["ALL", "ONLINE", "DATABASE"]).default("ALL"),
})

type Candidate = {
  id: string
  name: string
  comment?: string
  columns: unknown[]
  fieldCount: number
  source: "ONLINE" | "DATABASE"
  physical: boolean
  storageKind: "GENERIC_RECORD" | "MANAGED_TABLE" | null
  online: { definitionCode: string; definitionName: string; releaseId: string; releaseNo: number; schemaRevision: number } | null
}

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

async function unwrap<T>(result: { success: boolean; error?: string; data?: unknown }, message: string): Promise<T> {
  if (!result.success) throw new ApiError("INTERNAL_ERROR", result.error ?? message)
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

/** Lists physical database tables and tenant-scoped Published Releases as separate Online virtual design-table candidates. */
export const GET = withAdminRoute(async (request, auth) => {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online 设计表必须在租户上下文中选择")
  const input = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams))
  const [tables, definitions] = await Promise.all([SchemaReaderService.listTables(), publishedDefinitions(auth.tenantId)])
  const physicalNames = new Set(tables.map((table) => table.name))
  const onlineCandidates: Candidate[] = await Promise.all(definitions.map(async (definition) => {
    const releaseId = definition.publishedReleaseId!
    const runtime = await unwrap<PublishedRelease>(
      await onlineFacade.resolvePublishedRelease({ tenantId: auth.tenantId!, definitionCode: definition.code, releaseId }, { caller: "infra.codegen" }),
      "online resolvePublishedRelease 调用失败",
    )
    return {
      id: `ONLINE:${releaseId}`,
      name: definition.code,
      comment: definition.name,
      columns: [],
      fieldCount: runtime.model.fields.length,
      source: "ONLINE" as const,
      physical: physicalNames.has(definition.code),
      storageKind: runtime.model.storage.kind,
      online: { definitionCode: definition.code, definitionName: definition.name, releaseId, releaseNo: definition.currentRelease!.releaseNo, schemaRevision: definition.currentRelease!.schemaRevision },
    }
  }))
  const databaseCandidates: Candidate[] = tables.map((table) => ({
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
  return NextResponse.json({ success: true, data: { items: candidates.slice(start, start + input.pageSize), total: candidates.length, page: input.page, pageSize: input.pageSize, sourceMode: { ...SchemaReaderService.getSourceMode(), description: `${SchemaReaderService.getSourceMode().description}；已发布 Online 定义以虚拟设计表提供` } } })
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })
