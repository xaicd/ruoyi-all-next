"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

type ColumnConfig = {
  name: string
  type: string
  tsType: string
  comment: string | null
  nullable: boolean
  isPrimary: boolean
  maxLength: number | null
  uiComponent: string
  listShow: boolean
  formShow: boolean
  queryShow: boolean
  queryType: string
  dictType: string | null
  formValidation: string | null
}

type TableConfig = {
  id: string
  tableName: string
  tableComment: string
  moduleName: string
  businessName: string
  className: string
  template: string
  scene: string
  author: string
  columns: ColumnConfig[]
}

const API = "/api/v1/admin/infra/codegen"

const UI_COMPONENTS = [
  { value: "INPUT", label: "文本框" },
  { value: "TEXTAREA", label: "多行文本" },
  { value: "NUMBER", label: "数字" },
  { value: "SELECT", label: "下拉选择" },
  { value: "RADIO", label: "单选框" },
  { value: "CHECKBOX", label: "多选框" },
  { value: "SWITCH", label: "开关" },
  { value: "DATE", label: "日期" },
  { value: "DATETIME", label: "日期时间" },
  { value: "UPLOAD", label: "文件上传" },
  { value: "RICH_TEXT", label: "富文本" },
  { value: "TREE_SELECT", label: "树选择" },
  { value: "HIDDEN", label: "隐藏" },
]

const QUERY_TYPES = [
  { value: "=", label: "精确匹配" },
  { value: "LIKE", label: "模糊搜索" },
  { value: "BETWEEN", label: "范围" },
  { value: ">", label: "大于" },
  { value: "<", label: "小于" },
  { value: "IN", label: "包含" },
]

const TEMPLATES = [
  { value: "CRUD", label: "标准 CRUD" },
  { value: "TREE", label: "树形结构" },
  { value: "MASTER_CHILD", label: "主子表" },
  { value: "WORKFLOW", label: "工作流" },
  { value: "SINGLETON", label: "单例配置" },
]

export default function CodegenEditPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [table, setTable] = useState<TableConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"basic" | "columns" | "preview">("basic")

  useEffect(() => {
    if (!id) return
    fetch(`${API}/${id}`).then((r) => r.json()).then((res) => {
      if (res.success) setTable(res.data)
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    if (!table || !id) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(table) }).then((r) => r.json())
      if (res.success) alert("保存成功")
      else alert(res.error)
    } finally { setSaving(false) }
  }

  const updateColumn = (index: number, key: string, value: any) => {
    if (!table) return
    const cols = [...table.columns]
    cols[index] = { ...cols[index], [key]: value }
    setTable({ ...table, columns: cols })
  }

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-400">加载中...</div>
  if (!table) return <div className="flex h-64 items-center justify-center text-slate-400">表配置不存在</div>

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">编辑表配置</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{table.tableName}</code>
            <span className="ml-2">{table.tableComment}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.history.back()} className="h-9 rounded-md border px-4 text-sm">返回</button>
          <button onClick={handleSave} disabled={saving} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "保存中..." : "保存"}</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-lg border bg-white">
        <div className="flex border-b">
          {[{ key: "basic", label: "基本配置" }, { key: "columns", label: "字段配置" }, { key: "preview", label: "生成预览" }].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)} className={`px-6 py-3 text-sm font-medium transition ${activeTab === t.key ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>{t.label}</button>
          ))}
        </div>

        <div className="p-5">
          {/* 基本配置 */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-4 max-w-3xl">
              <div><label className="mb-1 block text-xs text-slate-500">模块名</label><input value={table.moduleName} onChange={(e) => setTable({ ...table, moduleName: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-500">业务名称（中文）</label><input value={table.businessName} onChange={(e) => setTable({ ...table, businessName: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-500">类名</label><input value={table.className} onChange={(e) => setTable({ ...table, className: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-500">作者</label><input value={table.author} onChange={(e) => setTable({ ...table, author: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-500">模板类型</label><select value={table.template} onChange={(e) => setTable({ ...table, template: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm">{TEMPLATES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              <div><label className="mb-1 block text-xs text-slate-500">生成场景</label><select value={table.scene} onChange={(e) => setTable({ ...table, scene: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ADMIN">管理后台</option><option value="APP">用户端</option></select></div>
              <div className="col-span-2"><label className="mb-1 block text-xs text-slate-500">表描述</label><input value={table.tableComment} onChange={(e) => setTable({ ...table, tableComment: e.target.value })} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
            </div>
          )}

          {/* 字段配置 */}
          {activeTab === "columns" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-slate-50 text-left font-medium text-slate-500">
                  <th className="px-2 py-2">字段</th>
                  <th className="px-2 py-2">类型</th>
                  <th className="px-2 py-2">描述</th>
                  <th className="px-2 py-2">UI 组件</th>
                  <th className="px-2 py-2">字典</th>
                  <th className="px-2 py-2 text-center">列表</th>
                  <th className="px-2 py-2 text-center">表单</th>
                  <th className="px-2 py-2 text-center">查询</th>
                  <th className="px-2 py-2">查询方式</th>
                </tr></thead>
                <tbody>
                  {table.columns.map((col, i) => (
                    <tr key={col.name} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-2 py-1.5"><code className="text-[11px]">{col.name}</code>{col.isPrimary && <span className="ml-1 text-amber-500">PK</span>}</td>
                      <td className="px-2 py-1.5 text-slate-500">{col.type}{col.maxLength ? `(${col.maxLength})` : ""}</td>
                      <td className="px-2 py-1.5"><input value={col.comment ?? ""} onChange={(e) => updateColumn(i, "comment", e.target.value)} className="h-7 w-24 rounded border px-1.5 text-[11px]" /></td>
                      <td className="px-2 py-1.5"><select value={col.uiComponent} onChange={(e) => updateColumn(i, "uiComponent", e.target.value)} className="h-7 rounded border px-1 text-[11px]">{UI_COMPONENTS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></td>
                      <td className="px-2 py-1.5"><input value={col.dictType ?? ""} onChange={(e) => updateColumn(i, "dictType", e.target.value || null)} className="h-7 w-20 rounded border px-1.5 text-[11px]" placeholder="字典类型" /></td>
                      <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={col.listShow} onChange={(e) => updateColumn(i, "listShow", e.target.checked)} /></td>
                      <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={col.formShow} onChange={(e) => updateColumn(i, "formShow", e.target.checked)} /></td>
                      <td className="px-2 py-1.5 text-center"><input type="checkbox" checked={col.queryShow} onChange={(e) => updateColumn(i, "queryShow", e.target.checked)} /></td>
                      <td className="px-2 py-1.5"><select value={col.queryType} onChange={(e) => updateColumn(i, "queryType", e.target.value)} className="h-7 rounded border px-1 text-[11px]" disabled={!col.queryShow}>{QUERY_TYPES.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}</select></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 生成预览 */}
          {activeTab === "preview" && <PreviewPanel table={table} />}
        </div>
      </div>
    </div>
  )
}

function PreviewPanel({ table }: { table: TableConfig }) {
  const [files, setFiles] = useState<{ path: string; type: string; content: string }[] | null>(null)
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/preview`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleName: table.moduleName, className: table.className, businessName: table.businessName, template: table.template, scene: table.scene, tableName: table.tableName, table: { name: table.tableName, comment: table.tableComment, schema: "public", type: "TABLE", columns: table.columns, primaryKey: table.columns.filter((c) => c.isPrimary).map((c) => c.name), indexes: [] } }) }).then((r) => r.json())
      if (res.success) { setFiles(res.data); setActive(0) }
      else alert(res.error)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <button onClick={handlePreview} disabled={loading} className="mb-4 h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "生成中..." : "生成预览"}</button>
      {files && (
        <div className="flex rounded-lg border">
          <div className="w-52 overflow-y-auto border-r bg-slate-50 p-2">
            {files.map((f, i) => (
              <button key={i} onClick={() => setActive(i)} className={`mb-0.5 block w-full truncate rounded px-2 py-1.5 text-left text-[11px] transition ${i === active ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-white"}`}>{f.path.split("/").pop()}</button>
            ))}
          </div>
          <div className="flex-1 p-3">
            <code className="mb-2 block text-[10px] text-slate-400">{files[active]?.path}</code>
            <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100"><code>{files[active]?.content}</code></pre>
          </div>
        </div>
      )}
    </div>
  )
}
