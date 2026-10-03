"use client"

import React, { useState, useEffect } from "react"
import { ProductSpuApi } from "../api/product-spu.api"
import type { ProductSpuCreateDTO, ProductSpuVO } from "@/modules/mall/backend/types/product-spu.types"

interface ProductSpuFormProps {
  open: boolean
  initialData?: ProductSpuVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ProductSpuForm({ open, initialData, onClose, onSuccess }: ProductSpuFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    keyword: initialData?.keyword ?? "",
    introduction: initialData?.introduction ?? "",
    description: initialData?.description ?? "",
    category_id: initialData?.category_id ?? undefined,
    brand_id: initialData?.brand_id ?? undefined,
    pic_url: initialData?.pic_url ?? "",
    slider_pic_urls: initialData?.slider_pic_urls ?? "",
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? undefined,
    spec_type: initialData?.spec_type ?? false,
    price: initialData?.price ?? undefined,
    market_price: initialData?.market_price ?? undefined,
    cost_price: initialData?.cost_price ?? undefined,
    stock: initialData?.stock ?? undefined,
    delivery_types: initialData?.delivery_types ?? "",
    delivery_template_id: initialData?.delivery_template_id ?? undefined,
    give_integral: initialData?.give_integral ?? undefined,
    sub_commission_type: initialData?.sub_commission_type ?? false,
    sales_count: initialData?.sales_count ?? undefined,
    virtual_sales_count: initialData?.virtual_sales_count ?? undefined,
    browse_count: initialData?.browse_count ?? undefined,
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
        await ProductSpuApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ProductSpuApi.create(formData as ProductSpuCreateDTO)
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
            {isEdit ? "编辑ProductSpu（源框架导入）" : "新增ProductSpu（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">商品名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关键字</label>
          <input
            type="text"
            value={formData.keyword ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, keyword: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关键字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品简介</label>
          <input
            type="text"
            value={formData.introduction ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, introduction: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品简介"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品详情</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品详情"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品分类编号</label>
          <input
            type="number"
            value={formData.category_id != null ? String(formData.category_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品分类编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品品牌编号</label>
          <input
            type="number"
            value={formData.brand_id != null ? String(formData.brand_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品品牌编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品封面图</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品封面图"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品轮播图</label>
          <input
            type="text"
            value={formData.slider_pic_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, slider_pic_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品轮播图"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序字段</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序字段"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品状态"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="spec_type"
            checked={Boolean(formData.spec_type)}
            onChange={(e) => setFormData((prev) => ({ ...prev, spec_type: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="spec_type" className="text-xs text-slate-700 font-medium">规格类型</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品价格，单位使用：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品价格，单位使用：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">市场价，单位使用：分</label>
          <input
            type="number"
            value={formData.market_price != null ? String(formData.market_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, market_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入市场价，单位使用：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">成本价，单位使用：分</label>
          <input
            type="number"
            value={formData.cost_price != null ? String(formData.cost_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cost_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入成本价，单位使用：分"
            
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
          <label className="block text-xs text-slate-600 mb-1">配送方式数组</label>
          <input
            type="text"
            value={formData.delivery_types ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_types: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送方式数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物流配置模板编号</label>
          <input
            type="number"
            value={formData.delivery_template_id != null ? String(formData.delivery_template_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_template_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物流配置模板编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赠送积分</label>
          <input
            type="number"
            value={formData.give_integral != null ? String(formData.give_integral) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, give_integral: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送积分"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sub_commission_type"
            checked={Boolean(formData.sub_commission_type)}
            onChange={(e) => setFormData((prev) => ({ ...prev, sub_commission_type: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sub_commission_type" className="text-xs text-slate-700 font-medium">分销类型</label>
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
          <label className="block text-xs text-slate-600 mb-1">虚拟销量</label>
          <input
            type="number"
            value={formData.virtual_sales_count != null ? String(formData.virtual_sales_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, virtual_sales_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入虚拟销量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">浏览量</label>
          <input
            type="number"
            value={formData.browse_count != null ? String(formData.browse_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, browse_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入浏览量"
            
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
