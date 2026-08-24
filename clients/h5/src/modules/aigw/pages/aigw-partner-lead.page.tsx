"use client"

// Auto-generated Mobile H5 Page for 商机报备与锁定
import React, { useState, useEffect } from "react"
import { AigwPartnerLeadH5Api, type AigwPartnerLeadItem } from "../api/aigw-partner-lead.api"

export function AigwPartnerLeadH5Page() {
  const [items, setItems] = useState<AigwPartnerLeadItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    AigwPartnerLeadH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">商机报备与锁定</h1>
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
              <div className="text-xs font-semibold text-slate-800">商机报备与锁定 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>商机报备编号: {String(item.lead_no ?? "-")}</div>
                <div>报备代理商ID: {String(item.partner_id ?? "-")}</div>
                <div>代理商名称: {String(item.partner_name ?? "-")}</div>
                <div>报备政企客户全称: {String(item.customer_name ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
