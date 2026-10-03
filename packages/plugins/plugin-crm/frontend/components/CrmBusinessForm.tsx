"use client"

import React, { useState, useEffect } from "react"
import { CrmBusinessApi } from "../api/crm-business.api"
import type { CrmBusinessCreateDTO, CrmBusinessVO } from "@/modules/crm/backend/types/crm-business.types"

interface CrmBusinessFormProps {
  open: boolean
  initialData?: CrmBusinessVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmBusinessForm({ open, initialData, onClose, onSuccess }: CrmBusinessFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    customer_id: initialData?.customer_id ?? undefined,
    follow_up_status: initialData?.follow_up_status ?? false,
    contact_last_time: initialData?.contact_last_time ?? "",
    contact_next_time: initialData?.contact_next_time ?? "",
    owner_user_id: initialData?.owner_user_id ?? undefined,
    status_type_id: initialData?.status_type_id ?? undefined,
    status_id: initialData?.status_id ?? undefined,
    end_status: initialData?.end_status ?? undefined,
    end_remark: initialData?.end_remark ?? "",
    deal_time: initialData?.deal_time ?? "",
    total_product_price: initialData?.total_product_price ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    total_price: initialData?.total_price ?? undefined,
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
        await CrmBusinessApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmBusinessApi.create(formData as CrmBusinessCreateDTO)
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
            {isEdit ? "编辑CrmBusiness（源框架导入）" : "新增CrmBusiness（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">商机名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机名称"
            
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="follow_up_status"
            checked={Boolean(formData.follow_up_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, follow_up_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="follow_up_status" className="text-xs text-slate-700 font-medium">跟进状态</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后跟进时间</label>
          <input
            type="text"
            value={formData.contact_last_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_last_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后跟进时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下次联系时间</label>
          <input
            type="text"
            value={formData.contact_next_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_next_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下次联系时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人的用户编号</label>
          <input
            type="number"
            value={formData.owner_user_id != null ? String(formData.owner_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人的用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机状态组编号</label>
          <input
            type="number"
            value={formData.status_type_id != null ? String(formData.status_type_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status_type_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机状态组编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机状态编号</label>
          <input
            type="number"
            value={formData.status_id != null ? String(formData.status_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机状态编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束状态</label>
          <input
            type="number"
            value={formData.end_status != null ? String(formData.end_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时的备注</label>
          <input
            type="text"
            value={formData.end_remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时的备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">预计成交日期</label>
          <input
            type="text"
            value={formData.deal_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, deal_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入预计成交日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品总金额，单位：元</label>
          <input
            type="number"
            value={formData.total_product_price != null ? String(formData.total_product_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_product_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品总金额，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">整单折扣，百分比</label>
          <input
            type="number"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入整单折扣，百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机总金额，单位：元</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机总金额，单位：元"
            
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
