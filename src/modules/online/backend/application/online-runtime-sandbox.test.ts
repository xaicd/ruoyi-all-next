import { describe, expect, it } from "vitest"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { assertOnlineTreeDelete, assertOnlineTreeWrite, compileOnlineRuntimeKind, isOnlineTreeRoot, ONLINE_SANDBOX_CHILDREN_KEY, splitOnlineSandboxPayload } from "./online-runtime-sandbox"
import type { OnlineRuntimeRelease } from "./online-runtime.contract"

const settings = { category: "general", identityStrategy: "PLATFORM_UUID" as const, list: { pagination: true, selection: false, layout: "TABLE" as const }, form: { layout: "GRID" as const, theme: "DEFAULT" as const, horizontalScroll: false } }

function runtime(modelType: OnlineRuntimeRelease["modelType"], interaction: OnlineRuntimeRelease["interaction"]): Pick<OnlineRuntimeRelease, "modelType" | "interaction"> {
  return { modelType, interaction }
}

describe("compileOnlineRuntimeKind", () => {
  it("routes Jeecg AUTO kinds from published model semantics", () => {
    expect(compileOnlineRuntimeKind(runtime("SINGLE", { version: 1, settings, fields: [], actions: [] }))).toBe("SINGLE_DEFAULT")
    expect(compileOnlineRuntimeKind(runtime("TREE", { version: 1, settings, fields: [], actions: [], tree: { parentField: "pid", childrenIndicator: false } }))).toBe("TREE_DEFAULT")
    expect(compileOnlineRuntimeKind(runtime("MASTER_DETAIL", { version: 1, settings, fields: [], actions: [], masterDetail: { children: [{ code: "items", targetDefinitionCode: "order_item", foreignKeyField: "order_id", display: "TABLE" }] } }))).toBe("MASTER_DETAIL_ERP")
    expect(compileOnlineRuntimeKind(runtime("MASTER_DETAIL", { version: 1, settings, fields: [], actions: [], masterDetail: { layout: "INNER", children: [{ code: "items", targetDefinitionCode: "order_item", foreignKeyField: "order_id", display: "TABLE" }] } }))).toBe("MASTER_DETAIL_INNER")
    expect(compileOnlineRuntimeKind(runtime("MASTER_DETAIL", { version: 1, settings, fields: [], actions: [], masterDetail: { children: [{ code: "items", targetDefinitionCode: "order_item", foreignKeyField: "order_id", display: "TABS" }] } }))).toBe("MASTER_DETAIL_TAB")
  })
})

describe("online sandbox tree", () => {
  it("treats empty parent as root and rejects cycles or delete-with-children", () => {
    expect(isOnlineTreeRoot("", undefined)).toBe(true)
    expect(isOnlineTreeRoot("root", "root")).toBe(true)
    assertOnlineTreeWrite({ recordId: "child", parentValue: "root", nodes: [{ id: "root", parentValue: null }, { id: "child", parentValue: "root" }] })
    expect(() => assertOnlineTreeWrite({ recordId: "a", parentValue: "a", nodes: [{ id: "a", parentValue: "a" }] })).toThrow(ApiError)
    expect(() => assertOnlineTreeWrite({ recordId: "a", parentValue: "b", nodes: [{ id: "a", parentValue: "b" }, { id: "b", parentValue: "a" }] })).toThrow(/环/)
    expect(() => assertOnlineTreeDelete({ recordId: "root", nodes: [{ id: "root", parentValue: null }, { id: "child", parentValue: "root" }] })).toThrow(/子节点/)
  })
})

describe("splitOnlineSandboxPayload", () => {
  it("keeps master fields and bounded child rows", () => {
    const split = splitOnlineSandboxPayload({ name: "order", [ONLINE_SANDBOX_CHILDREN_KEY]: { items: [{ sku: "A" }] } })
    expect(split.fields).toEqual({ name: "order" })
    expect(split.children).toEqual({ items: [{ sku: "A" }] })
    expect(splitOnlineSandboxPayload({ name: "order" }).children).toBeUndefined()
  })
})
