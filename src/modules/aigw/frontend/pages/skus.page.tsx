"use client"

import { useEffect, useState } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

interface SkuItem {
  id: string
  code: string
  name: string
  tokens: number
  price: number
  status: "ACTIVE" | "DISABLED"
  remark?: string
}

export default function AigwSkusPage() {
  const [items, setItems] = useState<SkuItem[]>([
    { id: "sku-1", code: "DEEPSEEK_50M", name: "DeepSeek 算力加油包 (5,000万 Token)", tokens: 50000000, price: 199, status: "ACTIVE", remark: "通用大模型加油包" },
    { id: "sku-2", code: "QWEN_100M", name: "通义千问 旗舰算力包 (1亿 Token)", tokens: 100000000, price: 388, status: "ACTIVE", remark: "Qwen-Max 高性能包" },
    { id: "sku-3", code: "STARTER_10M", name: "小微开发者 体验加油包 (1,000万 Token)", tokens: 10000000, price: 49, status: "ACTIVE", remark: "新手体验特惠" },
  ])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")

  const fetchList = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 200)
  }

  useEffect(() => {
    fetchList()
  }, [])

  const filteredItems = items.filter(
    (item) => !keyword || item.name.includes(keyword) || item.code.includes(keyword)
  )

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">算力加油包 SKU 目录</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            发布可在 Mall 电商上架的 AI 算力 Token 加油包 SPU/SKU 商品，支持线上扫码支付履约
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchList}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            刷新
          </button>
          <button
            onClick={() => alert("功能开发中: 可在 Mall 域一键发布 SKU")}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span> 新增算力包 SKU
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={(e) => { e.preventDefault(); fetchList() }} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索 SKU 名称 / 编码..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
          >
            查询
          </button>
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            重置
          </button>
        </form>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{filteredItems.length}</span> 个算力加油包
        </div>
      </div>

      {/* SKU 表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">SKU 编码</th>
                <th className="px-5 py-3">算力包商品名称</th>
                <th className="px-5 py-3">包含算力 Token</th>
                <th className="px-5 py-3">售卖价格</th>
                <th className="px-5 py-3">商品状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    正在加载加油包列表...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    暂无算力加油包
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-semibold">
                        {item.code}
                      </code>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                      {item.tokens.toLocaleString()} Token
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-emerald-600">
                      ¥ {item.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        上架销售中
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`已在 Mall 订单生成模拟购买事件`)}
                          className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          模拟加购
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
