export const nextReactAdminIframePageTemplate = `"use client"

import { useSearchParams } from "next/navigation"

export default function AdminIFramePage() {
  const params = useSearchParams()
  const src = params.get("src") || "about:blank"

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <iframe title="admin-iframe" src={src} className="h-[70vh] w-full" />
    </div>
  )
}
`