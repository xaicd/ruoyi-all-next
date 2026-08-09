"use client"

import { useState, useEffect, useCallback } from "react"

type InfraFile = { id: string; configId: string; name: string | null; path: string; url: string; type: string | null; size: number; createdAt: string }
type PageData = { items: InfraFile[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/infra/files"

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileIcon(type: string | null): string {
  if (!type) return "📄"
  if (type.startsWith("image/")) return "🖼️"
  if (type.includes("pdf")) return "📕"
  if (type.includes("zip") || type.includes("rar")) return "📦"
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
  if (type.includes("word") || type.includes("document")) return "📝"
  return "📄"
}

export default function InfraFilesPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (file: InfraFile) => {
    if (!confirm(`确认删除文件「${file.name || file.path}」？`)) return
    const res = await fetch(`${API}/${file.id}`, { method: "DELETE" }).then((r) => r.json())
    if (res.success) loadData(); else alert(res.error)
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">文件管理</h1>
        <p className="mt-0.5 text-sm text-slate-500">管理系统上传的文件资源</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="文件名 / 路径" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">文件名</th><th className="px-4 py-3">类型</th><th className="px-4 py-3">大小</th><th className="px-4 py-3">上传时间</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((file) => (
              <tr key={file.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{getFileIcon(file.type)}</span>
                    <span className="font-medium">{file.name || file.path.split("/").pop()}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{file.type || "-"}</td>
                <td className="px-4 py-3 text-xs">{formatSize(file.size)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{new Date(file.createdAt).toLocaleString("zh-CN")}</td>
                <td className="px-4 py-3 text-right">
                  <a href={file.url} target="_blank" rel="noopener" className="mr-2 text-blue-600 hover:text-blue-800">下载</a>
                  <button onClick={() => handleDelete(file)} className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}
      </div>
    </div>
  )
}
