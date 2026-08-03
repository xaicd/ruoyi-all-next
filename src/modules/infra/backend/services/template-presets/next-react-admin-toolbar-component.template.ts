export const nextReactAdminToolbarComponentTemplate = `"use client"

import { Button } from "@/components/ui/button"

interface {{entityName}}ToolbarProps {
  onCreate: () => void
  onRefresh: () => void
}

export function {{entityName}}Toolbar({ onCreate, onRefresh }: {{entityName}}ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={onCreate}>新建{{entityName}}</Button>
      <Button variant="outline" onClick={onRefresh}>刷新列表</Button>
    </div>
  )
}
`