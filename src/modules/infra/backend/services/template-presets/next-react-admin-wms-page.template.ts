export const nextReactAdminWmsPageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"
import { Badge } from "@/modules/shared/frontend/components/ui/badge"

export default function AdminWmsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>仓配中心</CardTitle>
          <Badge>WMS</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          用于管理出入库、库位与库存预警等仓储流程。
        </CardContent>
      </Card>
    </div>
  )
}
`