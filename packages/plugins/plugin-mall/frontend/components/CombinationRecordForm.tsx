"use client"

import React, { useState, useEffect } from "react"
import { CombinationRecordApi } from "../api/combination-record.api"
import type { CombinationRecordCreateDTO, CombinationRecordVO } from "@/modules/mall/backend/types/combination-record.types"

interface CombinationRecordFormProps {
  open: boolean
  initialData?: CombinationRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CombinationRecordForm({ open, initialData, onClose, onSuccess }: CombinationRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    activity_id: initialData?.activity_id ?? undefined,
    combination_price: initialData?.combination_price ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    spu_name: initialData?.spu_name ?? "",
    pic_url: initialData?.pic_url ?? "",
    sku_id: initialData?.sku_id ?? undefined,
    count: initialData?.count ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    nickname: initialData?.nickname ?? "",
    avatar: initialData?.avatar ?? "",
    head_id: initialData?.head_id ?? undefined,
    status: initialData?.status ?? undefined,
    order_id: initialData?.order_id ?? undefined,
    user_size: initialData?.user_size ?? undefined,
    user_count: initialData?.user_count ?? undefined,
    virtual_group: initialData?.virtual_group ?? false,
    expire_time: initialData?.expire_time ?? "",
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
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
        await CombinationRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CombinationRecordApi.create(formData as CombinationRecordCreateDTO)
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
            {isEdit ? "编辑CombinationRecord（源框架导入）" : "新增CombinationRecord（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团活动编号</label>
          <input
            type="number"
            value={formData.activity_id != null ? String(formData.activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团活动编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团商品单价</label>
          <input
            type="number"
            value={formData.combination_price != null ? String(formData.combination_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, combination_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团商品单价"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">SPU 编号</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入SPU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品名字</label>
          <input
            type="text"
            value={formData.spu_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品名字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品图片</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">SKU 编号</label>
          <input
            type="number"
            value={formData.sku_id != null ? String(formData.sku_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入SKU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">购买的商品数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入购买的商品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户昵称</label>
          <input
            type="text"
            value={formData.nickname ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户昵称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户头像</label>
          <input
            type="text"
            value={formData.avatar ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户头像"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">团长编号</label>
          <input
            type="number"
            value={formData.head_id != null ? String(formData.head_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, head_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入团长编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开团状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开团状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单编号</label>
          <input
            type="number"
            value={formData.order_id != null ? String(formData.order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开团需要人数</label>
          <input
            type="number"
            value={formData.user_size != null ? String(formData.user_size) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_size: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开团需要人数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">已加入拼团人数</label>
          <input
            type="number"
            value={formData.user_count != null ? String(formData.user_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入已加入拼团人数"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="virtual_group"
            checked={Boolean(formData.virtual_group)}
            onChange={(e) => setFormData((prev) => ({ ...prev, virtual_group: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="virtual_group" className="text-xs text-slate-700 font-medium">是否虚拟成团</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">过期时间</label>
          <input
            type="text"
            value={formData.expire_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入过期时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始时间 (订单付款后开始的时间)</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间 (订单付款后开始的时间)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时间（成团时间/失败时间）</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间（成团时间/失败时间）"
            
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
