"use client"

import React, { useState, useEffect } from "react"
import { BpmCategoryApi } from "../api/bpm-category.api"
import type { BpmCategoryCreateDTO, BpmCategoryVO } from "@/modules/bpm/backend/types/bpm-category.types"

interface BpmCategoryFormProps {
  open: boolean
  initialData?: BpmCategoryVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BpmCategoryForm({ open, initialData, onClose, onSuccess }: BpmCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? undefined,
    sort: initialData?.sort ?? undefined,
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
        await BpmCategoryApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BpmCategoryApi.create(formData as BpmCategoryCreateDTO)
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
    <div data-testid="bpm-category-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑BPM 流程分类" : "新增BPM 流程分类"}
        data-testid="bpm-category-form"
        data-agent-scope="bpm-category:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑BPM 流程分类" : "新增BPM 流程分类"}
          </h3>
          <button onClick={onClose} data-testid="bpm-category-form-close" data-agent-target="bpm-category:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="bpm-category-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="bpm-category-name" className="block text-xs text-slate-600 mb-1">分类名</label>
          <input
            type="text"
            id="bpm-category-name"
            data-testid="field-name"
            data-agent-target="bpm-category:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="分类名"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类名"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-category-code" className="block text-xs text-slate-600 mb-1">分类标志</label>
          <input
            type="text"
            id="bpm-category-code"
            data-testid="field-code"
            data-agent-target="bpm-category:field:code"
            data-agent-state={formData.code ? "filled" : "empty"}
            aria-label="分类标志"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类标志"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-category-description" className="block text-xs text-slate-600 mb-1">分类描述</label>
          <input
            type="text"
            id="bpm-category-description"
            data-testid="field-description"
            data-agent-target="bpm-category:field:description"
            data-agent-state={formData.description ? "filled" : "empty"}
            aria-label="分类描述"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类描述"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-category-status" className="block text-xs text-slate-600 mb-1">分类状态</label>
          <input
            type="number"
            id="bpm-category-status"
            data-testid="field-status"
            data-agent-target="bpm-category:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="分类状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类状态"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-category-sort" className="block text-xs text-slate-600 mb-1">分类排序</label>
          <input
            type="number"
            id="bpm-category-sort"
            data-testid="field-sort"
            data-agent-target="bpm-category:field:sort"
            data-agent-state={formData.sort == null || formData.sort === "" ? "empty" : "filled"}
            aria-label="分类排序"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类排序"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="bpm-category-form-cancel"
              data-agent-target="bpm-category:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="bpm-category-form-submit"
              data-agent-target="bpm-category:submit"
              data-agent-state={loading ? "busy" : "idle"}
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
