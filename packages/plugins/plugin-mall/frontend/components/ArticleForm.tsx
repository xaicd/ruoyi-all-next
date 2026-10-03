"use client"

import React, { useState, useEffect } from "react"
import { ArticleApi } from "../api/article.api"
import type { ArticleCreateDTO, ArticleVO } from "@/modules/mall/backend/types/article.types"

interface ArticleFormProps {
  open: boolean
  initialData?: ArticleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ArticleForm({ open, initialData, onClose, onSuccess }: ArticleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    category_id: initialData?.category_id ?? undefined,
    spu_id: initialData?.spu_id ?? undefined,
    title: initialData?.title ?? "",
    author: initialData?.author ?? "",
    pic_url: initialData?.pic_url ?? "",
    introduction: initialData?.introduction ?? "",
    browse_count: initialData?.browse_count ?? undefined,
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? undefined,
    recommend_hot: initialData?.recommend_hot ?? false,
    recommend_banner: initialData?.recommend_banner ?? false,
    content: initialData?.content ?? "",
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
        await ArticleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ArticleApi.create(formData as ArticleCreateDTO)
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
            {isEdit ? "编辑Article（源框架导入）" : "新增Article（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">分类编号 ArticleCategoryDO#id</label>
          <input
            type="number"
            value={formData.category_id != null ? String(formData.category_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类编号 ArticleCategoryDO#id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联商品编号 ProductSpuDO#id</label>
          <input
            type="number"
            value={formData.spu_id != null ? String(formData.spu_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spu_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联商品编号 ProductSpuDO#id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文章标题</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文章作者</label>
          <input
            type="text"
            value={formData.author ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章作者"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文章封面图片地址</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章封面图片地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文章简介</label>
          <input
            type="text"
            value={formData.introduction ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, introduction: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章简介"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">浏览次数</label>
          <input
            type="number"
            value={formData.browse_count != null ? String(formData.browse_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, browse_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入浏览次数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recommend_hot"
            checked={Boolean(formData.recommend_hot)}
            onChange={(e) => setFormData((prev) => ({ ...prev, recommend_hot: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="recommend_hot" className="text-xs text-slate-700 font-medium">是否热门(小程序)</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recommend_banner"
            checked={Boolean(formData.recommend_banner)}
            onChange={(e) => setFormData((prev) => ({ ...prev, recommend_banner: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="recommend_banner" className="text-xs text-slate-700 font-medium">是否轮播图(小程序)</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文章内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章内容"
            
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
