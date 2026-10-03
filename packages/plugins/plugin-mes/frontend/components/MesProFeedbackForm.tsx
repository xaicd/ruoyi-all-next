"use client"

import React, { useState, useEffect } from "react"
import { MesProFeedbackApi } from "../api/mes-pro-feedback.api"
import type { MesProFeedbackCreateDTO, MesProFeedbackVO } from "@/modules/mes/backend/types/mes-pro-feedback.types"

interface MesProFeedbackFormProps {
  open: boolean
  initialData?: MesProFeedbackVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesProFeedbackForm({ open, initialData, onClose, onSuccess }: MesProFeedbackFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    type: initialData?.type ?? undefined,
    channel: initialData?.channel ?? "",
    feedback_time: initialData?.feedback_time ?? "",
    workstation_id: initialData?.workstation_id ?? undefined,
    route_id: initialData?.route_id ?? undefined,
    process_id: initialData?.process_id ?? undefined,
    work_order_id: initialData?.work_order_id ?? undefined,
    task_id: initialData?.task_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    expire_date: initialData?.expire_date ?? "",
    lot_number: initialData?.lot_number ?? "",
    scheduled_quantity: initialData?.scheduled_quantity ?? undefined,
    feedback_quantity: initialData?.feedback_quantity ?? undefined,
    qualified_quantity: initialData?.qualified_quantity ?? undefined,
    unqualified_quantity: initialData?.unqualified_quantity ?? undefined,
    uncheck_quantity: initialData?.uncheck_quantity ?? undefined,
    labor_scrap_quantity: initialData?.labor_scrap_quantity ?? undefined,
    material_scrap_quantity: initialData?.material_scrap_quantity ?? undefined,
    other_scrap_quantity: initialData?.other_scrap_quantity ?? undefined,
    feedback_user_id: initialData?.feedback_user_id ?? undefined,
    approve_user_id: initialData?.approve_user_id ?? undefined,
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
        await MesProFeedbackApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesProFeedbackApi.create(formData as MesProFeedbackCreateDTO)
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
            {isEdit ? "编辑MesProFeedback（源框架导入）" : "新增MesProFeedback（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">报工单编号</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报工类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报工途径</label>
          <input
            type="text"
            value={formData.channel ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工途径"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报工时间</label>
          <input
            type="text"
            value={formData.feedback_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedback_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工作站编号</label>
          <input
            type="number"
            value={formData.workstation_id != null ? String(formData.workstation_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, workstation_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作站编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工艺路线编号</label>
          <input
            type="number"
            value={formData.route_id != null ? String(formData.route_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, route_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工艺路线编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工序编号</label>
          <input
            type="number"
            value={formData.process_id != null ? String(formData.process_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工序编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产工单编号</label>
          <input
            type="number"
            value={formData.work_order_id != null ? String(formData.work_order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, work_order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产工单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产任务编号</label>
          <input
            type="number"
            value={formData.task_id != null ? String(formData.task_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产任务编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品物料编号（冗余自任务）</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品物料编号（冗余自任务）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">过期日期</label>
          <input
            type="text"
            value={formData.expire_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入过期日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产批号</label>
          <input
            type="text"
            value={formData.lot_number ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, lot_number: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产批号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排产数量</label>
          <input
            type="number"
            value={formData.scheduled_quantity != null ? String(formData.scheduled_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">本次报工数量</label>
          <input
            type="number"
            value={formData.feedback_quantity != null ? String(formData.feedback_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedback_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入本次报工数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合格品数量</label>
          <input
            type="number"
            value={formData.qualified_quantity != null ? String(formData.qualified_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qualified_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合格品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">不良品数量</label>
          <input
            type="number"
            value={formData.unqualified_quantity != null ? String(formData.unqualified_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unqualified_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入不良品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">待检测数量</label>
          <input
            type="number"
            value={formData.uncheck_quantity != null ? String(formData.uncheck_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, uncheck_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入待检测数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工废数量</label>
          <input
            type="number"
            value={formData.labor_scrap_quantity != null ? String(formData.labor_scrap_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, labor_scrap_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工废数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">料废数量</label>
          <input
            type="number"
            value={formData.material_scrap_quantity != null ? String(formData.material_scrap_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, material_scrap_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入料废数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">其他废品数量</label>
          <input
            type="number"
            value={formData.other_scrap_quantity != null ? String(formData.other_scrap_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, other_scrap_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入其他废品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报工用户编号</label>
          <input
            type="number"
            value={formData.feedback_user_id != null ? String(formData.feedback_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedback_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报工用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审核用户编号</label>
          <input
            type="number"
            value={formData.approve_user_id != null ? String(formData.approve_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, approve_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审核用户编号"
            
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
