"use client"

import { useParams } from "next/navigation"
import PageRenderPage from "@/modules/infra/frontend/pages/page-render.page"

export default function DynamicPageRender() {
  const params = useParams()
  const slug = params?.slug as string
  return <PageRenderPage slug={slug} />
}
