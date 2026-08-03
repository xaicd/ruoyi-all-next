export const nextReactAdminFilterBarTemplate = `"use client"

import { Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface {{entityName}}FilterBarProps {
  keyword: string
  status: string
  onKeywordChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
}

export function {{entityName}}FilterBar({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onSearch,
  onReset,
}: {{entityName}}FilterBarProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto_auto]">
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="请输入关键词"
        />

        <Input
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          placeholder="状态（ACTIVE/DISABLED）"
        />

        <Button className="gap-2" onClick={onSearch}>
          <Search className="size-4" />
          查询
        </Button>

        <Button variant="outline" className="gap-2" onClick={onReset}>
          <RotateCcw className="size-4" />
          重置
        </Button>
      </div>
    </div>
  )
}
`