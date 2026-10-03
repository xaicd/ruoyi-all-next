"use client"

import React, { useState, useEffect } from "react"
import { MesDvRepairApi } from "../api/mes-dv-repair.api"
import type { MesDvRepairCreateDTO, MesDvRepairVO } from "@/modules/mes/backend/types/mes-dv-repair.types"

interface MesDvRepairFormProps {
  open: boolean
  initialData?: MesDvRepairVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesDvRepairForm({ open, initialData, onClose, onSuccess }: MesDvRepairFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    machinery_id: initialData?.machinery_id ?? undefined,
    require_date: initialData?.require_date ?? "",
    finish_date: initialData?.finish_date ?? "",
    confirm_date: initialData?.confirm_date ?? "",
    result: initialData?.result ?? undefined,
    accepted_user_id: initialData?.accepted_user_id ?? undefined,
    confirm_user_id: initialData?.confirm_user_id ?? undefined,
    source_doc_type: initialData?.source_doc_type ?? undefined,
    source_doc_id: initialData?.source_doc_id ?? undefined,
    source_doc_code: initialData?.source_doc_code ?? "",
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
        await MesDvRepairApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesDvRepairApi.create(formData as MesDvRepairCreateDTO)
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
            {isEdit ? "编辑MesDvRepair（源框架导入）" : "新增MesDvRepair（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">维修工单编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入维修工单编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">维修工单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入维修工单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备编号</label>
          <input
            type="number"
            value={formData.machinery_id != null ? String(formData.machinery_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, machinery_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报修日期</label>
          <input
            type="text"
            value={formData.require_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, require_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报修日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">维修完成日期</label>
          <input
            type="text"
            value={formData.finish_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, finish_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入维修完成日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">验收日期</label>
          <input
            type="text"
            value={formData.confirm_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirm_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入验收日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">维修结果</label>
          <input
            type="number"
            value={formData.result != null ? String(formData.result) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, result: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入维修结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">维修人用户编号</label>
          <input
            type="number"
            value={formData.accepted_user_id != null ? String(formData.accepted_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, accepted_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入维修人用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">验收人用户编号</label>
          <input
            type="number"
            value={formData.confirm_user_id != null ? String(formData.confirm_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirm_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入验收人用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据类型</label>
          <input
            type="number"
            value={formData.source_doc_type != null ? String(formData.source_doc_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_doc_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据编号</label>
          <input
            type="number"
            value={formData.source_doc_id != null ? String(formData.source_doc_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_doc_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据编码</label>
          <input
            type="text"
            value={formData.source_doc_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_doc_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据编码"
            
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
