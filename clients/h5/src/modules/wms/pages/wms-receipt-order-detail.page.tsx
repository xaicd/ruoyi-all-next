"use client"

// Auto-generated Mobile H5 Page for 入库明细
import React, { useState, useEffect } from "react"
import { WmsReceiptOrderDetailH5Api, type WmsReceiptOrderDetailItem } from "../api/wms-receipt-order-detail.api"

export function WmsReceiptOrderDetailH5Page() {
  const [items, setItems] = useState<WmsReceiptOrderDetailItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    WmsReceiptOrderDetailH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">入库明细</h1>
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
              <div className="text-xs font-semibold text-slate-800">入库明细 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>关联入库单ID: {String(item.receipt_order_id ?? "-")}</div>
                <div>物料ID: {String(item.item_id ?? "-")}</div>
                <div>计划入库数量: {String(item.plan_qty ?? "-")}</div>
                <div>实际入库数量: {String(item.real_qty ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
