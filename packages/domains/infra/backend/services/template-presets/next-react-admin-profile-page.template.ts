export const nextReactAdminProfilePageTemplate = `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"
import { Badge } from "@/modules/shared/frontend/components/ui/badge"

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>个人中心</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>姓名：平台管理员</p>
          <p>组织：平台运营中心</p>
          <div className="flex items-center gap-2">
            <span>角色：</span>
            <Badge>PLATFORM_ADMIN</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`