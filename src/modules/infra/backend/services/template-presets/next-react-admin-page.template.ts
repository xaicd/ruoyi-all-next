export const nextReactAdminPageTemplate = `"use client"

import { useEffect, useState } from "react"
import { Button } from "@/modules/shared/frontend/components/ui/button"

export default function {{entityName}}Page() {
  const [items, setItems] = useState<unknown[]>([])

  useEffect(() => {
    void (async () => {
      setItems([])
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{{entityName}} 管理</h1>
        <p className="mt-1 text-sm text-slate-500">Next.js App Router + React 模板骨架。</p>
      </div>
      <Button>新建{{entityName}}</Button>
      <pre className="rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(items, null, 2)}</pre>
    </div>
  )
}
`
