"use client"

import React, { useState, useEffect } from "react"
import { SeckillProductApi } from "../api/seckill-product.api"
import type { SeckillProductCreateDTO, SeckillProductVO } from "@/modules/mall/backend/types/seckill-product.types"

interface SeckillProductFormProps {
  open: boolean
  initialData?: SeckillProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function SeckillProductForm({ open, initialData, onClose, onSuccess }: SeckillProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    activity_id: initialData?.activity_id ?? undefined,
    config_ids: initialData?.config_ids ?? "",
    spu_id: initialData?.spu_id ?? undefined,
    sku_id: initialData?.sku_id ?? undefined,
    seckill_price: initialData?.seckill_price ?? undefined,
    stock: initialData?.stock ?? undefined,
    activity_status: initialData?.activity_status ?? undefined,
    activity_start_time: initialData?.activity_start_time ?? "",
    activity_end_time: initialData?.activity_end_time ?? "",
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
        await SeckillProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await SeckillProductApi.create(formData as SeckillProductCreateDTO)
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
            {isEdit ? "编辑SeckillProduct（源框架导入）" : "新增SeckillProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀活动 id</label>
          <input
            type="number"
            value={formData.activity_id != null ? String(formData.activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀活动 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀时段 id</label>
          <input
            type="text"
            value={formData.config_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀时段 id"
            
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
          <label className="block text-xs text-slate-600 mb-1">秒杀金额，单位：分</label>
          <input
            type="number"
            value={formData.seckill_price != null ? String(formData.seckill_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, seckill_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀库存</label>
          <input
            type="number"
            value={formData.stock != null ? String(formData.stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀库存"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀商品状态</label>
          <input
            type="number"
            value={formData.activity_status != null ? String(formData.activity_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀商品状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">活动开始时间点</label>
          <input
            type="text"
            value={formData.activity_start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动开始时间点"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">活动结束时间点</label>
          <input
            type="text"
            value={formData.activity_end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动结束时间点"
            
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
