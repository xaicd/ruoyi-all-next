export const nextReactAdminTreePageTemplate = `"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type TreeNode = {
  id: string
  name: string
  children?: TreeNode[]
}

export default function {{entityName}}TreePage() {
  const [tree, setTree] = useState<TreeNode[]>([])

  useEffect(() => {
    void (async () => {
      setTree([])
    })()
  }, [])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{{entityName}} 树管理</h1>
        <p className="mt-1 text-sm text-slate-500">支持层级数据维护、拖拽排序与批量调整。</p>
      </div>
      <div className="flex items-center gap-3">
        <Button>新增根节点</Button>
        <Button variant="outline">展开全部</Button>
      </div>
      <pre className="rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(tree, null, 2)}</pre>
    </div>
  )
}
`
