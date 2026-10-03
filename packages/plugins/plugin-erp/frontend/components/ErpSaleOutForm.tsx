"use client"

import React, { useState, useEffect } from "react"
import { ErpSaleOutApi } from "../api/erp-sale-out.api"
import type { ErpSaleOutCreateDTO, ErpSaleOutVO } from "@/modules/erp/backend/types/erp-sale-out.types"

interface ErpSaleOutFormProps {
  open: boolean
  initialData?: ErpSaleOutVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpSaleOutForm({ open, initialData, onClose, onSuccess }: ErpSaleOutFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    status: initialData?.status ?? undefined,
    customer_id: initialData?.customer_id ?? undefined,
    account_id: initialData?.account_id ?? undefined,
    sale_user_id: initialData?.sale_user_id ?? undefined,
    out_time: initialData?.out_time ?? "",
    order_id: initialData?.order_id ?? undefined,
    order_no: initialData?.order_no ?? "",
    total_count: initialData?.total_count ?? undefined,
    total_price: initialData?.total_price ?? undefined,
    receipt_price: initialData?.receipt_price ?? undefined,
    total_product_price: initialData?.total_product_price ?? undefined,
    total_tax_price: initialData?.total_tax_price ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    other_price: initialData?.other_price ?? undefined,
    file_url: initialData?.file_url ?? "",
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
        await ErpSaleOutApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpSaleOutApi.create(formData as ErpSaleOutCreateDTO)
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
            {isEdit ? "编辑ErpSaleOut（源框架导入）" : "新增ErpSaleOut（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">销售出库单号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售出库单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出库状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出库状态"
            
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
          <label className="block text-xs text-slate-600 mb-1">结算账户编号</label>
          <input
            type="number"
            value={formData.account_id != null ? String(formData.account_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, account_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结算账户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售员编号</label>
          <input
            type="number"
            value={formData.sale_user_id != null ? String(formData.sale_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sale_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售员编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出库时间</label>
          <input
            type="text"
            value={formData.out_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, out_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出库时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售订单编号</label>
          <input
            type="number"
            value={formData.order_id != null ? String(formData.order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售订单号</label>
          <input
            type="text"
            value={formData.order_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售订单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计数量</label>
          <input
            type="number"
            value={formData.total_count != null ? String(formData.total_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最终合计价格，单位：元</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最终合计价格，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">已收款金额，单位：元</label>
          <input
            type="number"
            value={formData.receipt_price != null ? String(formData.receipt_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入已收款金额，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计产品价格，单位：元</label>
          <input
            type="number"
            value={formData.total_product_price != null ? String(formData.total_product_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_product_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计产品价格，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计税额，单位：元</label>
          <input
            type="number"
            value={formData.total_tax_price != null ? String(formData.total_tax_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_tax_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计税额，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠率，百分比</label>
          <input
            type="number"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠率，百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠金额，单位：元</label>
          <input
            type="number"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠金额，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">其它金额，单位：元</label>
          <input
            type="number"
            value={formData.other_price != null ? String(formData.other_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, other_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入其它金额，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">附件地址</label>
          <input
            type="text"
            value={formData.file_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入附件地址"
            
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
