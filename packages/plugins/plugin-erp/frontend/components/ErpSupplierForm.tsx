"use client"

import React, { useState, useEffect } from "react"
import { ErpSupplierApi } from "../api/erp-supplier.api"
import type { ErpSupplierCreateDTO, ErpSupplierVO } from "@/modules/erp/backend/types/erp-supplier.types"

interface ErpSupplierFormProps {
  open: boolean
  initialData?: ErpSupplierVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpSupplierForm({ open, initialData, onClose, onSuccess }: ErpSupplierFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    contact: initialData?.contact ?? "",
    mobile: initialData?.mobile ?? "",
    telephone: initialData?.telephone ?? "",
    email: initialData?.email ?? "",
    fax: initialData?.fax ?? "",
    remark: initialData?.remark ?? "",
    status: initialData?.status ?? undefined,
    sort: initialData?.sort ?? undefined,
    tax_no: initialData?.tax_no ?? "",
    tax_percent: initialData?.tax_percent ?? undefined,
    bank_name: initialData?.bank_name ?? "",
    bank_account: initialData?.bank_account ?? "",
    bank_address: initialData?.bank_address ?? "",
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
        await ErpSupplierApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpSupplierApi.create(formData as ErpSupplierCreateDTO)
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
            {isEdit ? "编辑ErpSupplier（源框架导入）" : "新增ErpSupplier（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人</label>
          <input
            type="text"
            value={formData.contact ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">手机号码</label>
          <input
            type="text"
            value={formData.mobile ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入手机号码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系电话</label>
          <input
            type="text"
            value={formData.telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">电子邮箱</label>
          <input
            type="text"
            value={formData.email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入电子邮箱"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">传真</label>
          <input
            type="text"
            value={formData.fax ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, fax: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入传真"
            
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
          <label className="block text-xs text-slate-600 mb-1">开启状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开启状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">纳税人识别号</label>
          <input
            type="text"
            value={formData.tax_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tax_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入纳税人识别号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">税率</label>
          <input
            type="number"
            value={formData.tax_percent != null ? String(formData.tax_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tax_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入税率"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开户行</label>
          <input
            type="text"
            value={formData.bank_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bank_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开户行"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开户账号</label>
          <input
            type="text"
            value={formData.bank_account ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bank_account: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开户账号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开户地址</label>
          <input
            type="text"
            value={formData.bank_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bank_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开户地址"
            
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
