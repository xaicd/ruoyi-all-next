export const nextReactAdminDomainPageTemplate = `"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"

const sections = [
  { title: "模块列表", href: "/admin/{{modulePath}}" },
  { title: "树结构维护", href: "/admin/{{modulePath}}/tree" },
  { title: "流程审批", href: "/admin/{{modulePath}}/workflow" },
]

export default function {{entityName}}DomainPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{entityName}} 域导航</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          该页面用于聚合 {{entityName}} 域下的列表、树和流程入口。
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border bg-white px-4 py-3 text-sm transition hover:border-primary"
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
`