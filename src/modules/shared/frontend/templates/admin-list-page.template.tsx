"use client"

import { useState } from "react"

type Props = {
  title: string
  endpoint: string
}

/**
 * 后台列表页模板（极简示例）
 * 说明：真实项目应替换为统一 ProTable 体系。
 */
export function AdminListPageTemplate({ title, endpoint }: Props) {
  const [keyword, setKeyword] = useState("")

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">API: {endpoint}</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="关键词"
            className="h-9 w-64 rounded-md border px-3 text-sm"
          />
          <button className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button className="h-9 rounded-md border px-4 text-sm">重置</button>
        </div>

        <div className="mt-4 rounded-md border border-dashed p-8 text-sm text-slate-500">
          在这里接入统一表格组件（分页、筛选、导出、列配置）
        </div>
      </div>
    </div>
  )
}
