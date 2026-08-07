export const nextReactAdminMesPageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"
import { Badge } from "@/modules/shared/frontend/components/ui/badge"

export default function AdminMesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>生产执行中心</CardTitle>
          <Badge>MES</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          用于管理工单排产、生产进度与质量追溯流程。
        </CardContent>
      </Card>
    </div>
  )
}
`