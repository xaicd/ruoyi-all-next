export const nextReactAdminLayoutShellTemplate = `"use client"

import type { ReactNode } from "react"

interface AdminLayoutShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminLayoutShell({ title, subtitle, actions, children }: AdminLayoutShellProps) {
  return (
    <div className="space-y-5">
      <header className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
      </header>
      <section>{children}</section>
    </div>
  )
}
`