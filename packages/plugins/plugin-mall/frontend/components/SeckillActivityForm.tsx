"use client"

import React, { useState, useEffect } from "react"
import { SeckillActivityApi } from "../api/seckill-activity.api"
import type { SeckillActivityCreateDTO, SeckillActivityVO } from "@/modules/mall/backend/types/seckill-activity.types"

interface SeckillActivityFormProps {
  open: boolean
  initialData?: SeckillActivityVO | null
  onClose: () => void
  onSuccess: () => void
}

export function SeckillActivityForm({ open, initialData, onClose, onSuccess }: SeckillActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    spu_id: initialData?.spu_id ?? undefined,
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    remark: initialData?.remark ?? "",
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    sort: initialData?.sort ?? undefined,
    config_ids: initialData?.config_ids ?? "",
    total_limit_count: initialData?.total_limit_count ?? undefined,
    single_limit_count: initialData?.single_limit_count ?? undefined,
    stock: initialData?.stock ?? undefined,
    total_stock: initialData?.total_stock ?? undefined,
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
        await SeckillActivityApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await SeckillActivityApi.create(formData as SeckillActivityCreateDTO)
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
            {isEdit ? "编辑SeckillActivity（源框架导入）" : "新增SeckillActivity（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀活动商品</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀活动商品"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀活动名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀活动名称"
            
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
          <label className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
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
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
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
          <label className="block text-xs text-slate-600 mb-1">单次限够数量</label>
          <input
            type="number"
            value={formData.single_limit_count != null ? String(formData.single_limit_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, single_limit_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单次限够数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀库存(剩余库存秒杀时扣减)</label>
          <input
            type="number"
            value={formData.stock != null ? String(formData.stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀库存(剩余库存秒杀时扣减)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀总库存</label>
          <input
            type="number"
            value={formData.total_stock != null ? String(formData.total_stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀总库存"
            
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
