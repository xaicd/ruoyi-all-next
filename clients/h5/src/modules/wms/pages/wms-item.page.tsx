"use client"

// Auto-generated Mobile H5 Page for 物料主数据
import React, { useState, useEffect } from "react"
import { WmsItemH5Api, type WmsItemItem } from "../api/wms-item.api"

export function WmsItemH5Page() {
  const [items, setItems] = useState<WmsItemItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsItemH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">物料主数据</h1>
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
              <div className="text-xs font-semibold text-slate-800">物料主数据 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>物料编码: {String(item.item_code ?? "-")}</div>
                <div>物料名称: {String(item.item_name ?? "-")}</div>
                <div>分类ID: {String(item.category_id ?? "-")}</div>
                <div>品牌ID: {String(item.brand_id ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
