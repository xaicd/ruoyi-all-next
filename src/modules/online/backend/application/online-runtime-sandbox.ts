import { ApiError } from "@/modules/shared/backend/http/api-error"
import type { OnlineRuntimeKind, OnlineRuntimeRelease } from "./online-runtime.contract"

export const ONLINE_SANDBOX_CHILDREN_KEY = "__onlineChildren"

export function compileOnlineRuntimeKind(runtime: Pick<OnlineRuntimeRelease, "modelType" | "interaction">): OnlineRuntimeKind {
  if (runtime.modelType === "TREE") return "TREE_DEFAULT"
  if (runtime.modelType === "MASTER_DETAIL") {
    const layout = runtime.interaction.masterDetail?.layout
    if (layout === "INNER") return "MASTER_DETAIL_INNER"
    if (layout === "TAB" || runtime.interaction.masterDetail?.children.some((child) => child.display === "TABS")) return "MASTER_DETAIL_TAB"
    return "MASTER_DETAIL_ERP"
  }
  return "SINGLE_DEFAULT"
}

export function isOnlineTreeRoot(value: unknown, rootValue?: string | number | null): boolean {
  if (rootValue !== undefined) return value === rootValue || (rootValue === null && (value === null || value === undefined || value === ""))
  return value === null || value === undefined || value === "" || value === 0 || value === "0"
}

export function splitOnlineSandboxPayload(data: Record<string, unknown>): { fields: Record<string, unknown>; children?: Record<string, Array<Record<string, unknown>>> } {
  if (!(ONLINE_SANDBOX_CHILDREN_KEY in data)) {
    const { [ONLINE_SANDBOX_CHILDREN_KEY]: _ignored, ...fields } = data
    return { fields }
  }
  const raw = data[ONLINE_SANDBOX_CHILDREN_KEY]
  const { [ONLINE_SANDBOX_CHILDREN_KEY]: _ignored, ...fields } = data
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new ApiError("VALIDATION_ERROR", "主子表子记录必须是对象")
  const children: Record<string, Array<Record<string, unknown>>> = {}
  for (const [code, rows] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(rows)) throw new ApiError("VALIDATION_ERROR", `主子表 ${code} 必须是数组`)
    if (rows.length > 32) throw new ApiError("VALIDATION_ERROR", `主子表 ${code} 单次最多 32 行`)
    children[code] = rows.map((row, index) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) throw new ApiError("VALIDATION_ERROR", `主子表 ${code} 第 ${index + 1} 行必须是对象`)
      return row as Record<string, unknown>
    })
  }
  return { fields, children }
}

export function assertOnlineTreeWrite(input: { recordId: string; parentValue: unknown; rootValue?: string | number | null; nodes: Array<{ id: string; parentValue: unknown }> }): void {
  if (isOnlineTreeRoot(input.parentValue, input.rootValue)) return
  const parentId = String(input.parentValue)
  if (parentId === input.recordId) throw new ApiError("VALIDATION_ERROR", "树节点不能将自身设为父级")
  const byId = new Map(input.nodes.map((node) => [node.id, node]))
  if (!byId.has(parentId)) throw new ApiError("VALIDATION_ERROR", "父节点不存在")
  const seen = new Set<string>([input.recordId])
  let cursor: string | undefined = parentId
  while (cursor) {
    if (seen.has(cursor)) throw new ApiError("VALIDATION_ERROR", "树结构不能形成环")
    seen.add(cursor)
    const node = byId.get(cursor)
    if (!node || isOnlineTreeRoot(node.parentValue, input.rootValue)) break
    cursor = String(node.parentValue)
  }
}

export function assertOnlineTreeDelete(input: { recordId: string; nodes: Array<{ id: string; parentValue: unknown }> }): void {
  if (input.nodes.some((node) => node.id !== input.recordId && String(node.parentValue) === input.recordId)) {
    throw new ApiError("CONFLICT", "存在子节点时不能删除")
  }
}
