"use client"

import React, { useState, useEffect } from "react"
import { ArticleCategoryApi } from "../api/article-category.api"
import type { ArticleCategoryCreateDTO, ArticleCategoryVO } from "@/modules/mall/backend/types/article-category.types"

interface ArticleCategoryFormProps {
  open: boolean
  initialData?: ArticleCategoryVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ArticleCategoryForm({ open, initialData, onClose, onSuccess }: ArticleCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    pic_url: initialData?.pic_url ?? "",
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
        await ArticleCategoryApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ArticleCategoryApi.create(formData as ArticleCategoryCreateDTO)
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
    <div data-testid="article-category-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑文章分类" : "新增文章分类"}
        data-testid="article-category-form"
        data-agent-scope="article-category:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑文章分类" : "新增文章分类"}
          </h3>
          <button onClick={onClose} data-testid="article-category-form-close" data-agent-target="article-category:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="article-category-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="article-category-name" className="block text-xs text-slate-600 mb-1">文章分类名称</label>
          <input
            type="text"
            id="article-category-name"
            data-testid="field-name"
            data-agent-target="article-category:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="文章分类名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章分类名称"
            
          />
        </div>

        <div>
          <label htmlFor="article-category-pic_url" className="block text-xs text-slate-600 mb-1">图标地址</label>
          <input
            type="text"
            id="article-category-pic_url"
            data-testid="field-pic_url"
            data-agent-target="article-category:field:pic_url"
            data-agent-state={formData.pic_url ? "filled" : "empty"}
            aria-label="图标地址"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图标地址"
            
          />
        </div>

        <div>
          <label htmlFor="article-category-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="article-category-status"
            data-testid="field-status"
            data-agent-target="article-category:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="article-category-sort" className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            id="article-category-sort"
            data-testid="field-sort"
            data-agent-target="article-category:field:sort"
            data-agent-state={formData.sort == null || formData.sort === "" ? "empty" : "filled"}
            aria-label="排序"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="article-category-form-cancel"
              data-agent-target="article-category:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="article-category-form-submit"
              data-agent-target="article-category:submit"
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
