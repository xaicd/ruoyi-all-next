import {
  type CodegenConfig,
  type CodegenOutput,
  formColumns,
  toKebab,
} from "./common"

export function generateClientH5(config: CodegenConfig): CodegenOutput[] {
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)
  const displayCols = formColumns(config).slice(0, 4)

  const apiContent = `// Auto-generated H5 Client SDK for ${businessName}
import { request } from "@/shared/lib/request"

export interface ${className}Item {
  id: string
${displayCols.map((c) => `  ${c.name}?: ${c.tsType}`).join("\n")}
  createTime?: string
}

export const ${className}H5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: ${className}Item[]; total: number }>("/api/v1/app/${moduleName}/${kebab}", { params })
  },
  async get(id: string) {
    return request.get<${className}Item>(\`/api/v1/app/${moduleName}/${kebab}/\${id}\`)
  },
}
`

  const pageContent = `"use client"

// Auto-generated Mobile H5 Page for ${businessName}
import React, { useState, useEffect } from "react"
import { ${className}H5Api, type ${className}Item } from "../api/${kebab}.api"

export function ${className}H5Page() {
  const [items, setItems] = useState<${className}Item[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    ${className}H5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">${businessName}</h1>
        <p className="text-xs text-slate-500">移动端列表浏览</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">加载中...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">暂无数据</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="text-xs font-semibold text-slate-800">${businessName} #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
${displayCols.map((c) => `                <div>${c.comment || c.name}: {String(item.${c.name} ?? "-")}</div>`).join("\n")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
`

  return [
    {
      path: `clients/h5/src/modules/${moduleName}/api/${kebab}.api.ts`,
      content: apiContent,
      type: "api",
    },
    {
      path: `clients/h5/src/modules/${moduleName}/pages/${kebab}.page.tsx`,
      content: pageContent,
      type: "page",
    },
  ]
}
