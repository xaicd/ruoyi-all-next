"use client"

import React, { useState, useEffect } from "react"
import { MemberConfigApi } from "../api/member-config.api"
import type { MemberConfigCreateDTO, MemberConfigVO } from "@/modules/member/backend/types/member-config.types"

interface MemberConfigFormProps {
  open: boolean
  initialData?: MemberConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MemberConfigForm({ open, initialData, onClose, onSuccess }: MemberConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    point_trade_deduct_enable: initialData?.point_trade_deduct_enable ?? false,
    point_trade_deduct_unit_price: initialData?.point_trade_deduct_unit_price ?? undefined,
    point_trade_deduct_max_price: initialData?.point_trade_deduct_max_price ?? undefined,
    point_trade_give_point: initialData?.point_trade_give_point ?? undefined,
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
        await MemberConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MemberConfigApi.create(formData as MemberConfigCreateDTO)
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
            {isEdit ? "编辑MemberConfig（源框架导入）" : "新增MemberConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="point_trade_deduct_enable"
            checked={Boolean(formData.point_trade_deduct_enable)}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_trade_deduct_enable: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="point_trade_deduct_enable" className="text-xs text-slate-700 font-medium">积分抵扣开关</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分抵扣，单位：分</label>
          <input
            type="number"
            value={formData.point_trade_deduct_unit_price != null ? String(formData.point_trade_deduct_unit_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_trade_deduct_unit_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分抵扣，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分抵扣最大值</label>
          <input
            type="number"
            value={formData.point_trade_deduct_max_price != null ? String(formData.point_trade_deduct_max_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_trade_deduct_max_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分抵扣最大值"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">1 元赠送多少分</label>
          <input
            type="number"
            value={formData.point_trade_give_point != null ? String(formData.point_trade_give_point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_trade_give_point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入1 元赠送多少分"
            
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
