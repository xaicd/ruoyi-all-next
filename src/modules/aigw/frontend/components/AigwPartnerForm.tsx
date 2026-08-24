"use client"

import React, { useState, useEffect } from "react"
import { AigwPartnerApi } from "../api/aigw-partner.api"
import type { AigwPartnerCreateDTO, AigwPartnerVO } from "@/modules/aigw/backend/types/aigw-partner.types"

interface AigwPartnerFormProps {
  open: boolean
  initialData?: AigwPartnerVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AigwPartnerForm({ open, initialData, onClose, onSuccess }: AigwPartnerFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    partner_code: initialData?.partner_code ?? "",
    name: initialData?.name ?? "",
    level: initialData?.level ?? "",
    registered_capital: initialData?.registered_capital ?? undefined,
    credit_code: initialData?.credit_code ?? "",
    contact_name: initialData?.contact_name ?? "",
    contact_phone: initialData?.contact_phone ?? "",
    region: initialData?.region ?? "",
    commission_rate: initialData?.commission_rate ?? undefined,
    promo_code: initialData?.promo_code ?? "",
    balance: initialData?.balance ?? undefined,
    total_commission: initialData?.total_commission ?? undefined,
    status: initialData?.status ?? "",
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
        await AigwPartnerApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AigwPartnerApi.create(formData as AigwPartnerCreateDTO)
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
            {isEdit ? "编辑渠道代理商" : "新增渠道代理商"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">代理商编号 *</label>
          <input
            type="text"
            value={formData.partner_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, partner_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入代理商编号"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">代理商公司全称 *</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入代理商公司全称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">代理等级(GOLD/SILVER/BRONZE/GENERAL) *</label>
          <input
            type="text"
            value={formData.level ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入代理等级(GOLD/SILVER/BRONZE/GENERAL)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">注册资金(万元) *</label>
          <input
            type="number"
            value={formData.registered_capital != null ? String(formData.registered_capital) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, registered_capital: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入注册资金(万元)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">统一社会信用代码 *</label>
          <input
            type="text"
            value={formData.credit_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, credit_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入统一社会信用代码"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人姓名 *</label>
          <input
            type="text"
            value={formData.contact_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人姓名"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人手机号 *</label>
          <input
            type="text"
            value={formData.contact_phone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人手机号"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">代理区域</label>
          <input
            type="text"
            value={formData.region ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入代理区域"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">签约分润比例 *</label>
          <input
            type="number"
            value={formData.commission_rate != null ? String(formData.commission_rate) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, commission_rate: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入签约分润比例"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">专属推广工号/短链码 *</label>
          <input
            type="text"
            value={formData.promo_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, promo_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入专属推广工号/短链码"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">当前可提现佣金(元) *</label>
          <input
            type="number"
            value={formData.balance != null ? String(formData.balance) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, balance: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入当前可提现佣金(元)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">累计总佣金(元) *</label>
          <input
            type="number"
            value={formData.total_commission != null ? String(formData.total_commission) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_commission: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入累计总佣金(元)"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合作状态 *</label>
          <input
            type="text"
            value={formData.status ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合作状态"
            required
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
