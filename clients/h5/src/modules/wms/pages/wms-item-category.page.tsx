"use client"

// Auto-generated Mobile H5 Page for 物料分类
import React, { useState, useEffect } from "react"
import { WmsItemCategoryH5Api, type WmsItemCategoryItem } from "../api/wms-item-category.api"

export function WmsItemCategoryH5Page() {
  const [items, setItems] = useState<WmsItemCategoryItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsItemCategoryH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">物料分类</h1>
        <p className="text-xs text-slate-500">移动端列表浏览</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">加载中...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">暂无数据</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-xs">
              <div className="text-xs font-semibold text-slate-800">物料分类 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>上级分类ID: {String(item.parent_id ?? "-")}</div>
                <div>分类名称: {String(item.name ?? "-")}</div>
                <div>分类编码: {String(item.code ?? "-")}</div>
                <div>显示排序: {String(item.sort ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
