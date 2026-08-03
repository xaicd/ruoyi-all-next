export const nextReactMerchantPageTemplate = `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function {{entityName}}MerchantPage() {
  const [keyword, setKeyword] = useState("")

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{{entityName}} 商户工作台</h1>
        <p className="mt-1 text-sm text-slate-500">适用于商户端列表、筛选、快速操作页面。</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="请输入关键词"
          className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-primary-500/30 focus:ring"
        />
        <Button>查询数据</Button>
      </div>
    </div>
  )
}
`
