"use client"

import React, { useState, useEffect } from "react"
import { WmsItemCategoryApi } from "../api/wms-item-category.api"
import type { WmsItemCategoryCreateDTO, WmsItemCategoryVO } from "@/modules/wms/backend/types/wms-item-category.types"

interface WmsItemCategoryFormProps {
  open: boolean
  initialData?: WmsItemCategoryVO | null
  onClose: () => void
  onSuccess: () => void
}

export function WmsItemCategoryForm({ open, initialData, onClose, onSuccess }: WmsItemCategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    parent_id: initialData?.parent_id ?? "",
    name: initialData?.name ?? "",
    code: initialData?.code ?? "",
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? "",
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
        await WmsItemCategoryApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await WmsItemCategoryApi.create(formData as WmsItemCategoryCreateDTO)
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
            {isEdit ? "编辑物料分类" : "新增物料分类"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">上级分类ID *</label>
          <input
            type="text"
            value={formData.parent_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入上级分类ID"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分类名称 *</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类名称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分类编码 *</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类编码"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">显示排序 *</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入显示排序"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态 *</label>
          <input
            type="text"
            value={formData.status ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            required
          />
        </div>
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
