"use client"

import { useState, useEffect, useCallback } from "react"

// === Types ===
type CodegenTable = { id: string; tableName: string; tableComment: string; moduleName: string; className: string; template: string; scene: string; createdAt: string; updatedAt: string }
type DbTable = { name: string; comment?: string; columns: any[] }
type PageData = { items: CodegenTable[]; total: number; page: number; pageSize: number }
type PreviewFile = { path: string; type: string; content: string }

const API = "/api/v1/admin/infra/codegen"

export default function InfraCodegenPage() {
  const [tab, setTab] = useState<"list" | "import">("list")
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)

  // 导入相关
  const [dbTables, setDbTables] = useState<DbTable[]>([])
  const [sourceMode, setSourceMode] = useState<{ mode: string; description: string }>({ mode: "unknown", description: "" })
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [importing, setImporting] = useState(false)

  // 预览相关
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[] | null>(null)
  const [previewActive, setPreviewActive] = useState(0)
  const [previewTableName, setPreviewTableName] = useState("")

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword])

  const loadDbTables = async () => {
    const res = await fetch(`${API}/tables`).then((r) => r.json())
    if (res.success) {
      setDbTables(res.data.tables)
      setSourceMode(res.data.sourceMode)
    }
  }

  useEffect(() => { loadList() }, [loadList])

  // === 导入 ===
  const handleImport = async () => {
    if (selectedTables.length === 0) { alert("请选择要导入的表"); return }
    setImporting(true)
    try {
      const res = await fetch(`${API}/import`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tableNames: selectedTables }) }).then((r) => r.json())
      if (res.success) {
        alert(`导入成功: ${res.data.imported.length} 张表${res.data.skipped.length ? `，跳过 ${res.data.skipped.length} 张` : ""}`)
        setSelectedTables([])
        setTab("list")
        loadList()
      } else { alert(res.error) }
    } finally { setImporting(false) }
  }

  // === 预览 ===
  const handlePreview = async (table: CodegenTable) => {
    const res = await fetch(`${API}/preview`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleName: table.moduleName, className: table.className, businessName: table.tableComment, template: table.template, scene: table.scene, tableName: table.tableName }) }).then((r) => r.json())
    if (res.success) {
      setPreviewFiles(res.data)
      setPreviewActive(0)
      setPreviewTableName(table.className)
    } else { alert(res.error) }
  }

  // === 下载 ===
  const handleDownload = async (table: CodegenTable) => {
    const res = await fetch(`${API}/${table.id}/download`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `codegen-${table.className}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } else { alert("下载失败") }
  }

  // === 删除 ===
  const handleDelete = async (table: CodegenTable) => {
    if (!confirm(`确认删除「${table.tableName}」的生成配置？`)) return
    const res = await fetch(`${API}/${table.id}`, { method: "DELETE" }).then((r) => r.json())
    if (res.success) loadList(); else alert(res.error)
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">代码生成</h1>
          <p className="mt-0.5 text-sm text-slate-500">导入数据库表 → 配置字段 → 生成完整模块代码</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setTab("list"); loadList() }} className={`h-9 rounded-md px-4 text-sm font-medium transition ${tab === "list" ? "bg-blue-600 text-white" : "border text-slate-600 hover:bg-slate-50"}`}>已导入表</button>
          <button onClick={() => { setTab("import"); loadDbTables() }} className={`h-9 rounded-md px-4 text-sm font-medium transition ${tab === "import" ? "bg-blue-600 text-white" : "border text-slate-600 hover:bg-slate-50"}`}>导入表</button>
        </div>
      </div>

      {/* Tab: 已导入表列表 */}
      {tab === "list" && (
        <>
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-3">
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadList()} placeholder="表名 / 描述 / 类名" className="h-9 w-56 rounded-md border px-3 text-sm" />
              <button onClick={() => { setPage(1); loadList() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
              <span className="ml-auto text-xs text-slate-400">共 {data.total} 张表</span>
            </div>
          </div>

          {data.items.length === 0 ? (
            <div className="rounded-lg border bg-white p-12 text-center">
              <p className="text-slate-400">暂无已导入的表</p>
              <p className="mt-2 text-xs text-slate-400">点击右上角「导入表」从数据库/Schema 中导入</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-white">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
                  <th className="px-4 py-3">表名</th><th className="px-4 py-3">描述</th><th className="px-4 py-3">模块</th><th className="px-4 py-3">类名</th><th className="px-4 py-3">模板</th><th className="px-4 py-3">更新时间</th><th className="px-4 py-3 text-right">操作</th>
                </tr></thead>
                <tbody>
                  {data.items.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{t.tableName}</code></td>
                      <td className="px-4 py-3">{t.tableComment}</td>
                      <td className="px-4 py-3"><span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{t.moduleName}</span></td>
                      <td className="px-4 py-3 font-medium">{t.className}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{t.template}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{new Date(t.updatedAt).toLocaleDateString("zh-CN")}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handlePreview(t)} className="text-blue-600 hover:text-blue-800">预览</button>
                        <button onClick={() => handleDownload(t)} className="text-green-600 hover:text-green-800">生成</button>
                        <button onClick={() => handleDelete(t)} className="text-red-600 hover:text-red-800">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}
            </div>
          )}
        </>
      )}

      {/* Tab: 导入表 */}
      {tab === "import" && (
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">选择要导入的表</p>
              <p className="mt-0.5 text-xs text-slate-400">数据源: {sourceMode.description}</p>
            </div>
            <button onClick={handleImport} disabled={importing || selectedTables.length === 0} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {importing ? "导入中..." : `导入 (${selectedTables.length})`}
            </button>
          </div>

          {dbTables.length === 0 ? (
            <p className="py-8 text-center text-slate-400">未找到可导入的表</p>
          ) : (
            <div className="max-h-96 overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead><tr className="sticky top-0 border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
                  <th className="px-4 py-2 w-10"><input type="checkbox" checked={selectedTables.length === dbTables.length} onChange={(e) => setSelectedTables(e.target.checked ? dbTables.map((t) => t.name) : [])} /></th>
                  <th className="px-4 py-2">表名</th><th className="px-4 py-2">描述</th><th className="px-4 py-2">字段数</th>
                </tr></thead>
                <tbody>
                  {dbTables.map((t) => (
                    <tr key={t.name} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2"><input type="checkbox" checked={selectedTables.includes(t.name)} onChange={(e) => setSelectedTables(e.target.checked ? [...selectedTables, t.name] : selectedTables.filter((n) => n !== t.name))} /></td>
                      <td className="px-4 py-2"><code className="text-xs">{t.name}</code></td>
                      <td className="px-4 py-2 text-slate-500">{t.comment || "-"}</td>
                      <td className="px-4 py-2 text-xs text-slate-400">{t.columns.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 预览弹窗 */}
      {previewFiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex h-full max-h-[85vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
            {/* 头部 */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-base font-semibold">代码预览 - {previewTableName}</h2>
              <button onClick={() => setPreviewFiles(null)} className="rounded-lg border px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50">关闭</button>
            </div>
            {/* 内容 */}
            <div className="flex flex-1 overflow-hidden">
              {/* 文件列表 */}
              <div className="w-56 overflow-y-auto border-r bg-slate-50 p-3">
                {previewFiles.map((file, i) => (
                  <button key={i} onClick={() => setPreviewActive(i)} className={`mb-1 block w-full truncate rounded px-2.5 py-2 text-left text-xs transition ${i === previewActive ? "bg-blue-50 font-medium text-blue-700" : "text-slate-600 hover:bg-white"}`}>
                    <span className={`mr-1.5 inline-block rounded px-1 py-0.5 text-[10px] ${file.type === "service" ? "bg-green-100 text-green-700" : file.type === "route" ? "bg-purple-100 text-purple-700" : file.type === "page" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{file.type}</span>
                    <br /><span className="text-[11px]">{file.path.split("/").pop()}</span>
                  </button>
                ))}
              </div>
              {/* 代码内容 */}
              <div className="flex-1 overflow-hidden p-4">
                <div className="mb-2 flex items-center justify-between">
                  <code className="text-xs text-slate-500">{previewFiles[previewActive]?.path}</code>
                  <button onClick={() => navigator.clipboard.writeText(previewFiles[previewActive]?.content ?? "")} className="rounded border px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-50">复制</button>
                </div>
                <pre className="h-full max-h-[60vh] overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100"><code>{previewFiles[previewActive]?.content}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
