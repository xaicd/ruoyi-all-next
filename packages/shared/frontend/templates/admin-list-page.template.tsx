"use client"

import { useState, useEffect, useCallback } from "react"
import { request } from "@/modules/shared/frontend/lib/request"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

type Props = {
  title: string
  endpoint: string
  columns?: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[]
}

/**
 * 通用后台列表页模板
 * 自动调用 endpoint?page=1&pageSize=10 获取数据并展示
 */
export function AdminListPageTemplate({ title, endpoint, columns }: Props) {
  const [data, setData] = useState<{ items: any[]; total: number; page: number; pageSize: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fix endpoint: ensure it uses /api/v1/ prefix
  const apiEndpoint = endpoint.replace("/api/admin/", "/api/v1/admin/")

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword) => {
    setLoading(true)
    try {
      const res = await request.get(apiEndpoint, { page: p, pageSize: ps, keyword: kw || undefined })
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setData({ items: res.data, total: res.data.length, page: p, pageSize: ps })
        } else {
          setData(res.data)
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, page, pageSize, keyword])

  useEffect(() => {
    loadData(page, pageSize, keyword)
  }, [loadData, page, pageSize])

  // Auto-detect columns from first item if not specified
  const autoColumns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[] = data?.items[0]
    ? Object.keys(data.items[0])
        .filter((k) => !["id"].includes(k))
        .slice(0, 6)
        .map((k) => ({ key: k, label: k }))
    : []

  const cols = columns || autoColumns
  const total = data?.total || 0

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-0.5 text-xs text-slate-400 font-mono">{apiEndpoint}</p>
      </div>

      {/* 搜索 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setPage(1)
            loadData(1, pageSize, keyword)
          }}
          className="flex flex-wrap items-center gap-2.5"
        >
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="关键词搜索..."
            className="h-9 w-72 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button type="submit" className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 transition">
            查询
          </button>
          <button
            type="button"
            onClick={() => {
              setKeyword("")
              setPage(1)
              loadData(1, pageSize, "")
            }}
            className="h-9 rounded-lg bg-slate-100 px-4 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
          >
            重置
          </button>
          <span className="ml-auto text-xs text-slate-500">
            共 <span className="font-semibold text-slate-900">{total}</span> 条数据
          </span>
        </form>
      </div>

      {/* 表格 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">正在加载数据...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 w-20">ID</th>
                  {cols.map((col) => (
                    <th key={col.key} className="px-4 py-3">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, i) => (
                  <tr key={item.id ?? i} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{item.id ?? i + 1}</td>
                    {cols.map((col) => {
                      const val = item[col.key]
                      return (
                        <td key={col.key} className="px-4 py-3 max-w-xs truncate">
                          {col.render ? col.render(val, item) : (
                            <span className={`${val === null || val === undefined ? "text-slate-300" : ""}`}>
                              {val === null || val === undefined ? "—"
                                : typeof val === "boolean" ? (val ? "✓ 是" : "✗ 否")
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
      </div>

      {/* 通用底部分页控件 */}
      <Pagination
        total={total}
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

