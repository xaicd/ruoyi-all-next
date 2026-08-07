export const nextReactAdminWorkflowPageTemplate = `"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/modules/shared/frontend/components/ui/badge"
import { Button } from "@/modules/shared/frontend/components/ui/button"

type WorkflowItem = {
  id: string
  title: string
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export default function {{entityName}}WorkflowPage() {
  const [items] = useState<WorkflowItem[]>([])
  const pendingCount = useMemo(() => items.filter((item) => item.status === "PENDING").length, [items])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{{entityName}} 流程审批</h1>
        <p className="mt-1 text-sm text-slate-500">内置待审、通过、驳回状态分层。</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">待审 {pendingCount}</Badge>
        <Button>新建流程</Button>
      </div>
      <pre className="rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(items, null, 2)}</pre>
    </div>
  )
}
`
