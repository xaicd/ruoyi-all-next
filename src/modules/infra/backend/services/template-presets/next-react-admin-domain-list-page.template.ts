export const nextReactAdminDomainListPageTemplate = `"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"

const modules = [
  { code: "core", title: "核心模块", href: "/admin/{{modulePath}}" },
  { code: "tree", title: "树形模块", href: "/admin/{{modulePath}}/tree" },
  { code: "workflow", title: "流程模块", href: "/admin/{{modulePath}}/workflow" },
]

export default function {{entityName}}DomainListPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{{entityName}} 域模块列表</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          统一承接域内子模块导航，便于扩展多页面入口。
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map((item) => (
          <Link key={item.code} href={item.href} className="rounded-xl border px-4 py-3 text-sm hover:border-primary">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
`