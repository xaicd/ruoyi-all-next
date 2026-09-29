"use client"

import React from "react"

export interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onPageChange: (newPage: number) => void
  onPageSizeChange?: (newPageSize: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  // 生成页码序列 (智能缩略)
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages)
      } else if (page >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages)
      }
    }
    return pages
  }

  return (
    <div
      className={`p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 ${className}`}
    >
      {/* 左侧：记录统计与每页条数 */}
      <div className="flex items-center gap-3">
        <span className="text-slate-500">
          共 <strong className="text-slate-900 font-semibold">{total}</strong> 条记录
          {total > 0 && (
            <span className="hidden sm:inline text-slate-400 ml-1">
              (显示第 {startItem} - {endItem} 条)
            </span>
          )}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-400">每页:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value)
                onPageSizeChange(newSize)
                onPageChange(1) // 切换条数重置到第一页
              }}
              className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-700"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} 条/页
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 右侧：分页按钮组 */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition font-medium"
          title="第一页"
        >
          «
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition font-medium"
        >
          ‹ 上一页
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-mono">
                  ...
                </span>
              )
            }
            const pageNum = p as number
            const isActive = pageNum === page
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs border border-blue-600"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition font-medium"
        >
          下一页 ›
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition font-medium"
          title="最后一页"
        >
          »
        </button>
      </div>
    </div>
  )
}
