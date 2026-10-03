"use client"

import React, { useState, useEffect } from "react"
import { MesWmStockTakingTaskApi } from "../api/mes-wm-stock-taking-task.api"
import type { MesWmStockTakingTaskCreateDTO, MesWmStockTakingTaskVO } from "@/modules/mes/backend/types/mes-wm-stock-taking-task.types"

interface MesWmStockTakingTaskFormProps {
  open: boolean
  initialData?: MesWmStockTakingTaskVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmStockTakingTaskForm({ open, initialData, onClose, onSuccess }: MesWmStockTakingTaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    taking_date: initialData?.taking_date ?? "",
    type: initialData?.type ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    plan_id: initialData?.plan_id ?? undefined,
    blind_flag: initialData?.blind_flag ?? false,
    frozen: initialData?.frozen ?? false,
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
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
        await MesWmStockTakingTaskApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmStockTakingTaskApi.create(formData as MesWmStockTakingTaskCreateDTO)
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
            {isEdit ? "编辑MesWmStockTakingTask（源框架导入）" : "新增MesWmStockTakingTask（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">任务编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">任务名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点日期</label>
          <input
            type="text"
            value={formData.taking_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, taking_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点人编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点人编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点计划编号</label>
          <input
            type="number"
            value={formData.plan_id != null ? String(formData.plan_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, plan_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点计划编号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="blind_flag"
            checked={Boolean(formData.blind_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, blind_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="blind_flag" className="text-xs text-slate-700 font-medium">是否盲盘</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="frozen"
            checked={Boolean(formData.frozen)}
            onChange={(e) => setFormData((prev) => ({ ...prev, frozen: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="frozen" className="text-xs text-slate-700 font-medium">是否冻结库存</label>
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
          <label className="block text-xs text-slate-600 mb-1">任务状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务状态"
            
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
