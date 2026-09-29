export const nextReactAdminRedirectPageTemplate = `"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminRedirectPage() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const target = params.get("to") || "/admin/home"
    router.replace(target)
  }, [params, router])

  return <p className="py-10 text-center text-sm text-muted-foreground">正在跳转...</p>
}
`