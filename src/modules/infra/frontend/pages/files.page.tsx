"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

type InfraFile = { id: string; configId: string; name: string | null; path: string; url: string; type: string | null; size: number; createdAt: string }
type PageData = { items: InfraFile[]; total: number; page: number; pageSize: number }

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
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword) => {
    setLoading(true)
    try {
      const res = await request.get(API.FILES, { page: p, pageSize: ps, keyword: kw || undefined })
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, pageSize, keyword])

  useEffect(() => {
    loadData(page, pageSize, keyword)
  }, [loadData, page, pageSize])

  const handleDelete = async (file: InfraFile) => {
    if (!confirm(`确认删除文件「${file.name || file.path}」？`)) return
    const res = await request.delete(`${API.FILES}/${file.id}`)
    if (res.success) loadData(page, pageSize, keyword); else alert(res.error)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">文件管理</h1>
        <p className="mt-0.5 text-sm text-slate-500">管理系统上传的文件资源</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-white p-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索文件名 / 路径"
          className="h-9 w-64 rounded-md border px-3 text-sm"
        />
        <button onClick={() => { setPage(1); loadData(1, pageSize, keyword) }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
        <button onClick={() => { setKeyword(""); setPage(1); loadData(1, pageSize, "") }} className="h-9 rounded-md border px-4 text-sm">重置</button>
        <span className="ml-auto text-xs text-slate-500">
          共 <span className="font-semibold text-slate-900">{data.total}</span> 个文件
        </span>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">文件名</th><th className="px-4 py-3">类型</th><th className="px-4 py-3">大小</th><th className="px-4 py-3">上传时间</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="py-8 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-slate-400">暂无数据</td></tr>
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
      </div>

      {/* 通用底部分页控件 */}
      <Pagination
        total={data.total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p)
          loadData(p, pageSize, keyword)
        }}
        onPageSizeChange={(ps) => {
          setPageSize(ps)
          setPage(1)
          loadData(1, ps, keyword)
        }}
      />
    </div>
  )
}
