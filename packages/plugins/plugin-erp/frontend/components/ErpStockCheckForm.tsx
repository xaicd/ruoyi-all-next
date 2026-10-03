"use client"

import React, { useState, useEffect } from "react"
import { ErpStockCheckApi } from "../api/erp-stock-check.api"
import type { ErpStockCheckCreateDTO, ErpStockCheckVO } from "@/modules/erp/backend/types/erp-stock-check.types"

interface ErpStockCheckFormProps {
  open: boolean
  initialData?: ErpStockCheckVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpStockCheckForm({ open, initialData, onClose, onSuccess }: ErpStockCheckFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    check_time: initialData?.check_time ?? "",
    total_count: initialData?.total_count ?? undefined,
    total_price: initialData?.total_price ?? undefined,
    status: initialData?.status ?? undefined,
    remark: initialData?.remark ?? "",
    file_url: initialData?.file_url ?? "",
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
        await ErpStockCheckApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpStockCheckApi.create(formData as ErpStockCheckCreateDTO)
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
            {isEdit ? "编辑ErpStockCheck（源框架导入）" : "新增ErpStockCheck（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点单号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点时间</label>
          <input
            type="text"
            value={formData.check_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计数量</label>
          <input
            type="number"
            value={formData.total_count != null ? String(formData.total_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计金额，单位：元</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计金额，单位：元"
            
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
          <label className="block text-xs text-slate-600 mb-1">附件 URL</label>
          <input
            type="text"
            value={formData.file_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入附件 URL"
            
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
