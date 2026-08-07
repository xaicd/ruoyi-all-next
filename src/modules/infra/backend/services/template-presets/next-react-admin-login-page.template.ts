export const nextReactAdminLoginPageTemplate = `"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/frontend/components/ui/card"
import { Button } from "@/modules/shared/frontend/components/ui/button"
import { Input } from "@/modules/shared/frontend/components/ui/input"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    if (!username || !password) return
    router.push("/admin/home")
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>管理后台登录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="请输入账号" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" />
          <Button className="w-full" onClick={handleSubmit}>登录</Button>
        </CardContent>
      </Card>
    </div>
  )
}
`