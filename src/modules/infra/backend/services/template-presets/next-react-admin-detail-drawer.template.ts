export const nextReactAdminDetailDrawerTemplate = `"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface {{entityName}}Detail {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
  updatedAt?: string
}

interface {{entityName}}DetailDrawerProps {
  open: boolean
  data?: {{entityName}}Detail | null
  onOpenChange: (open: boolean) => void
}

export function {{entityName}}DetailDrawer({
  open,
  data,
  onOpenChange,
}: {{entityName}}DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{{entityName}} 详情</SheetTitle>
          <SheetDescription>查看并核对基础字段。</SheetDescription>
        </SheetHeader>

        {data ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">编号</div>
              <div className="mt-1 text-sm font-medium">{data.id}</div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">名称</div>
              <div className="mt-1 text-sm font-medium">{data.name}</div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="text-xs text-muted-foreground">状态</div>
              <div className="mt-2">
                <Badge variant={data.status === "ACTIVE" ? "default" : "secondary"}>
                  {data.status}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            暂无详情数据
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
`