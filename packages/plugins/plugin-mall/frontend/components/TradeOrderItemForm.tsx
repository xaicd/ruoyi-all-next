"use client"

import React, { useState, useEffect } from "react"
import { TradeOrderItemApi } from "../api/trade-order-item.api"
import type { TradeOrderItemCreateDTO, TradeOrderItemVO } from "@/modules/mall/backend/types/trade-order-item.types"

interface TradeOrderItemFormProps {
  open: boolean
  initialData?: TradeOrderItemVO | null
  onClose: () => void
  onSuccess: () => void
}

export function TradeOrderItemForm({ open, initialData, onClose, onSuccess }: TradeOrderItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    order_id: initialData?.order_id ?? undefined,
    cart_id: initialData?.cart_id ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    spu_name: initialData?.spu_name ?? "",
    sku_id: initialData?.sku_id ?? undefined,
    properties: initialData?.properties ?? "",
    pic_url: initialData?.pic_url ?? "",
    count: initialData?.count ?? undefined,
    comment_status: initialData?.comment_status ?? false,
    price: initialData?.price ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    delivery_price: initialData?.delivery_price ?? undefined,
    adjust_price: initialData?.adjust_price ?? undefined,
    pay_price: initialData?.pay_price ?? undefined,
    coupon_price: initialData?.coupon_price ?? undefined,
    point_price: initialData?.point_price ?? undefined,
    use_point: initialData?.use_point ?? undefined,
    give_point: initialData?.give_point ?? undefined,
    vip_price: initialData?.vip_price ?? undefined,
    after_sale_id: initialData?.after_sale_id ?? undefined,
    after_sale_status: initialData?.after_sale_status ?? undefined,
    property_id: initialData?.property_id ?? undefined,
    property_name: initialData?.property_name ?? "",
    value_id: initialData?.value_id ?? undefined,
    value_name: initialData?.value_name ?? "",
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
        await TradeOrderItemApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await TradeOrderItemApi.create(formData as TradeOrderItemCreateDTO)
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
            {isEdit ? "编辑TradeOrderItem（源框架导入）" : "新增TradeOrderItem（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
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
          <label className="block text-xs text-slate-600 mb-1">订单编号</label>
          <input
            type="number"
            value={formData.order_id != null ? String(formData.order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">购物车项编号</label>
          <input
            type="number"
            value={formData.cart_id != null ? String(formData.cart_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cart_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入购物车项编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">购买数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入购买数量"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="comment_status"
            checked={Boolean(formData.comment_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, comment_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="comment_status" className="text-xs text-slate-700 font-medium">是否评价</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品原价（单），单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品原价（单），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠金额（总），单位：分</label>
          <input
            type="number"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠金额（总），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">运费金额（总），单位：分</label>
          <input
            type="number"
            value={formData.delivery_price != null ? String(formData.delivery_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入运费金额（总），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单调价（总），单位：分</label>
          <input
            type="number"
            value={formData.adjust_price != null ? String(formData.adjust_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, adjust_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单调价（总），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">应付金额（总），单位：分</label>
          <input
            type="number"
            value={formData.pay_price != null ? String(formData.pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应付金额（总），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠劵减免金额，单位：分</label>
          <input
            type="number"
            value={formData.coupon_price != null ? String(formData.coupon_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, coupon_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠劵减免金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分抵扣的金额，单位：分</label>
          <input
            type="number"
            value={formData.point_price != null ? String(formData.point_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分抵扣的金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">使用的积分</label>
          <input
            type="number"
            value={formData.use_point != null ? String(formData.use_point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入使用的积分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赠送的积分</label>
          <input
            type="number"
            value={formData.give_point != null ? String(formData.give_point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, give_point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的积分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">VIP 减免金额，单位：分</label>
          <input
            type="number"
            value={formData.vip_price != null ? String(formData.vip_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, vip_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入VIP 减免金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后单编号</label>
          <input
            type="number"
            value={formData.after_sale_id != null ? String(formData.after_sale_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后状态</label>
          <input
            type="number"
            value={formData.after_sale_status != null ? String(formData.after_sale_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性编号</label>
          <input
            type="number"
            value={formData.property_id != null ? String(formData.property_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, property_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性名字</label>
          <input
            type="text"
            value={formData.property_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, property_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性名字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性值编号</label>
          <input
            type="number"
            value={formData.value_id != null ? String(formData.value_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, value_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性值编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性值名字</label>
          <input
            type="text"
            value={formData.value_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, value_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性值名字"
            
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
