"use client"

import React, { useState, useEffect } from "react"
import { ProductCommentApi } from "../api/product-comment.api"
import type { ProductCommentCreateDTO, ProductCommentVO } from "@/modules/mall/backend/types/product-comment.types"

interface ProductCommentFormProps {
  open: boolean
  initialData?: ProductCommentVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ProductCommentForm({ open, initialData, onClose, onSuccess }: ProductCommentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    user_nickname: initialData?.user_nickname ?? "",
    user_avatar: initialData?.user_avatar ?? "",
    anonymous: initialData?.anonymous ?? false,
    order_id: initialData?.order_id ?? undefined,
    order_item_id: initialData?.order_item_id ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    spu_name: initialData?.spu_name ?? "",
    sku_id: initialData?.sku_id ?? undefined,
    sku_pic_url: initialData?.sku_pic_url ?? "",
    sku_properties: initialData?.sku_properties ?? "",
    visible: initialData?.visible ?? false,
    scores: initialData?.scores ?? undefined,
    description_scores: initialData?.description_scores ?? undefined,
    benefit_scores: initialData?.benefit_scores ?? undefined,
    content: initialData?.content ?? "",
    pic_urls: initialData?.pic_urls ?? "",
    reply_status: initialData?.reply_status ?? false,
    reply_user_id: initialData?.reply_user_id ?? undefined,
    reply_content: initialData?.reply_content ?? "",
    reply_time: initialData?.reply_time ?? "",
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
        await ProductCommentApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ProductCommentApi.create(formData as ProductCommentCreateDTO)
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
            {isEdit ? "编辑ProductComment（源框架导入）" : "新增ProductComment（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">评价人的用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评价人的用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">评价人名称</label>
          <input
            type="text"
            value={formData.user_nickname ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_nickname: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评价人名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">评价人头像</label>
          <input
            type="text"
            value={formData.user_avatar ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_avatar: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评价人头像"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={Boolean(formData.anonymous)}
            onChange={(e) => setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="text-xs text-slate-700 font-medium">是否匿名</label>
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
          <label className="block text-xs text-slate-600 mb-1">商品 SKU 图片地址</label>
          <input
            type="text"
            value={formData.sku_pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SKU 图片地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性数组，JSON 格式</label>
          <input
            type="text"
            value={formData.sku_properties ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_properties: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性数组，JSON 格式"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={Boolean(formData.visible)}
            onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="visible" className="text-xs text-slate-700 font-medium">是否可见</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">评分星级</label>
          <input
            type="number"
            value={formData.scores != null ? String(formData.scores) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scores: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评分星级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">描述星级</label>
          <input
            type="number"
            value={formData.description_scores != null ? String(formData.description_scores) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description_scores: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入描述星级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">服务星级</label>
          <input
            type="number"
            value={formData.benefit_scores != null ? String(formData.benefit_scores) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, benefit_scores: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入服务星级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">评论内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评论内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">评论图片地址数组</label>
          <input
            type="text"
            value={formData.pic_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评论图片地址数组"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reply_status"
            checked={Boolean(formData.reply_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="reply_status" className="text-xs text-slate-700 font-medium">商家是否回复</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复管理员编号</label>
          <input
            type="number"
            value={formData.reply_user_id != null ? String(formData.reply_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复管理员编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商家回复内容</label>
          <input
            type="text"
            value={formData.reply_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商家回复内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商家回复时间</label>
          <input
            type="text"
            value={formData.reply_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商家回复时间"
            
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
