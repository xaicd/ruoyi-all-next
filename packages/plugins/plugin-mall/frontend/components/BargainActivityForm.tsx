"use client"

import React, { useState, useEffect } from "react"
import { BargainActivityApi } from "../api/bargain-activity.api"
import type { BargainActivityCreateDTO, BargainActivityVO } from "@/modules/mall/backend/types/bargain-activity.types"

interface BargainActivityFormProps {
  open: boolean
  initialData?: BargainActivityVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BargainActivityForm({ open, initialData, onClose, onSuccess }: BargainActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    status: initialData?.status ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    sku_id: initialData?.sku_id ?? undefined,
    bargain_first_price: initialData?.bargain_first_price ?? undefined,
    bargain_min_price: initialData?.bargain_min_price ?? undefined,
    stock: initialData?.stock ?? undefined,
    total_stock: initialData?.total_stock ?? undefined,
    help_max_count: initialData?.help_max_count ?? undefined,
    bargain_count: initialData?.bargain_count ?? undefined,
    total_limit_count: initialData?.total_limit_count ?? undefined,
    random_min_price: initialData?.random_min_price ?? undefined,
    random_max_price: initialData?.random_max_price ?? undefined,
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
        await BargainActivityApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BargainActivityApi.create(formData as BargainActivityCreateDTO)
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
            {isEdit ? "编辑BargainActivity（源框架导入）" : "新增BargainActivity（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价活动名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价活动名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">活动开始时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">活动结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">活动状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动状态"
            
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
          <label className="block text-xs text-slate-600 mb-1">砍价起始价格，单位：分</label>
          <input
            type="number"
            value={formData.bargain_first_price != null ? String(formData.bargain_first_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bargain_first_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价起始价格，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价底价，单位：分</label>
          <input
            type="number"
            value={formData.bargain_min_price != null ? String(formData.bargain_min_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bargain_min_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价底价，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价库存(剩余库存砍价时扣减)</label>
          <input
            type="number"
            value={formData.stock != null ? String(formData.stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价库存(剩余库存砍价时扣减)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价总库存</label>
          <input
            type="number"
            value={formData.total_stock != null ? String(formData.total_stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价总库存"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价人数</label>
          <input
            type="number"
            value={formData.help_max_count != null ? String(formData.help_max_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, help_max_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价人数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">帮砍次数</label>
          <input
            type="number"
            value={formData.bargain_count != null ? String(formData.bargain_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bargain_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入帮砍次数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总限购数量</label>
          <input
            type="number"
            value={formData.total_limit_count != null ? String(formData.total_limit_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_limit_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总限购数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户每次砍价的最小金额，单位：分</label>
          <input
            type="number"
            value={formData.random_min_price != null ? String(formData.random_min_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, random_min_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户每次砍价的最小金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户每次砍价的最大金额，单位：分</label>
          <input
            type="number"
            value={formData.random_max_price != null ? String(formData.random_max_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, random_max_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户每次砍价的最大金额，单位：分"
            
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
