"use client"

import React, { useState, useEffect } from "react"
import { TradeOrderApi } from "../api/trade-order.api"
import type { TradeOrderCreateDTO, TradeOrderVO } from "@/modules/mall/backend/types/trade-order.types"

interface TradeOrderFormProps {
  open: boolean
  initialData?: TradeOrderVO | null
  onClose: () => void
  onSuccess: () => void
}

export function TradeOrderForm({ open, initialData, onClose, onSuccess }: TradeOrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    type: initialData?.type ?? undefined,
    terminal: initialData?.terminal ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    user_ip: initialData?.user_ip ?? "",
    user_remark: initialData?.user_remark ?? "",
    status: initialData?.status ?? undefined,
    product_count: initialData?.product_count ?? undefined,
    finish_time: initialData?.finish_time ?? "",
    cancel_time: initialData?.cancel_time ?? "",
    cancel_type: initialData?.cancel_type ?? undefined,
    remark: initialData?.remark ?? "",
    comment_status: initialData?.comment_status ?? false,
    brokerage_user_id: initialData?.brokerage_user_id ?? undefined,
    pay_order_id: initialData?.pay_order_id ?? undefined,
    pay_status: initialData?.pay_status ?? false,
    pay_time: initialData?.pay_time ?? "",
    pay_channel_code: initialData?.pay_channel_code ?? "",
    total_price: initialData?.total_price ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    delivery_price: initialData?.delivery_price ?? undefined,
    adjust_price: initialData?.adjust_price ?? undefined,
    pay_price: initialData?.pay_price ?? undefined,
    delivery_type: initialData?.delivery_type ?? undefined,
    logistics_id: initialData?.logistics_id ?? undefined,
    logistics_no: initialData?.logistics_no ?? "",
    delivery_time: initialData?.delivery_time ?? "",
    receive_time: initialData?.receive_time ?? "",
    receiver_name: initialData?.receiver_name ?? "",
    receiver_mobile: initialData?.receiver_mobile ?? "",
    receiver_area_id: initialData?.receiver_area_id ?? undefined,
    receiver_detail_address: initialData?.receiver_detail_address ?? "",
    pick_up_store_id: initialData?.pick_up_store_id ?? undefined,
    pick_up_verify_code: initialData?.pick_up_verify_code ?? "",
    refund_status: initialData?.refund_status ?? undefined,
    refund_price: initialData?.refund_price ?? undefined,
    coupon_id: initialData?.coupon_id ?? undefined,
    coupon_price: initialData?.coupon_price ?? undefined,
    use_point: initialData?.use_point ?? undefined,
    point_price: initialData?.point_price ?? undefined,
    give_point: initialData?.give_point ?? undefined,
    refund_point: initialData?.refund_point ?? undefined,
    vip_price: initialData?.vip_price ?? undefined,
    give_coupon_template_counts: initialData?.give_coupon_template_counts ?? "",
    give_coupon_ids: initialData?.give_coupon_ids ?? "",
    seckill_activity_id: initialData?.seckill_activity_id ?? undefined,
    bargain_activity_id: initialData?.bargain_activity_id ?? undefined,
    bargain_record_id: initialData?.bargain_record_id ?? undefined,
    combination_activity_id: initialData?.combination_activity_id ?? undefined,
    combination_head_id: initialData?.combination_head_id ?? undefined,
    combination_record_id: initialData?.combination_record_id ?? undefined,
    point_activity_id: initialData?.point_activity_id ?? undefined,
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
        await TradeOrderApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await TradeOrderApi.create(formData as TradeOrderCreateDTO)
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
            {isEdit ? "编辑TradeOrder（源框架导入）" : "新增TradeOrder（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">订单流水号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单流水号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单来源</label>
          <input
            type="number"
            value={formData.terminal != null ? String(formData.terminal) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, terminal: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单来源"
            
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
          <label className="block text-xs text-slate-600 mb-1">用户 IP</label>
          <input
            type="text"
            value={formData.user_ip ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_ip: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户 IP"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户备注</label>
          <input
            type="text"
            value={formData.user_remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">购买的商品数量</label>
          <input
            type="number"
            value={formData.product_count != null ? String(formData.product_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入购买的商品数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单完成时间</label>
          <input
            type="text"
            value={formData.finish_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, finish_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单完成时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单取消时间</label>
          <input
            type="text"
            value={formData.cancel_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cancel_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单取消时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">取消类型</label>
          <input
            type="number"
            value={formData.cancel_type != null ? String(formData.cancel_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cancel_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入取消类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商家备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商家备注"
            
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
          <label className="block text-xs text-slate-600 mb-1">推广人编号</label>
          <input
            type="number"
            value={formData.brokerage_user_id != null ? String(formData.brokerage_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入推广人编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付订单编号</label>
          <input
            type="number"
            value={formData.pay_order_id != null ? String(formData.pay_order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付订单编号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pay_status"
            checked={Boolean(formData.pay_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="pay_status" className="text-xs text-slate-700 font-medium">是否已支付</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">付款时间</label>
          <input
            type="text"
            value={formData.pay_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入付款时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付渠道</label>
          <input
            type="text"
            value={formData.pay_channel_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_channel_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付渠道"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品原价，单位：分</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品原价，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠金额，单位：分</label>
          <input
            type="number"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">运费金额，单位：分</label>
          <input
            type="number"
            value={formData.delivery_price != null ? String(formData.delivery_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入运费金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单调价，单位：分</label>
          <input
            type="number"
            value={formData.adjust_price != null ? String(formData.adjust_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, adjust_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单调价，单位：分"
            
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
          <label className="block text-xs text-slate-600 mb-1">配送方式</label>
          <input
            type="number"
            value={formData.delivery_type != null ? String(formData.delivery_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发货物流公司编号</label>
          <input
            type="number"
            value={formData.logistics_id != null ? String(formData.logistics_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logistics_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发货物流公司编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发货物流单号</label>
          <input
            type="text"
            value={formData.logistics_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logistics_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发货物流单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发货时间</label>
          <input
            type="text"
            value={formData.delivery_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发货时间"
            
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
          <label className="block text-xs text-slate-600 mb-1">收件人名称</label>
          <input
            type="text"
            value={formData.receiver_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收件人名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收件人手机</label>
          <input
            type="text"
            value={formData.receiver_mobile ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_mobile: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收件人手机"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收件人地区编号</label>
          <input
            type="number"
            value={formData.receiver_area_id != null ? String(formData.receiver_area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收件人地区编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收件人详细地址</label>
          <input
            type="text"
            value={formData.receiver_detail_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_detail_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收件人详细地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自提门店编号</label>
          <input
            type="number"
            value={formData.pick_up_store_id != null ? String(formData.pick_up_store_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pick_up_store_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自提门店编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自提核销码</label>
          <input
            type="text"
            value={formData.pick_up_verify_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pick_up_verify_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自提核销码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后状态</label>
          <input
            type="number"
            value={formData.refund_status != null ? String(formData.refund_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款金额，单位：分</label>
          <input
            type="number"
            value={formData.refund_price != null ? String(formData.refund_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠劵编号</label>
          <input
            type="number"
            value={formData.coupon_id != null ? String(formData.coupon_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, coupon_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠劵编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">退还的使用的积分</label>
          <input
            type="number"
            value={formData.refund_point != null ? String(formData.refund_point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退还的使用的积分"
            
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
          <label className="block text-xs text-slate-600 mb-1">赠送的优惠劵</label>
          <input
            type="text"
            value={formData.give_coupon_template_counts ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, give_coupon_template_counts: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的优惠劵"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赠送的优惠劵编号</label>
          <input
            type="text"
            value={formData.give_coupon_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, give_coupon_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的优惠劵编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">秒杀活动编号</label>
          <input
            type="number"
            value={formData.seckill_activity_id != null ? String(formData.seckill_activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, seckill_activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入秒杀活动编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价活动编号</label>
          <input
            type="number"
            value={formData.bargain_activity_id != null ? String(formData.bargain_activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bargain_activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价活动编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">砍价记录编号</label>
          <input
            type="number"
            value={formData.bargain_record_id != null ? String(formData.bargain_record_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bargain_record_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入砍价记录编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团活动编号</label>
          <input
            type="number"
            value={formData.combination_activity_id != null ? String(formData.combination_activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, combination_activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团活动编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团团长编号</label>
          <input
            type="number"
            value={formData.combination_head_id != null ? String(formData.combination_head_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, combination_head_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团团长编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">拼团记录编号</label>
          <input
            type="number"
            value={formData.combination_record_id != null ? String(formData.combination_record_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, combination_record_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入拼团记录编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分商城活动的编号</label>
          <input
            type="number"
            value={formData.point_activity_id != null ? String(formData.point_activity_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point_activity_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分商城活动的编号"
            
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
