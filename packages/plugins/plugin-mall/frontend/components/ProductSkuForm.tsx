"use client"

import React, { useState, useEffect } from "react"
import { ProductSkuApi } from "../api/product-sku.api"
import type { ProductSkuCreateDTO, ProductSkuVO } from "@/modules/mall/backend/types/product-sku.types"

interface ProductSkuFormProps {
  open: boolean
  initialData?: ProductSkuVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ProductSkuForm({ open, initialData, onClose, onSuccess }: ProductSkuFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    spu_id: initialData?.spu_id ?? undefined,
    properties: initialData?.properties ?? "",
    price: initialData?.price ?? undefined,
    market_price: initialData?.market_price ?? undefined,
    cost_price: initialData?.cost_price ?? undefined,
    bar_code: initialData?.bar_code ?? "",
    pic_url: initialData?.pic_url ?? "",
    stock: initialData?.stock ?? undefined,
    weight: initialData?.weight ?? undefined,
    volume: initialData?.volume ?? undefined,
    first_brokerage_price: initialData?.first_brokerage_price ?? undefined,
    second_brokerage_price: initialData?.second_brokerage_price ?? undefined,
    sales_count: initialData?.sales_count ?? undefined,
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
        await ProductSkuApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ProductSkuApi.create(formData as ProductSkuCreateDTO)
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
            {isEdit ? "编辑ProductSku（源框架导入）" : "新增ProductSku（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">SPU 编号</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入SPU 编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">商品价格，单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品价格，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">市场价，单位：分</label>
          <input
            type="number"
            value={formData.market_price != null ? String(formData.market_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, market_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入市场价，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">成本价，单位：分</label>
          <input
            type="number"
            value={formData.cost_price != null ? String(formData.cost_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入成本价，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品条码</label>
          <input
            type="text"
            value={formData.bar_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bar_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品条码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图片地址</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图片地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库存</label>
          <input
            type="number"
            value={formData.stock != null ? String(formData.stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库存"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品重量，单位：kg 千克</label>
          <input
            type="number"
            value={formData.weight != null ? String(formData.weight) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品重量，单位：kg 千克"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品体积，单位：m^3 平米</label>
          <input
            type="number"
            value={formData.volume != null ? String(formData.volume) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, volume: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品体积，单位：m^3 平米"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">一级分销的佣金，单位：分</label>
          <input
            type="number"
            value={formData.first_brokerage_price != null ? String(formData.first_brokerage_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, first_brokerage_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入一级分销的佣金，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">二级分销的佣金，单位：分</label>
          <input
            type="number"
            value={formData.second_brokerage_price != null ? String(formData.second_brokerage_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, second_brokerage_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入二级分销的佣金，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品销量</label>
          <input
            type="number"
            value={formData.sales_count != null ? String(formData.sales_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品销量"
            
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
