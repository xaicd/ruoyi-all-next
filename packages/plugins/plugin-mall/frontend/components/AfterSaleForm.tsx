"use client"

import React, { useState, useEffect } from "react"
import { AfterSaleApi } from "../api/after-sale.api"
import type { AfterSaleCreateDTO, AfterSaleVO } from "@/modules/mall/backend/types/after-sale.types"

interface AfterSaleFormProps {
  open: boolean
  initialData?: AfterSaleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AfterSaleForm({ open, initialData, onClose, onSuccess }: AfterSaleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    status: initialData?.status ?? undefined,
    way: initialData?.way ?? undefined,
    type: initialData?.type ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    apply_reason: initialData?.apply_reason ?? "",
    apply_description: initialData?.apply_description ?? "",
    apply_pic_urls: initialData?.apply_pic_urls ?? "",
    order_id: initialData?.order_id ?? undefined,
    order_no: initialData?.order_no ?? "",
    order_item_id: initialData?.order_item_id ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    spu_name: initialData?.spu_name ?? "",
    sku_id: initialData?.sku_id ?? undefined,
    properties: initialData?.properties ?? "",
    pic_url: initialData?.pic_url ?? "",
    count: initialData?.count ?? undefined,
    audit_time: initialData?.audit_time ?? "",
    audit_user_id: initialData?.audit_user_id ?? undefined,
    audit_reason: initialData?.audit_reason ?? "",
    refund_price: initialData?.refund_price ?? undefined,
    pay_refund_id: initialData?.pay_refund_id ?? undefined,
    refund_time: initialData?.refund_time ?? "",
    logistics_id: initialData?.logistics_id ?? undefined,
    logistics_no: initialData?.logistics_no ?? "",
    delivery_time: initialData?.delivery_time ?? "",
    receive_time: initialData?.receive_time ?? "",
    receive_reason: initialData?.receive_reason ?? "",
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
        await AfterSaleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AfterSaleApi.create(formData as AfterSaleCreateDTO)
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
            {isEdit ? "编辑AfterSale（源框架导入）" : "新增AfterSale（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">售后单号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后方式</label>
          <input
            type="number"
            value={formData.way != null ? String(formData.way) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, way: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">申请原因</label>
          <input
            type="text"
            value={formData.apply_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, apply_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入申请原因"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">补充描述</label>
          <input
            type="text"
            value={formData.apply_description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, apply_description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入补充描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">补充凭证图片</label>
          <input
            type="text"
            value={formData.apply_pic_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, apply_pic_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入补充凭证图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">交易订单编号</label>
          <input
            type="number"
            value={formData.order_id != null ? String(formData.order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入交易订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单流水号</label>
          <input
            type="text"
            value={formData.order_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单流水号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">交易订单项编号</label>
          <input
            type="number"
            value={formData.order_item_id != null ? String(formData.order_item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入交易订单项编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品 SPU 编号</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SPU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品 SPU 名称</label>
          <input
            type="text"
            value={formData.spu_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SPU 名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品 SKU 编号</label>
          <input
            type="number"
            value={formData.sku_id != null ? String(formData.sku_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SKU 编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性数组，JSON 格式</label>
          <input
            type="text"
            value={formData.properties ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, properties: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性数组，JSON 格式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品图片</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货商品数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货商品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审批时间</label>
          <input
            type="text"
            value={formData.audit_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审批时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审批人</label>
          <input
            type="number"
            value={formData.audit_user_id != null ? String(formData.audit_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审批人"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审批备注</label>
          <input
            type="text"
            value={formData.audit_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审批备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款金额，单位：分。</label>
          <input
            type="number"
            value={formData.refund_price != null ? String(formData.refund_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款金额，单位：分。"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付退款编号</label>
          <input
            type="number"
            value={formData.pay_refund_id != null ? String(formData.pay_refund_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_refund_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付退款编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款时间</label>
          <input
            type="text"
            value={formData.refund_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货物流公司编号</label>
          <input
            type="number"
            value={formData.logistics_id != null ? String(formData.logistics_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logistics_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货物流公司编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货物流单号</label>
          <input
            type="text"
            value={formData.logistics_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logistics_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货物流单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货时间</label>
          <input
            type="text"
            value={formData.delivery_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收货时间</label>
          <input
            type="text"
            value={formData.receive_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receive_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收货时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收货备注</label>
          <input
            type="text"
            value={formData.receive_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receive_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收货备注"
            
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
