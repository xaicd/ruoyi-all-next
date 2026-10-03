"use client"

import React, { useState, useEffect } from "react"
import { MesWmProductSalesApi } from "../api/mes-wm-product-sales.api"
import type { MesWmProductSalesCreateDTO, MesWmProductSalesVO } from "@/modules/mes/backend/types/mes-wm-product-sales.types"

interface MesWmProductSalesFormProps {
  open: boolean
  initialData?: MesWmProductSalesVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmProductSalesForm({ open, initialData, onClose, onSuccess }: MesWmProductSalesFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    client_id: initialData?.client_id ?? undefined,
    sales_order_code: initialData?.sales_order_code ?? "",
    notice_id: initialData?.notice_id ?? undefined,
    sales_date: initialData?.sales_date ?? "",
    contact_name: initialData?.contact_name ?? "",
    contact_telephone: initialData?.contact_telephone ?? "",
    contact_address: initialData?.contact_address ?? "",
    carrier: initialData?.carrier ?? "",
    shipping_number: initialData?.shipping_number ?? "",
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
        await MesWmProductSalesApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmProductSalesApi.create(formData as MesWmProductSalesCreateDTO)
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
            {isEdit ? "编辑MesWmProductSales（源框架导入）" : "新增MesWmProductSales（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">出库单号</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出库单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出库单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出库单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户ID</label>
          <input
            type="number"
            value={formData.client_id != null ? String(formData.client_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售订单号</label>
          <input
            type="text"
            value={formData.sales_order_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_order_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售订单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发货通知单 ID</label>
          <input
            type="number"
            value={formData.notice_id != null ? String(formData.notice_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notice_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发货通知单 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出库日期</label>
          <input
            type="text"
            value={formData.sales_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出库日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人</label>
          <input
            type="text"
            value={formData.contact_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系电话</label>
          <input
            type="text"
            value={formData.contact_telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收货地址</label>
          <input
            type="text"
            value={formData.contact_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收货地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">承运商</label>
          <input
            type="text"
            value={formData.carrier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, carrier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入承运商"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">运输单号</label>
          <input
            type="text"
            value={formData.shipping_number ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shipping_number: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入运输单号"
            
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
