"use client"

// Auto-generated Mobile H5 Page for 出库单
import React, { useState, useEffect } from "react"
import { WmsShipmentOrderH5Api, type WmsShipmentOrderItem } from "../api/wms-shipment-order.api"

export function WmsShipmentOrderH5Page() {
  const [items, setItems] = useState<WmsShipmentOrderItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsShipmentOrderH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">出库单</h1>
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
              <div className="text-xs font-semibold text-slate-800">出库单 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>出库单号: {String(item.order_no ?? "-")}</div>
                <div>出库类型: {String(item.shipment_type ?? "-")}</div>
                <div>源仓库ID: {String(item.warehouse_id ?? "-")}</div>
                <div>货主ID: {String(item.merchant_id ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
