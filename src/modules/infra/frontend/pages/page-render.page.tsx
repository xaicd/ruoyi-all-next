"use client"

import { useState, useEffect } from "react"
import { Render, type Config, type Data } from "@measured/puck"
import { request } from "@/modules/shared/frontend/lib/request"

// 复用 page-builder 的 puckConfig（物料定义）
// 实际项目中应该抽到共享模块
import "@measured/puck/puck.css"

/**
 * 动态页面渲染器
 * 通过 slug 加载已保存的 Puck 页面 JSON 并渲染
 */
export default function PageRenderPage({ slug }: { slug: string }) {
  const [pageData, setPageData] = useState<Data | null>(null)
  const [pageName, setPageName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    request.get(`/api/v1/admin/infra/pages/render/${slug}`).then((res) => {
      if (res.success && res.data) {
        setPageData(res.data.data)
        setPageName(res.data.name)
      } else {
        setError(res.error || "页面加载失败")
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-slate-400">加载页面中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl">📭</div>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <p className="mt-1 text-xs text-slate-400">slug: {slug}</p>
      </div>
    )
  }

  if (!pageData) return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">{pageName}</h1>
        <p className="mt-0.5 text-xs text-slate-400">低代码页面 · /{slug}</p>
      </div>
      <div className="space-y-4">
        {/* Render requires puckConfig - in production this should be shared */}
        <RenderWithConfig data={pageData} />
      </div>
    </div>
  )
}

/**
 * Simplified render that doesn't need full puckConfig
 * (renders raw JSON content as structured preview)
 */
function RenderWithConfig({ data }: { data: Data }) {
  if (!data.content || data.content.length === 0) {
    return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-400">页面内容为空</div>
  }

  return (
    <div className="space-y-3">
      {data.content.map((item: any, i: number) => (
        <div key={i} className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{item.type}</span>
            {item.props?.title && <span className="text-slate-600">{item.props.title}</span>}
            {item.props?.value && <span className="font-semibold">{item.props.value}</span>}
          </div>
          {item.props && (
            <div className="mt-2 text-xs text-slate-400">
              {Object.entries(item.props).filter(([k]) => k !== "id" && k !== "title" && k !== "value").map(([k, v]) => (
                <span key={k} className="mr-3">{k}: {String(v)}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
