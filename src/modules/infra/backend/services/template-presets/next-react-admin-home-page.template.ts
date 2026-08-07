export const nextReactAdminHomePageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"

const stats = [
  { label: "今日订单", value: "128" },
  { label: "支付转化", value: "23.6%" },
  { label: "待审核", value: "9" },
]

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>运营总览</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          该页面用于承接后台首页卡片、快捷入口与趋势图表。
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardContent className="space-y-1 p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`