export const nextReactAdminDomainDetailPageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function {{entityName}}DomainDetailPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{{entityName}} 域详情</CardTitle>
          <Badge variant="secondary">DOMAIN</Badge>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>模块标识：{{modulePath}}</p>
          <p>用途：聚合域内配置、指标与关键操作。</p>
        </CardContent>
      </Card>
    </div>
  )
}
`