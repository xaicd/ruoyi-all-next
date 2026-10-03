"use client"

import React, { useState, useEffect } from "react"
import { CrmPerformanceConfigApi } from "../api/crm-performance-config.api"
import type { CrmPerformanceConfigCreateDTO, CrmPerformanceConfigVO } from "@/modules/crm/backend/types/crm-performance-config.types"

interface CrmPerformanceConfigFormProps {
  open: boolean
  initialData?: CrmPerformanceConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmPerformanceConfigForm({ open, initialData, onClose, onSuccess }: CrmPerformanceConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    biz_type: initialData?.biz_type ?? undefined,
    object_id: initialData?.object_id ?? undefined,
    object_type: initialData?.object_type ?? undefined,
    year: initialData?.year ?? undefined,
    year_target_price: initialData?.year_target_price ?? undefined,
    january_target_price: initialData?.january_target_price ?? undefined,
    february_target_price: initialData?.february_target_price ?? undefined,
    march_target_price: initialData?.march_target_price ?? undefined,
    april_target_price: initialData?.april_target_price ?? undefined,
    may_target_price: initialData?.may_target_price ?? undefined,
    june_target_price: initialData?.june_target_price ?? undefined,
    july_target_price: initialData?.july_target_price ?? undefined,
    august_target_price: initialData?.august_target_price ?? undefined,
    september_target_price: initialData?.september_target_price ?? undefined,
    october_target_price: initialData?.october_target_price ?? undefined,
    november_target_price: initialData?.november_target_price ?? undefined,
    december_target_price: initialData?.december_target_price ?? undefined,
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
        await CrmPerformanceConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmPerformanceConfigApi.create(formData as CrmPerformanceConfigCreateDTO)
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
            {isEdit ? "编辑CrmPerformanceConfig（源框架导入）" : "新增CrmPerformanceConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">目标类型</label>
          <input
            type="number"
            value={formData.biz_type != null ? String(formData.biz_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入目标类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">目标对象编号</label>
          <input
            type="number"
            value={formData.object_id != null ? String(formData.object_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, object_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入目标对象编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">目标对象类型</label>
          <input
            type="number"
            value={formData.object_type != null ? String(formData.object_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, object_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入目标对象类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">年份</label>
          <input
            type="number"
            value={formData.year != null ? String(formData.year) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入年份"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">年度目标金额</label>
          <input
            type="number"
            value={formData.year_target_price != null ? String(formData.year_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, year_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入年度目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">一月目标金额</label>
          <input
            type="number"
            value={formData.january_target_price != null ? String(formData.january_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, january_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入一月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">二月目标金额</label>
          <input
            type="number"
            value={formData.february_target_price != null ? String(formData.february_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, february_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入二月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">三月目标金额</label>
          <input
            type="number"
            value={formData.march_target_price != null ? String(formData.march_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, march_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入三月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">四月目标金额</label>
          <input
            type="number"
            value={formData.april_target_price != null ? String(formData.april_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, april_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入四月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">五月目标金额</label>
          <input
            type="number"
            value={formData.may_target_price != null ? String(formData.may_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, may_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入五月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">六月目标金额</label>
          <input
            type="number"
            value={formData.june_target_price != null ? String(formData.june_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, june_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入六月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">七月目标金额</label>
          <input
            type="number"
            value={formData.july_target_price != null ? String(formData.july_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, july_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入七月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">八月目标金额</label>
          <input
            type="number"
            value={formData.august_target_price != null ? String(formData.august_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, august_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入八月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">九月目标金额</label>
          <input
            type="number"
            value={formData.september_target_price != null ? String(formData.september_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, september_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入九月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">十月目标金额</label>
          <input
            type="number"
            value={formData.october_target_price != null ? String(formData.october_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, october_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入十月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">十一月目标金额</label>
          <input
            type="number"
            value={formData.november_target_price != null ? String(formData.november_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, november_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入十一月目标金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">十二月目标金额</label>
          <input
            type="number"
            value={formData.december_target_price != null ? String(formData.december_target_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, december_target_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入十二月目标金额"
            
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
