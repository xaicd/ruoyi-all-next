"use client"

import { useState, useEffect, useCallback } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

type Props = {
  title: string
  endpoint: string
  columns?: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
}

/**
 * 通用后台列表页模板
 * 自动调用 endpoint?page=1&pageSize=20 获取数据并展示
 */
export function AdminListPageTemplate({ title, endpoint, columns }: Props) {
  const [data, setData] = useState<{ items: any[]; total: number; page: number; pageSize: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)

  // Fix endpoint: ensure it uses /api/v1/ prefix
  const apiEndpoint = endpoint.replace("/api/admin/", "/api/v1/admin/")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await request.get(apiEndpoint, { page, pageSize: 20, keyword: keyword || undefined })
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setData({ items: res.data, total: res.data.length, page: 1, pageSize: res.data.length })
        } else {
          setData(res.data)
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, page, keyword])

  useEffect(() => { loadData() }, [loadData])

  // Auto-detect columns from first item if not specified
  const autoColumns = data?.items[0]
    ? Object.keys(data.items[0])
        .filter((k) => !["id"].includes(k))
        .slice(0, 6)
        .map((k) => ({ key: k, label: k }))
    : []

  const cols = columns || autoColumns
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-0.5 text-xs text-slate-400">{apiEndpoint}</p>
      </div>

      {/* 搜索 */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadData()}
            placeholder="关键词搜索"
            className="h-9 w-64 rounded-md border px-3 text-sm"
          />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          {data && <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>}
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border bg-white">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">加载中...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
                  <th className="px-4 py-3 w-20">ID</th>
                  {cols.map((col) => (
                    <th key={col.key} className="px-4 py-3">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={item.id ?? i} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-xs text-slate-400 font-mono">{item.id ?? i + 1}</td>
                    {cols.map((col) => {
                      const val = item[col.key]
                      return (
                        <td key={col.key} className="px-4 py-2.5 max-w-xs">
                          {col.render ? col.render(val, item) : (
                            <span className={`text-sm ${val === null || val === undefined ? "text-slate-300" : ""}`}>
                              {val === null || val === undefined ? "—"
                                : typeof val === "boolean" ? (val ? "✓" : "✗")
                                : typeof val === "object" ? JSON.stringify(val).substring(0, 50)
                                : String(val).substring(0, 60)}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-slate-500">第 {page} / {totalPages} 页</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
