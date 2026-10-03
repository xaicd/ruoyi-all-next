"use client"

import React, { useState, useEffect } from "react"
import { MesWmProductProduceApi } from "../api/mes-wm-product-produce.api"
import type { MesWmProductProduceCreateDTO, MesWmProductProduceVO } from "@/modules/mes/backend/types/mes-wm-product-produce.types"

interface MesWmProductProduceFormProps {
  open: boolean
  initialData?: MesWmProductProduceVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmProductProduceForm({ open, initialData, onClose, onSuccess }: MesWmProductProduceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    work_order_id: initialData?.work_order_id ?? undefined,
    feedback_id: initialData?.feedback_id ?? undefined,
    task_id: initialData?.task_id ?? undefined,
    workstation_id: initialData?.workstation_id ?? undefined,
    process_id: initialData?.process_id ?? undefined,
    produce_date: initialData?.produce_date ?? "",
    status: initialData?.status ?? undefined,
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
        await MesWmProductProduceApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmProductProduceApi.create(formData as MesWmProductProduceCreateDTO)
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
            {isEdit ? "编辑MesWmProductProduce（源框架导入）" : "新增MesWmProductProduce（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">生产工单 ID</label>
          <input
            type="number"
            value={formData.work_order_id != null ? String(formData.work_order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, work_order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产工单 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报工记录 ID</label>
          <input
            type="number"
            value={formData.feedback_id != null ? String(formData.feedback_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedback_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工记录 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产任务 ID</label>
          <input
            type="number"
            value={formData.task_id != null ? String(formData.task_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产任务 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工作站 ID</label>
          <input
            type="number"
            value={formData.workstation_id != null ? String(formData.workstation_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, workstation_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作站 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工序 ID</label>
          <input
            type="number"
            value={formData.process_id != null ? String(formData.process_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工序 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产日期</label>
          <input
            type="text"
            value={formData.produce_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, produce_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产日期"
            
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
