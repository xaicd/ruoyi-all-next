export const nextReactAdminReportPageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  { label: "GMV", value: "¥1,286,320" },
  { label: "支付订单", value: "3,921" },
  { label: "复购率", value: "18.7%" },
]

export default function AdminReportPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>经营报表中心</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          该页面用于承接趋势、漏斗与多维度经营分析。
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`