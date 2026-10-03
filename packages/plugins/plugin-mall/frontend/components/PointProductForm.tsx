"use client"

import React, { useState, useEffect } from "react"
import { PointProductApi } from "../api/point-product.api"
import type { PointProductCreateDTO, PointProductVO } from "@/modules/mall/backend/types/point-product.types"

interface PointProductFormProps {
  open: boolean
  initialData?: PointProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PointProductForm({ open, initialData, onClose, onSuccess }: PointProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    activity_id: initialData?.activity_id ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    sku_id: initialData?.sku_id ?? undefined,
    count: initialData?.count ?? undefined,
    point: initialData?.point ?? undefined,
    price: initialData?.price ?? undefined,
    stock: initialData?.stock ?? undefined,
    activity_status: initialData?.activity_status ?? undefined,
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
        await PointProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PointProductApi.create(formData as PointProductCreateDTO)
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
            {isEdit ? "编辑PointProduct（源框架导入）" : "新增PointProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">积分商城活动 id</label>
          <input
            type="number"
            value={formData.activity_id != null ? String(formData.activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分商城活动 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品 SPU 编号</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SPU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品 SKU 编号</label>
          <input
            type="number"
            value={formData.sku_id != null ? String(formData.sku_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SKU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可兑换次数</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可兑换次数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">所需兑换积分</label>
          <input
            type="number"
            value={formData.point != null ? String(formData.point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所需兑换积分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">所需兑换金额，单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所需兑换金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分商城商品库存</label>
          <input
            type="number"
            value={formData.stock != null ? String(formData.stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分商城商品库存"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分商城商品状态</label>
          <input
            type="number"
            value={formData.activity_status != null ? String(formData.activity_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分商城商品状态"
            
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
