"use client"

// Auto-generated Mobile H5 Page for 移库明细
import React, { useState, useEffect } from "react"
import { WmsMovementOrderDetailH5Api, type WmsMovementOrderDetailItem } from "../api/wms-movement-order-detail.api"

export function WmsMovementOrderDetailH5Page() {
  const [items, setItems] = useState<WmsMovementOrderDetailItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsMovementOrderDetailH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">移库明细</h1>
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
              <div className="text-xs font-semibold text-slate-800">移库明细 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>关联移库单ID: {String(item.movement_order_id ?? "-")}</div>
                <div>物料ID: {String(item.item_id ?? "-")}</div>
                <div>移库数量: {String(item.qty ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
