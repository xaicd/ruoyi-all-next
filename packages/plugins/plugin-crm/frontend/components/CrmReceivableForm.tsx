"use client"

import React, { useState, useEffect } from "react"
import { CrmReceivableApi } from "../api/crm-receivable.api"
import type { CrmReceivableCreateDTO, CrmReceivableVO } from "@/modules/crm/backend/types/crm-receivable.types"

interface CrmReceivableFormProps {
  open: boolean
  initialData?: CrmReceivableVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmReceivableForm({ open, initialData, onClose, onSuccess }: CrmReceivableFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    plan_id: initialData?.plan_id ?? undefined,
    customer_id: initialData?.customer_id ?? undefined,
    contract_id: initialData?.contract_id ?? undefined,
    owner_user_id: initialData?.owner_user_id ?? undefined,
    return_time: initialData?.return_time ?? "",
    return_type: initialData?.return_type ?? undefined,
    price: initialData?.price ?? undefined,
    remark: initialData?.remark ?? "",
    process_instance_id: initialData?.process_instance_id ?? "",
    audit_status: initialData?.audit_status ?? undefined,
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
        await CrmReceivableApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmReceivableApi.create(formData as CrmReceivableCreateDTO)
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
            {isEdit ? "编辑CrmReceivable（源框架导入）" : "新增CrmReceivable（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">回款编号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回款编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回款计划编号</label>
          <input
            type="number"
            value={formData.plan_id != null ? String(formData.plan_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, plan_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回款计划编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户编号</label>
          <input
            type="number"
            value={formData.customer_id != null ? String(formData.customer_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, customer_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合同编号</label>
          <input
            type="number"
            value={formData.contract_id != null ? String(formData.contract_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contract_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合同编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人编号，关联</label>
          <input
            type="number"
            value={formData.owner_user_id != null ? String(formData.owner_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人编号，关联"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回款日期</label>
          <input
            type="text"
            value={formData.return_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, return_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回款日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回款方式</label>
          <input
            type="number"
            value={formData.return_type != null ? String(formData.return_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, return_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回款方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">计划回款金额，单位：元</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入计划回款金额，单位：元"
            
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
          <label className="block text-xs text-slate-600 mb-1">工作流编号</label>
          <input
            type="text"
            value={formData.process_instance_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_instance_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作流编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审批状态</label>
          <input
            type="number"
            value={formData.audit_status != null ? String(formData.audit_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审批状态"
            
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
