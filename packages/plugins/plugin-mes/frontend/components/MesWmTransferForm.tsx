"use client"

import React, { useState, useEffect } from "react"
import { MesWmTransferApi } from "../api/mes-wm-transfer.api"
import type { MesWmTransferCreateDTO, MesWmTransferVO } from "@/modules/mes/backend/types/mes-wm-transfer.types"

interface MesWmTransferFormProps {
  open: boolean
  initialData?: MesWmTransferVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmTransferForm({ open, initialData, onClose, onSuccess }: MesWmTransferFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    type: initialData?.type ?? undefined,
    delivery_flag: initialData?.delivery_flag ?? false,
    recipient_name: initialData?.recipient_name ?? "",
    recipient_telephone: initialData?.recipient_telephone ?? "",
    destination_address: initialData?.destination_address ?? "",
    carrier: initialData?.carrier ?? "",
    shipping_number: initialData?.shipping_number ?? "",
    confirm_flag: initialData?.confirm_flag ?? false,
    transfer_date: initialData?.transfer_date ?? "",
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
        await MesWmTransferApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmTransferApi.create(formData as MesWmTransferCreateDTO)
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
    <div data-testid="mes-wm-transfer-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑MES 转移单" : "新增MES 转移单"}
        data-testid="mes-wm-transfer-form"
        data-agent-scope="mes-wm-transfer:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑MES 转移单" : "新增MES 转移单"}
          </h3>
          <button onClick={onClose} data-testid="mes-wm-transfer-form-close" data-agent-target="mes-wm-transfer:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="mes-wm-transfer-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="mes-wm-transfer-code" className="block text-xs text-slate-600 mb-1">转移单编号</label>
          <input
            type="text"
            id="mes-wm-transfer-code"
            data-testid="field-code"
            data-agent-target="mes-wm-transfer:field:code"
            data-agent-state={formData.code ? "filled" : "empty"}
            aria-label="转移单编号"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移单编号"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-name" className="block text-xs text-slate-600 mb-1">转移单名称</label>
          <input
            type="text"
            id="mes-wm-transfer-name"
            data-testid="field-name"
            data-agent-target="mes-wm-transfer:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="转移单名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移单名称"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-type" className="block text-xs text-slate-600 mb-1">转移单类型</label>
          <input
            type="number"
            id="mes-wm-transfer-type"
            data-testid="field-type"
            data-agent-target="mes-wm-transfer:field:type"
            data-agent-state={formData.type == null || formData.type === "" ? "empty" : "filled"}
            aria-label="转移单类型"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移单类型"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mes-wm-transfer-delivery_flag"
            data-testid="field-delivery_flag"
            data-agent-target="mes-wm-transfer:field:delivery_flag"
            data-agent-state={formData.delivery_flag ? "on" : "off"}
            aria-label="是否配送"
            checked={Boolean(formData.delivery_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mes-wm-transfer-delivery_flag" className="text-xs text-slate-700 font-medium">是否配送</label>
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-recipient_name" className="block text-xs text-slate-600 mb-1">收货人</label>
          <input
            type="text"
            id="mes-wm-transfer-recipient_name"
            data-testid="field-recipient_name"
            data-agent-target="mes-wm-transfer:field:recipient_name"
            data-agent-state={formData.recipient_name ? "filled" : "empty"}
            aria-label="收货人"
            value={formData.recipient_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recipient_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收货人"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-recipient_telephone" className="block text-xs text-slate-600 mb-1">联系方式</label>
          <input
            type="text"
            id="mes-wm-transfer-recipient_telephone"
            data-testid="field-recipient_telephone"
            data-agent-target="mes-wm-transfer:field:recipient_telephone"
            data-agent-state={formData.recipient_telephone ? "filled" : "empty"}
            aria-label="联系方式"
            value={formData.recipient_telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recipient_telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系方式"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-destination_address" className="block text-xs text-slate-600 mb-1">目的地</label>
          <input
            type="text"
            id="mes-wm-transfer-destination_address"
            data-testid="field-destination_address"
            data-agent-target="mes-wm-transfer:field:destination_address"
            data-agent-state={formData.destination_address ? "filled" : "empty"}
            aria-label="目的地"
            value={formData.destination_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, destination_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入目的地"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-carrier" className="block text-xs text-slate-600 mb-1">承运商</label>
          <input
            type="text"
            id="mes-wm-transfer-carrier"
            data-testid="field-carrier"
            data-agent-target="mes-wm-transfer:field:carrier"
            data-agent-state={formData.carrier ? "filled" : "empty"}
            aria-label="承运商"
            value={formData.carrier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, carrier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入承运商"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-shipping_number" className="block text-xs text-slate-600 mb-1">运输单号</label>
          <input
            type="text"
            id="mes-wm-transfer-shipping_number"
            data-testid="field-shipping_number"
            data-agent-target="mes-wm-transfer:field:shipping_number"
            data-agent-state={formData.shipping_number ? "filled" : "empty"}
            aria-label="运输单号"
            value={formData.shipping_number ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shipping_number: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入运输单号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mes-wm-transfer-confirm_flag"
            data-testid="field-confirm_flag"
            data-agent-target="mes-wm-transfer:field:confirm_flag"
            data-agent-state={formData.confirm_flag ? "on" : "off"}
            aria-label="是否已确认"
            checked={Boolean(formData.confirm_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, confirm_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mes-wm-transfer-confirm_flag" className="text-xs text-slate-700 font-medium">是否已确认</label>
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-transfer_date" className="block text-xs text-slate-600 mb-1">转移日期</label>
          <input
            type="text"
            id="mes-wm-transfer-transfer_date"
            data-testid="field-transfer_date"
            data-agent-target="mes-wm-transfer:field:transfer_date"
            data-agent-state={formData.transfer_date ? "filled" : "empty"}
            aria-label="转移日期"
            value={formData.transfer_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移日期"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="mes-wm-transfer-status"
            data-testid="field-status"
            data-agent-target="mes-wm-transfer:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="mes-wm-transfer-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="mes-wm-transfer-remark"
            data-testid="field-remark"
            data-agent-target="mes-wm-transfer:field:remark"
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
              data-testid="mes-wm-transfer-form-cancel"
              data-agent-target="mes-wm-transfer:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="mes-wm-transfer-form-submit"
              data-agent-target="mes-wm-transfer:submit"
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
