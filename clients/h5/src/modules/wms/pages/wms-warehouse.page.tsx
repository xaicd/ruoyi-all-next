"use client"

// Auto-generated Mobile H5 Page for 智能仓库
import React, { useState, useEffect } from "react"
import { WmsWarehouseH5Api, type WmsWarehouseItem } from "../api/wms-warehouse.api"

export function WmsWarehouseH5Page() {
  const [items, setItems] = useState<WmsWarehouseItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsWarehouseH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">智能仓库</h1>
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
              <div className="text-xs font-semibold text-slate-800">智能仓库 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>仓库编码: {String(item.code ?? "-")}</div>
                <div>仓库名称: {String(item.name ?? "-")}</div>
                <div>库容量(m³): {String(item.capacity ?? "-")}</div>
                <div>启用状态: {String(item.active ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
