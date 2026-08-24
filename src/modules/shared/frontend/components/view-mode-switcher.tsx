"use client"

import React from "react"

export type ViewMode = "table" | "card"

export interface ViewModeSwitcherProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
  tableLabel?: string
  cardLabel?: string
  className?: string
}

/**
 * 通用视图切换器组件 (Table View vs Card Grid View)
 * 遵循平台统一 UI Design System 风格规范
 */
export function ViewModeSwitcher({
  mode,
  onChange,
  tableLabel = "列表视图",
  cardLabel = "卡片视图",
  className = "",
}: ViewModeSwitcherProps) {
  return (
    <div
      className={`inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 select-none ${className}`}
      role="group"
      aria-label="视图切换"
    >
      <button
        type="button"
        onClick={() => onChange("table")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
          mode === "table"
            ? "bg-white text-slate-900 shadow-xs font-semibold"
            : "text-slate-500 hover:text-slate-800"
        }`}
        title="切换为列表视图"
      >
        <span className="text-xs">☰</span>
        <span>{tableLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("card")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
          mode === "card"
            ? "bg-white text-slate-900 shadow-xs font-semibold"
            : "text-slate-500 hover:text-slate-800"
        }`}
        title="切换为卡片视图"
      >
        <span className="text-xs">⊞</span>
        <span>{cardLabel}</span>
      </button>
    </div>
  )
}

export default ViewModeSwitcher
