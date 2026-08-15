import type { Config, Data } from "@puckeditor/core"

export const emptyOnlinePuckData: Data = { content: [], root: {} }
const viewOptions = ["list", "form", "detail", "dashboard"].map((value) => ({ label: value, value }))
const layoutOptions = ["default", "drawer", "dialog", "inline"].map((value) => ({ label: value, value }))
const scopeField = (label: string) => ({ type: "custom" as const, label, render: ({ value, onChange }: { value: unknown; onChange: (next: string) => void }) => <input className="h-8 w-full rounded border px-2 text-sm" value={Array.isArray(value) ? value.join(",") : String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder="field_a,field_b" /> })
const fieldScope = scopeField("字段范围（逗号分隔）")
const actionScope = scopeField("动作范围（逗号分隔）")
const bindingFields = { definitionCode: { type: "text" as const, label: "Definition code" }, viewCode: { type: "select" as const, label: "视图", options: viewOptions } }
const box = "rounded-lg border bg-white p-4"

export const onlinePuckConfig: Config = {
  components: {
    OnlinePageHeader: { label: "Online 页面标题", defaultProps: { definitionCode: "definition", viewCode: "list", title: "Online 页面", description: "" }, fields: { ...bindingFields, title: { type: "text", label: "标题" }, description: { type: "text", label: "描述" } }, render: ({ title, description }) => <div className={box}><h2 className="text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div> },
    OnlineSearchForm: { label: "查询条件", defaultProps: { definitionCode: "definition", viewCode: "list", fieldScope: "", layout: "inline" }, fields: { ...bindingFields, fieldScope, layout: { type: "select", label: "布局", options: layoutOptions } }, render: ({ fieldScope }) => <div className={box}><p className="text-sm font-medium">查询条件</p><p className="mt-2 text-xs text-slate-500">受控字段：{fieldScope || "全部可查询字段"}</p></div> },
    OnlineDataTable: { label: "数据表格", defaultProps: { definitionCode: "definition", viewCode: "list", fieldScope: "", actionScope: "" }, fields: { ...bindingFields, fieldScope, actionScope }, render: ({ fieldScope }) => <div className={box}><p className="text-sm font-medium">数据列表</p><div className="mt-3 rounded border border-dashed p-6 text-center text-xs text-slate-400">字段：{fieldScope || "按发布模型"}</div></div> },
    OnlineForm: { label: "Online 表单", defaultProps: { definitionCode: "definition", viewCode: "form", fieldScope: "", layout: "default" }, fields: { ...bindingFields, fieldScope, layout: { type: "select", label: "布局", options: layoutOptions } }, render: ({ fieldScope }) => <div className={box}><p className="text-sm font-medium">受控表单</p><p className="mt-2 text-xs text-slate-500">字段：{fieldScope || "按发布模型"}</p></div> },
    OnlineDetail: { label: "详情视图", defaultProps: { definitionCode: "definition", viewCode: "detail", fieldScope: "" }, fields: { ...bindingFields, fieldScope }, render: ({ fieldScope }) => <div className={box}><p className="text-sm font-medium">详情</p><p className="mt-2 text-xs text-slate-500">字段：{fieldScope || "按发布模型"}</p></div> },
    OnlineActionBar: { label: "操作栏", defaultProps: { definitionCode: "definition", viewCode: "list", actionScope: "", layout: "inline" }, fields: { ...bindingFields, actionScope, layout: { type: "select", label: "布局", options: layoutOptions } }, render: ({ actionScope }) => <div className="flex gap-2"><span className="rounded bg-slate-100 px-3 py-2 text-xs">受控动作：{actionScope || "无"}</span></div> },
  },
}
