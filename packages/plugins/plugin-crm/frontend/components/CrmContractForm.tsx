"use client"

import React, { useState, useEffect } from "react"
import { CrmContractApi } from "../api/crm-contract.api"
import type { CrmContractCreateDTO, CrmContractVO } from "@/modules/crm/backend/types/crm-contract.types"

interface CrmContractFormProps {
  open: boolean
  initialData?: CrmContractVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmContractForm({ open, initialData, onClose, onSuccess }: CrmContractFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    no: initialData?.no ?? "",
    customer_id: initialData?.customer_id ?? undefined,
    business_id: initialData?.business_id ?? undefined,
    contact_last_time: initialData?.contact_last_time ?? "",
    owner_user_id: initialData?.owner_user_id ?? undefined,
    process_instance_id: initialData?.process_instance_id ?? "",
    audit_status: initialData?.audit_status ?? undefined,
    order_date: initialData?.order_date ?? "",
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    total_product_price: initialData?.total_product_price ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    total_price: initialData?.total_price ?? undefined,
    sign_contact_id: initialData?.sign_contact_id ?? undefined,
    sign_user_id: initialData?.sign_user_id ?? undefined,
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
        await CrmContractApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmContractApi.create(formData as CrmContractCreateDTO)
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
            {isEdit ? "编辑CrmContract（源框架导入）" : "新增CrmContract（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">合同名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合同名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合同编号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合同编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">商机编号，非必须</label>
          <input
            type="number"
            value={formData.business_id != null ? String(formData.business_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, business_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机编号，非必须"
            
          />
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

        <div>
          <label className="block text-xs text-slate-600 mb-1">下单日期</label>
          <input
            type="text"
            value={formData.order_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下单日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
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
          <label className="block text-xs text-slate-600 mb-1">整单折扣</label>
          <input
            type="number"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入整单折扣"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合同总金额，单位：分</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合同总金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户签约人，非必须</label>
          <input
            type="number"
            value={formData.sign_contact_id != null ? String(formData.sign_contact_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sign_contact_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户签约人，非必须"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公司签约人，非必须</label>
          <input
            type="number"
            value={formData.sign_user_id != null ? String(formData.sign_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sign_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公司签约人，非必须"
            
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
