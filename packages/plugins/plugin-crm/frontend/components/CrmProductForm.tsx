"use client"

import React, { useState, useEffect } from "react"
import { CrmProductApi } from "../api/crm-product.api"
import type { CrmProductCreateDTO, CrmProductVO } from "@/modules/crm/backend/types/crm-product.types"

interface CrmProductFormProps {
  open: boolean
  initialData?: CrmProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmProductForm({ open, initialData, onClose, onSuccess }: CrmProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    no: initialData?.no ?? "",
    unit: initialData?.unit ?? undefined,
    price: initialData?.price ?? undefined,
    status: initialData?.status ?? undefined,
    category_id: initialData?.category_id ?? undefined,
    description: initialData?.description ?? "",
    owner_user_id: initialData?.owner_user_id ?? undefined,
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
        await CrmProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmProductApi.create(formData as CrmProductCreateDTO)
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
            {isEdit ? "编辑CrmProduct（源框架导入）" : "新增CrmProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">产品名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编码</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">单位 *</label>
          <input
            type="number"
            value={formData.unit != null ? String(formData.unit) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单位"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">价格，单位：元</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入价格，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品分类 ID</label>
          <input
            type="number"
            value={formData.category_id != null ? String(formData.category_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品分类 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人的用户编号</label>
          <input
            type="number"
            value={formData.owner_user_id != null ? String(formData.owner_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人的用户编号"
            
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
