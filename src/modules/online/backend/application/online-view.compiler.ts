import { createHash } from "node:crypto"
import { ApiError } from "@/modules/shared/backend/http/api-error"

export const ONLINE_VIEW_CODES = ["list", "form", "detail", "dashboard"] as const
export type OnlineViewCode = (typeof ONLINE_VIEW_CODES)[number]
export type OnlineViewDetail = { code: OnlineViewCode; kind: "PUCK"; puckData: Record<string, unknown>; componentConfig: { configVersion: 1 }; version: 1 }

type Scope = { definitionCode: string; fieldCodes: ReadonlySet<string>; actionCodes: ReadonlySet<string> }
const MAX_BYTES = 96_000
const MAX_NODES = 80
const MAX_DEPTH = 8
const componentProps: Record<string, ReadonlySet<string>> = {
  OnlinePageHeader: new Set(["id", "definitionCode", "viewCode", "title", "description"]),
  OnlineSearchForm: new Set(["id", "definitionCode", "viewCode", "fieldScope", "layout"]),
  OnlineDataTable: new Set(["id", "definitionCode", "viewCode", "fieldScope", "actionScope"]),
  OnlineForm: new Set(["id", "definitionCode", "viewCode", "fieldScope", "layout"]),
  OnlineDetail: new Set(["id", "definitionCode", "viewCode", "fieldScope"]),
  OnlineActionBar: new Set(["id", "definitionCode", "viewCode", "actionScope", "layout"]),
}
const prototypeKeys = new Set(["__proto__", "prototype", "constructor"])
const layouts = new Set(["default", "drawer", "dialog", "inline"])

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new Error(`${label} 必须是普通对象`)
  return value as Record<string, unknown>
}
function text(value: unknown, label: string, max = 160): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`${label} 必须是长度不超过 ${max} 的非空文本`)
  return value.trim()
}
function scopeList(value: unknown, known: ReadonlySet<string>, label: string): string[] {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.length > 128 || value.some((item) => typeof item !== "string" || !known.has(item))) throw new Error(`${label} 只能引用当前 Draft 已声明的项目`)
  if (new Set(value).size !== value.length) throw new Error(`${label} 不可重复`)
  return [...value].sort()
}

function normalizeNode(value: unknown, scope: Scope, counter: { nodes: number }, depth: number): Record<string, unknown> {
  if (depth > MAX_DEPTH) throw new Error(`Puck 页面层级不能超过 ${MAX_DEPTH}`)
  const node = record(value, "Puck 节点")
  for (const key of Object.keys(node)) if (prototypeKeys.has(key)) throw new Error("Puck 页面包含禁止的原型键")
  if (new Set(Object.keys(node)).size !== Object.keys(node).length || Object.keys(node).some((key) => !["type", "props"].includes(key))) throw new Error("Puck 节点包含未知属性")
  const type = text(node.type, "Puck 组件类型", 64)
  const allowed = componentProps[type]
  if (!allowed) throw new Error(`Puck 组件 ${type} 未注册`)
  const props = record(node.props, `${type}.props`)
  for (const key of Object.keys(props)) if (prototypeKeys.has(key) || !allowed.has(key)) throw new Error(`${type} 不允许属性 ${key}`)
  if (typeof props.id !== "string" || !props.id || props.id.length > 100) throw new Error(`${type}.id 无效`)
  const viewCode = text(props.viewCode, `${type}.viewCode`, 30)
  if (!ONLINE_VIEW_CODES.includes(viewCode as OnlineViewCode)) throw new Error(`${type}.viewCode 无效`)
  const definitionCode = props.definitionCode === undefined ? scope.definitionCode : text(props.definitionCode, `${type}.definitionCode`, 64)
  if (definitionCode !== scope.definitionCode) throw new Error(`${type} 只能绑定当前 Definition`)
  const normalized: Record<string, unknown> = { id: props.id, definitionCode: scope.definitionCode, viewCode }
  if (props.title !== undefined) normalized.title = text(props.title, `${type}.title`)
  if (props.description !== undefined) normalized.description = typeof props.description === "string" && props.description.length <= 300 ? props.description.trim() : (() => { throw new Error(`${type}.description 无效`) })()
  if (props.fieldScope !== undefined) normalized.fieldScope = scopeList(props.fieldScope, scope.fieldCodes, `${type}.fieldScope`)
  if (props.actionScope !== undefined) normalized.actionScope = scopeList(props.actionScope, scope.actionCodes, `${type}.actionScope`)
  if (props.layout !== undefined) { const layout = text(props.layout, `${type}.layout`, 20); if (!layouts.has(layout)) throw new Error(`${type}.layout 无效`); normalized.layout = layout }
  counter.nodes += 1
  if (counter.nodes > MAX_NODES) throw new Error(`Puck 页面节点不能超过 ${MAX_NODES}`)
  return { type, props: normalized }
}

export function compileOnlineViews(value: unknown, scope: Scope): OnlineViewDetail[] {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.length > ONLINE_VIEW_CODES.length) throw new Error("views 必须是不超过四项的数组")
  const codes = new Set<string>()
  return value.map((raw) => {
    const input = record(raw, "Online View")
    if (Object.keys(input).some((key) => !["code", "kind", "puckData", "version"].includes(key))) throw new Error("Online View 包含未知属性")
    const code = text(input.code, "view.code", 30) as OnlineViewCode
    if (!ONLINE_VIEW_CODES.includes(code) || codes.has(code)) throw new Error("view.code 必须是唯一的受支持视图")
    codes.add(code)
    if (input.kind !== "PUCK" || input.version !== 1) throw new Error("仅支持 Puck v1 受控视图")
    const puckData = record(input.puckData, "puckData")
    const serialized = JSON.stringify(puckData)
    if (Buffer.byteLength(serialized, "utf8") > MAX_BYTES) throw new Error(`Puck 页面不能超过 ${MAX_BYTES} bytes`)
    if (Object.keys(puckData).some((key) => !["content", "root"].includes(key))) throw new Error("puckData 包含未知根属性")
    if (!Array.isArray(puckData.content)) throw new Error("puckData.content 必须是数组")
    if (puckData.root !== undefined) record(puckData.root, "puckData.root")
    const counter = { nodes: 0 }
    return { code, kind: "PUCK" as const, puckData: { content: puckData.content.map((node) => normalizeNode(node, scope, counter, 1)), root: {} }, componentConfig: { configVersion: 1 as const }, version: 1 as const }
  }).sort((left, right) => left.code.localeCompare(right.code))
}

export function fingerprintOnlineViews(views: OnlineViewDetail[]): string {
  return createHash("sha256").update(JSON.stringify(views)).digest("hex")
}

export function failViewValidation(error: unknown): never {
  throw new ApiError("VALIDATION_ERROR", error instanceof Error ? `Online 视图无效：${error.message}` : "Online 视图无效")
}
