"use client"

import React, { useState, useEffect } from "react"
import { MesWmPackageApi } from "../api/mes-wm-package.api"
import type { MesWmPackageCreateDTO, MesWmPackageVO } from "@/modules/mes/backend/types/mes-wm-package.types"

interface MesWmPackageFormProps {
  open: boolean
  initialData?: MesWmPackageVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmPackageForm({ open, initialData, onClose, onSuccess }: MesWmPackageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    parent_id: initialData?.parent_id ?? undefined,
    package_date: initialData?.package_date ?? "",
    sales_order_code: initialData?.sales_order_code ?? "",
    invoice_code: initialData?.invoice_code ?? "",
    client_id: initialData?.client_id ?? undefined,
    length: initialData?.length ?? undefined,
    width: initialData?.width ?? undefined,
    height: initialData?.height ?? undefined,
    size_unit_id: initialData?.size_unit_id ?? undefined,
    net_weight: initialData?.net_weight ?? undefined,
    gross_weight: initialData?.gross_weight ?? undefined,
    weight_unit_id: initialData?.weight_unit_id ?? undefined,
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
        await MesWmPackageApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmPackageApi.create(formData as MesWmPackageCreateDTO)
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
            {isEdit ? "编辑MesWmPackage（源框架导入）" : "新增MesWmPackage（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">装箱单编号</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入装箱单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">父箱 ID</label>
          <input
            type="number"
            value={formData.parent_id != null ? String(formData.parent_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入父箱 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">装箱日期</label>
          <input
            type="text"
            value={formData.package_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, package_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入装箱日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售订单编号</label>
          <input
            type="text"
            value={formData.sales_order_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_order_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发票编号</label>
          <input
            type="text"
            value={formData.invoice_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, invoice_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发票编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户 ID</label>
          <input
            type="number"
            value={formData.client_id != null ? String(formData.client_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">箱长度</label>
          <input
            type="number"
            value={formData.length != null ? String(formData.length) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入箱长度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">箱宽度</label>
          <input
            type="number"
            value={formData.width != null ? String(formData.width) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入箱宽度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">箱高度</label>
          <input
            type="number"
            value={formData.height != null ? String(formData.height) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入箱高度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">尺寸单位 ID</label>
          <input
            type="number"
            value={formData.size_unit_id != null ? String(formData.size_unit_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, size_unit_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入尺寸单位 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">净重</label>
          <input
            type="number"
            value={formData.net_weight != null ? String(formData.net_weight) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, net_weight: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入净重"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">毛重</label>
          <input
            type="number"
            value={formData.gross_weight != null ? String(formData.gross_weight) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, gross_weight: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入毛重"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">重量单位 ID</label>
          <input
            type="number"
            value={formData.weight_unit_id != null ? String(formData.weight_unit_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight_unit_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入重量单位 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检查员用户 ID</label>
          <input
            type="number"
            value={formData.inspector_user_id != null ? String(formData.inspector_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, inspector_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检查员用户 ID"
            
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
