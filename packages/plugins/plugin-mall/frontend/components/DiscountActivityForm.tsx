"use client"

import React, { useState, useEffect } from "react"
import { DiscountActivityApi } from "../api/discount-activity.api"
import type { DiscountActivityCreateDTO, DiscountActivityVO } from "@/modules/mall/backend/types/discount-activity.types"

interface DiscountActivityFormProps {
  open: boolean
  initialData?: DiscountActivityVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DiscountActivityForm({ open, initialData, onClose, onSuccess }: DiscountActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    remark: initialData?.remark ?? "",
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
        await DiscountActivityApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DiscountActivityApi.create(formData as DiscountActivityCreateDTO)
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
    <div data-testid="discount-activity-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；" : "新增限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；"}
        data-testid="discount-activity-form"
        data-agent-scope="discount-activity:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；" : "新增限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；"}
          </h3>
          <button onClick={onClose} data-testid="discount-activity-form-close" data-agent-target="discount-activity:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="discount-activity-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="discount-activity-name" className="block text-xs text-slate-600 mb-1">活动标题</label>
          <input
            type="text"
            id="discount-activity-name"
            data-testid="field-name"
            data-agent-target="discount-activity:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="活动标题"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动标题"
            
          />
        </div>

        <div>
          <label htmlFor="discount-activity-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="discount-activity-status"
            data-testid="field-status"
            data-agent-target="discount-activity:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="discount-activity-start_time" className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            id="discount-activity-start_time"
            data-testid="field-start_time"
            data-agent-target="discount-activity:field:start_time"
            data-agent-state={formData.start_time ? "filled" : "empty"}
            aria-label="开始时间"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label htmlFor="discount-activity-end_time" className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            id="discount-activity-end_time"
            data-testid="field-end_time"
            data-agent-target="discount-activity:field:end_time"
            data-agent-state={formData.end_time ? "filled" : "empty"}
            aria-label="结束时间"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
          />
        </div>

        <div>
          <label htmlFor="discount-activity-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="discount-activity-remark"
            data-testid="field-remark"
            data-agent-target="discount-activity:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="discount-activity-form-cancel"
              data-agent-target="discount-activity:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="discount-activity-form-submit"
              data-agent-target="discount-activity:submit"
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
