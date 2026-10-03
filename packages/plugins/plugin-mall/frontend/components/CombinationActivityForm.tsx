"use client"

import React, { useState, useEffect } from "react"
import { CombinationActivityApi } from "../api/combination-activity.api"
import type { CombinationActivityCreateDTO, CombinationActivityVO } from "@/modules/mall/backend/types/combination-activity.types"

interface CombinationActivityFormProps {
  open: boolean
  initialData?: CombinationActivityVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CombinationActivityForm({ open, initialData, onClose, onSuccess }: CombinationActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    spu_id: initialData?.spu_id ?? undefined,
    total_limit_count: initialData?.total_limit_count ?? undefined,
    single_limit_count: initialData?.single_limit_count ?? undefined,
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    user_size: initialData?.user_size ?? undefined,
    virtual_group: initialData?.virtual_group ?? false,
    status: initialData?.status ?? undefined,
    limit_duration: initialData?.limit_duration ?? undefined,
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
        await CombinationActivityApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CombinationActivityApi.create(formData as CombinationActivityCreateDTO)
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
            {isEdit ? "编辑CombinationActivity（源框架导入）" : "新增CombinationActivity（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团名称"
            
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
          <label className="block text-xs text-slate-600 mb-1">单次限购数量</label>
          <input
            type="number"
            value={formData.single_limit_count != null ? String(formData.single_limit_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, single_limit_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单次限购数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">几人团</label>
          <input
            type="number"
            value={formData.user_size != null ? String(formData.user_size) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_size: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入几人团"
            
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
          <label htmlFor="virtual_group" className="text-xs text-slate-700 font-medium">虚拟成团</label>
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
          <label className="block text-xs text-slate-600 mb-1">限制时长（小时）</label>
          <input
            type="number"
            value={formData.limit_duration != null ? String(formData.limit_duration) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, limit_duration: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入限制时长（小时）"
            
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
