"use client"

// Auto-generated Mobile H5 Page for 物料SKU
import React, { useState, useEffect } from "react"
import { WmsItemSkuH5Api, type WmsItemSkuItem } from "../api/wms-item-sku.api"

export function WmsItemSkuH5Page() {
  const [items, setItems] = useState<WmsItemSkuItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsItemSkuH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">物料SKU</h1>
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
              <div className="text-xs font-semibold text-slate-800">物料SKU #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>物料ID: {String(item.item_id ?? "-")}</div>
                <div>SKU编码: {String(item.sku_code ?? "-")}</div>
                <div>规格名称: {String(item.sku_name ?? "-")}</div>
                <div>条形码: {String(item.barcode ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
