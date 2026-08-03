export const nextReactAdminImPageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminImPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>消息协同中心</CardTitle>
          <Badge>IM</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          用于承接站内会话、客服消息与通知联动能力。
        </CardContent>
      </Card>
    </div>
  )
}
`