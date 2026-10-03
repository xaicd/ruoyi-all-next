"use client"

import React, { useState, useEffect } from "react"
import { DeliveryPickUpStoreApi } from "../api/delivery-pick-up-store.api"
import type { DeliveryPickUpStoreCreateDTO, DeliveryPickUpStoreVO } from "@/modules/mall/backend/types/delivery-pick-up-store.types"

interface DeliveryPickUpStoreFormProps {
  open: boolean
  initialData?: DeliveryPickUpStoreVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DeliveryPickUpStoreForm({ open, initialData, onClose, onSuccess }: DeliveryPickUpStoreFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    introduction: initialData?.introduction ?? "",
    phone: initialData?.phone ?? "",
    area_id: initialData?.area_id ?? undefined,
    detail_address: initialData?.detail_address ?? "",
    logo: initialData?.logo ?? "",
    opening_time: initialData?.opening_time ?? "",
    closing_time: initialData?.closing_time ?? "",
    latitude: initialData?.latitude ?? undefined,
    longitude: initialData?.longitude ?? undefined,
    verify_user_ids: initialData?.verify_user_ids ?? "",
    status: initialData?.status ?? undefined,
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
        await DeliveryPickUpStoreApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DeliveryPickUpStoreApi.create(formData as DeliveryPickUpStoreCreateDTO)
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
            {isEdit ? "编辑DeliveryPickUpStore（源框架导入）" : "新增DeliveryPickUpStore（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">门店名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">门店简介</label>
          <input
            type="text"
            value={formData.introduction ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, introduction: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店简介"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">门店手机</label>
          <input
            type="text"
            value={formData.phone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店手机"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">区域编号</label>
          <input
            type="number"
            value={formData.area_id != null ? String(formData.area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入区域编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">门店详细地址</label>
          <input
            type="text"
            value={formData.detail_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, detail_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店详细地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">门店 logo</label>
          <input
            type="text"
            value={formData.logo ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店 logo"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">营业开始时间</label>
          <input
            type="text"
            value={formData.opening_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, opening_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入营业开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">营业结束时间</label>
          <input
            type="text"
            value={formData.closing_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, closing_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入营业结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">纬度</label>
          <input
            type="number"
            value={formData.latitude != null ? String(formData.latitude) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入纬度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">经度</label>
          <input
            type="number"
            value={formData.longitude != null ? String(formData.longitude) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入经度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">核销员工用户编号数组</label>
          <input
            type="text"
            value={formData.verify_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, verify_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入核销员工用户编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">门店状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入门店状态"
            
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
