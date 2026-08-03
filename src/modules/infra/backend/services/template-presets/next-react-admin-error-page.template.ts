export const nextReactAdminErrorPageTemplate = `"use client"

import { Button } from "@/components/ui/button"

interface AdminErrorPageProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function AdminErrorPage({
  title = "页面加载失败",
  description = "请稍后重试或联系管理员处理。",
  onRetry,
}: AdminErrorPageProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full border bg-white px-4 py-1 text-xs text-muted-foreground">ERROR</div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button onClick={onRetry}>重试</Button>
    </div>
  )
}
`