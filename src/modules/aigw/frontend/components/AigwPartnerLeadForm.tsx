"use client"

import React, { useState, useEffect } from "react"
import { AigwPartnerLeadApi } from "../api/aigw-partner-lead.api"
import type { AigwPartnerLeadCreateDTO, AigwPartnerLeadVO } from "@/modules/aigw/backend/types/aigw-partner-lead.types"

interface AigwPartnerLeadFormProps {
  open: boolean
  initialData?: AigwPartnerLeadVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AigwPartnerLeadForm({ open, initialData, onClose, onSuccess }: AigwPartnerLeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    lead_no: initialData?.lead_no ?? "",
    partner_id: initialData?.partner_id ?? "",
    partner_name: initialData?.partner_name ?? "",
    customer_name: initialData?.customer_name ?? "",
    credit_code: initialData?.credit_code ?? "",
    contact_name: initialData?.contact_name ?? "",
    contact_phone: initialData?.contact_phone ?? "",
    estimated_scale: initialData?.estimated_scale ?? "",
    estimated_amount: initialData?.estimated_amount ?? undefined,
    protection_days: initialData?.protection_days ?? undefined,
    expire_at: initialData?.expire_at ?? "",
    status: initialData?.status ?? "",
    converted_enterprise_id: initialData?.converted_enterprise_id ?? "",
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
        await AigwPartnerLeadApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AigwPartnerLeadApi.create(formData as AigwPartnerLeadCreateDTO)
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
            {isEdit ? "编辑商机报备与锁定" : "新增商机报备与锁定"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">商机报备编号 *</label>
          <input
            type="text"
            value={formData.lead_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, lead_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机报备编号"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报备代理商ID *</label>
          <input
            type="text"
            value={formData.partner_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, partner_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报备代理商ID"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">代理商名称 *</label>
          <input
            type="text"
            value={formData.partner_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, partner_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入代理商名称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">报备政企客户全称 *</label>
          <input
            type="text"
            value={formData.customer_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入报备政企客户全称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户统一信用代码(排他查重) *</label>
          <input
            type="text"
            value={formData.credit_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, credit_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户统一信用代码(排他查重)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户联系人</label>
          <input
            type="text"
            value={formData.contact_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户联系人"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户联系电话</label>
          <input
            type="text"
            value={formData.contact_phone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户联系电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">预计采购规模</label>
          <input
            type="text"
            value={formData.estimated_scale ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, estimated_scale: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入预计采购规模"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">预估合同金额(元)</label>
          <input
            type="number"
            value={formData.estimated_amount != null ? String(formData.estimated_amount) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, estimated_amount: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入预估合同金额(元)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机保护期(天) *</label>
          <input
            type="number"
            value={formData.protection_days != null ? String(formData.protection_days) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, protection_days: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机保护期(天)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">保护到期时间 *</label>
          <input
            type="text"
            value={formData.expire_at ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_at: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保护到期时间"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机状态(PROTECTED/CONVERTED/EXPIRED/REJECTED) *</label>
          <input
            type="text"
            value={formData.status ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机状态(PROTECTED/CONVERTED/EXPIRED/REJECTED)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转签约后企业ID</label>
          <input
            type="text"
            value={formData.converted_enterprise_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, converted_enterprise_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转签约后企业ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">跟进说明</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入跟进说明"
            
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
