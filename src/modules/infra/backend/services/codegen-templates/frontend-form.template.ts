import {
  type CodegenConfig,
  type CodegenOutput,
  formColumns,
  getFrontendPath,
  toKebab,
} from "./common"

export function generateFormComponent(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, businessName, submodule } = config
  const sub = submodule ? `/${submodule}` : ""
  const kebab = toKebab(className)
  const writeCols = formColumns(config)

  const formFields = writeCols.map((c) => {
    const label = c.comment || c.name
    if (c.tsType === "boolean") {
      return `        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="${c.name}"
            checked={Boolean(formData.${c.name})}
            onChange={(e) => setFormData((prev) => ({ ...prev, ${c.name}: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="${c.name}" className="text-xs text-slate-700 font-medium">${label}</label>
        </div>`
    }
    if (c.tsType === "number") {
      return `        <div>
          <label className="block text-xs text-slate-600 mb-1">${label}${c.formValidation === "required" || !c.nullable ? " *" : ""}</label>
          <input
            type="number"
            value={formData.${c.name} != null ? String(formData.${c.name}) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, ${c.name}: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入${label}"
            ${c.formValidation === "required" || !c.nullable ? "required" : ""}
          />
        </div>`
    }
    return `        <div>
          <label className="block text-xs text-slate-600 mb-1">${label}${c.formValidation === "required" || !c.nullable ? " *" : ""}</label>
          <input
            type="text"
            value={formData.${c.name} ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, ${c.name}: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入${label}"
            ${c.formValidation === "required" || !c.nullable ? "required" : ""}
          />
        </div>`
  }).join("\n\n")

  const initFields = writeCols.map((c) => {
    if (c.tsType === "boolean") return `    ${c.name}: initialData?.${c.name} ?? false,`
    if (c.tsType === "number") return `    ${c.name}: initialData?.${c.name} ?? undefined,`
    return `    ${c.name}: initialData?.${c.name} ?? "",`
  }).join("\n")

  const content = `"use client"

import React, { useState, useEffect } from "react"
import { ${className}Api } from "../api/${kebab}.api"
import type { ${className}CreateDTO, ${className}VO } from "@/modules/${moduleName}${sub}/backend/types/${kebab}.types"

interface ${className}FormProps {
  open: boolean
  initialData?: ${className}VO | null
  onClose: () => void
  onSuccess: () => void
}

export function ${className}Form({ open, initialData, onClose, onSuccess }: ${className}FormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
${initFields}
      })
    }
  }, [open, initialData])

  if (!open) return null

  const isEdit = Boolean(initialData?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit && initialData?.id) {
        await ${className}Api.update({ id: initialData.id, ...formData } as any)
      } else {
        await ${className}Api.create(formData as ${className}CreateDTO)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || "操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑${businessName}" : "新增${businessName}"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
${formFields}
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
`
  return { path: `${getFrontendPath(config)}/components/${className}Form.tsx`, content, type: "component" }
}
