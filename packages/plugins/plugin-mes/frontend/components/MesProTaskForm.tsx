"use client"

import React, { useState, useEffect } from "react"
import { MesProTaskApi } from "../api/mes-pro-task.api"
import type { MesProTaskCreateDTO, MesProTaskVO } from "@/modules/mes/backend/types/mes-pro-task.types"

interface MesProTaskFormProps {
  open: boolean
  initialData?: MesProTaskVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesProTaskForm({ open, initialData, onClose, onSuccess }: MesProTaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    work_order_id: initialData?.work_order_id ?? undefined,
    workstation_id: initialData?.workstation_id ?? undefined,
    route_id: initialData?.route_id ?? undefined,
    process_id: initialData?.process_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    produced_quantity: initialData?.produced_quantity ?? undefined,
    qualify_quantity: initialData?.qualify_quantity ?? undefined,
    unqualify_quantity: initialData?.unqualify_quantity ?? undefined,
    changed_quantity: initialData?.changed_quantity ?? undefined,
    client_id: initialData?.client_id ?? undefined,
    start_time: initialData?.start_time ?? "",
    duration: initialData?.duration ?? undefined,
    end_time: initialData?.end_time ?? "",
    color_code: initialData?.color_code ?? "",
    finish_date: initialData?.finish_date ?? "",
    cancel_date: initialData?.cancel_date ?? "",
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
        await MesProTaskApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesProTaskApi.create(formData as MesProTaskCreateDTO)
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
            {isEdit ? "编辑MesProTask（源框架导入）" : "新增MesProTask（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">产品物料编号</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品物料编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排产数量</label>
          <input
            type="number"
            value={formData.quantity != null ? String(formData.quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">已生产数量</label>
          <input
            type="number"
            value={formData.produced_quantity != null ? String(formData.produced_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, produced_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入已生产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合格品数量</label>
          <input
            type="number"
            value={formData.qualify_quantity != null ? String(formData.qualify_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qualify_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合格品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">不良品数量</label>
          <input
            type="number"
            value={formData.unqualify_quantity != null ? String(formData.unqualify_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unqualify_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入不良品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">调整数量</label>
          <input
            type="number"
            value={formData.changed_quantity != null ? String(formData.changed_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, changed_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入调整数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户编号</label>
          <input
            type="number"
            value={formData.client_id != null ? String(formData.client_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始生产时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始生产时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产时长（工作日，1=8小时）</label>
          <input
            type="number"
            value={formData.duration != null ? String(formData.duration) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产时长（工作日，1=8小时）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束生产时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束生产时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">甘特图显示颜色</label>
          <input
            type="text"
            value={formData.color_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, color_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入甘特图显示颜色"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">完成日期</label>
          <input
            type="text"
            value={formData.finish_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, finish_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入完成日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">取消日期</label>
          <input
            type="text"
            value={formData.cancel_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cancel_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入取消日期"
            
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
