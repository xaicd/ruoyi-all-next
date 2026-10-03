"use client"

import React, { useState, useEffect } from "react"
import { MesQcIqcApi } from "../api/mes-qc-iqc.api"
import type { MesQcIqcCreateDTO, MesQcIqcVO } from "@/modules/mes/backend/types/mes-qc-iqc.types"

interface MesQcIqcFormProps {
  open: boolean
  initialData?: MesQcIqcVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesQcIqcForm({ open, initialData, onClose, onSuccess }: MesQcIqcFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    template_id: initialData?.template_id ?? undefined,
    source_doc_type: initialData?.source_doc_type ?? undefined,
    source_doc_id: initialData?.source_doc_id ?? undefined,
    source_line_id: initialData?.source_line_id ?? undefined,
    source_doc_code: initialData?.source_doc_code ?? "",
    vendor_id: initialData?.vendor_id ?? undefined,
    vendor_batch: initialData?.vendor_batch ?? "",
    item_id: initialData?.item_id ?? undefined,
    received_quantity: initialData?.received_quantity ?? undefined,
    check_quantity: initialData?.check_quantity ?? undefined,
    qualified_quantity: initialData?.qualified_quantity ?? undefined,
    unqualified_quantity: initialData?.unqualified_quantity ?? undefined,
    critical_rate: initialData?.critical_rate ?? undefined,
    major_rate: initialData?.major_rate ?? undefined,
    minor_rate: initialData?.minor_rate ?? undefined,
    critical_quantity: initialData?.critical_quantity ?? undefined,
    major_quantity: initialData?.major_quantity ?? undefined,
    minor_quantity: initialData?.minor_quantity ?? undefined,
    check_result: initialData?.check_result ?? undefined,
    receive_date: initialData?.receive_date ?? "",
    inspect_date: initialData?.inspect_date ?? "",
    inspector_user_id: initialData?.inspector_user_id ?? undefined,
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
        await MesQcIqcApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesQcIqcApi.create(formData as MesQcIqcCreateDTO)
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
            {isEdit ? "编辑MesQcIqc（源框架导入）" : "新增MesQcIqc（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">检验单编号</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检验单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检验单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检验单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检验模板 ID</label>
          <input
            type="number"
            value={formData.template_id != null ? String(formData.template_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, template_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检验模板 ID"
            
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
          <label className="block text-xs text-slate-600 mb-1">来源单据 ID</label>
          <input
            type="number"
            value={formData.source_doc_id != null ? String(formData.source_doc_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_doc_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据行 ID</label>
          <input
            type="number"
            value={formData.source_line_id != null ? String(formData.source_line_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_line_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据行 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据编号（冗余）</label>
          <input
            type="text"
            value={formData.source_doc_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_doc_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据编号（冗余）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商 ID</label>
          <input
            type="number"
            value={formData.vendor_id != null ? String(formData.vendor_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, vendor_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商批次号</label>
          <input
            type="text"
            value={formData.vendor_batch ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, vendor_batch: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商批次号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品物料 ID</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品物料 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">本次接收数量</label>
          <input
            type="number"
            value={formData.received_quantity != null ? String(formData.received_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, received_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入本次接收数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">本次检测数量</label>
          <input
            type="number"
            value={formData.check_quantity != null ? String(formData.check_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入本次检测数量"
            
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
          <label className="block text-xs text-slate-600 mb-1">不合格品数量</label>
          <input
            type="number"
            value={formData.unqualified_quantity != null ? String(formData.unqualified_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unqualified_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入不合格品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">致命缺陷率（%）</label>
          <input
            type="number"
            value={formData.critical_rate != null ? String(formData.critical_rate) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, critical_rate: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入致命缺陷率（%）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">严重缺陷率（%）</label>
          <input
            type="number"
            value={formData.major_rate != null ? String(formData.major_rate) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, major_rate: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入严重缺陷率（%）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">轻微缺陷率（%）</label>
          <input
            type="number"
            value={formData.minor_rate != null ? String(formData.minor_rate) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, minor_rate: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入轻微缺陷率（%）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">致命缺陷数量</label>
          <input
            type="number"
            value={formData.critical_quantity != null ? String(formData.critical_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, critical_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入致命缺陷数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">严重缺陷数量</label>
          <input
            type="number"
            value={formData.major_quantity != null ? String(formData.major_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, major_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入严重缺陷数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">轻微缺陷数量</label>
          <input
            type="number"
            value={formData.minor_quantity != null ? String(formData.minor_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, minor_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入轻微缺陷数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检测结果</label>
          <input
            type="number"
            value={formData.check_result != null ? String(formData.check_result) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_result: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检测结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来料日期</label>
          <input
            type="text"
            value={formData.receive_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receive_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来料日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检测日期</label>
          <input
            type="text"
            value={formData.inspect_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, inspect_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检测日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检测人员用户 ID</label>
          <input
            type="number"
            value={formData.inspector_user_id != null ? String(formData.inspector_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, inspector_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检测人员用户 ID"
            
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
