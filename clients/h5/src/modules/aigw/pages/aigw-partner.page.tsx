"use client"

// Auto-generated Mobile H5 Page for 渠道代理商
import React, { useState, useEffect } from "react"
import { AigwPartnerH5Api, type AigwPartnerItem } from "../api/aigw-partner.api"

export function AigwPartnerH5Page() {
  const [items, setItems] = useState<AigwPartnerItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    AigwPartnerH5Api.list()
      .then((res) => setItems(res.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-slate-900">渠道代理商</h1>
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
              <div className="text-xs font-semibold text-slate-800">渠道代理商 #{item.id.slice(0, 8)}</div>
              <div className="mt-1 space-y-0.5 text-[11px] text-slate-500">
                <div>代理商编号: {String(item.partner_code ?? "-")}</div>
                <div>代理商公司全称: {String(item.name ?? "-")}</div>
                <div>代理等级(GOLD/SILVER/BRONZE/GENERAL): {String(item.level ?? "-")}</div>
                <div>注册资金(万元): {String(item.registered_capital ?? "-")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
