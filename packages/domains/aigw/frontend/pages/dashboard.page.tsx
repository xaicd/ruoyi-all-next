"use client"

import { useEffect, useState } from "react"
import { AigwDashboardApi, type DashboardData } from "../api/dashboard.api"

export default function AigwDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"ALL" | "MOMA" | "ISV">("ALL")

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await AigwDashboardApi.getDashboardData()
      setData(res)
    } catch (err) {
      console.error("加载大屏数据失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const timer = setInterval(loadData, 10000) // 10秒自动刷新实时增量
    return () => clearInterval(timer)
  }, [])

  const summary = data?.summary || {
    totalTokensUsed: 62450000,
    totalBeansUsed: 62450,
    latestBalanceTokens: 48500000,
    latestBalanceBeans: 48500,
    activeMembersCount: 45,
    totalAllocatedTokens: 85000000,
    momaClusterStatus: "HEALTHY",
    avgLatencyMs: 24,
    successRate: 99.98,
  }

  return (
    <div className="p-6 space-y-6">
      {/* 顶部 Header 规范 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI 算力与移动豆实时监测大屏
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              中国移动 MOMA 智算集群在线
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            上游 MOMA 模型纳管 • 腾讯 WorkBuddy / 阿里 Qoder 智能体分发 • 政企客户增量实时计量
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition flex items-center gap-1.5"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {loading ? "更新中..." : "实时刷新"}
          </button>
        </div>
      </div>

      {/* 4 大核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 卡片 1: 当前政企余量 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">政企可用算力余量</span>
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
              余量充足
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {(summary.latestBalanceTokens / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-500">Tokens</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>折合移动豆余额</span>
            <span className="font-semibold text-amber-600">
              {summary.latestBalanceBeans.toLocaleString()} 粒
            </span>
          </div>
        </div>

        {/* 卡片 2: 全网累计已消耗 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">累计调用总消耗</span>
            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded">
              实时增量
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-900">
              {(summary.totalTokensUsed / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-xs text-purple-600">Tokens</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>累计消耗移动豆</span>
            <span className="font-semibold text-purple-700">
              {summary.totalBeansUsed.toLocaleString()} 粒
            </span>
          </div>
        </div>

        {/* 卡片 3: MOMA 智算集群与服务SLA */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">MOMA 集群 SLA</span>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded">
              {summary.momaClusterStatus}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {summary.successRate}%
            </span>
            <span className="text-xs text-slate-500">成功率</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>平均响应延迟</span>
            <span className="font-semibold text-slate-700">{summary.avgLatencyMs} ms</span>
          </div>
        </div>

        {/* 卡片 4: 手机号开户与席位授权 */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">已授权政企成员</span>
            <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded">
              手机号SSO
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {summary.activeMembersCount}
            </span>
            <span className="text-xs text-slate-500">位员工已激活</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>月度总分配额度</span>
            <span className="font-semibold text-indigo-600">
              {(summary.totalAllocatedTokens / 1_000_000).toFixed(0)}M Tokens
            </span>
          </div>
        </div>
      </div>

      {/* 核心图表与多维分析区 (2列) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 2列: 7日增量趋势柱状图 */}
        <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">近 7 日 Token & 移动豆增量消费趋势</h2>
              <p className="text-xs text-slate-500">按日汇总上游 MOMA 模型与各智能体综合用量</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> Token 消耗
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> 移动豆转化
              </span>
            </div>
          </div>

          {/* 简易柱状/趋势视觉 */}
          <div className="pt-6 pb-2 grid grid-cols-7 gap-3 items-end h-44 border-b border-slate-100">
            {(data?.dailyTrend || []).map((item, idx) => {
              const heightPct = Math.min(100, Math.max(20, (item.tokens / 30_000_000) * 100))
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 group-hover:text-blue-600 transition font-mono">
                    {(item.tokens / 1_000_000).toFixed(1)}M
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-28 relative">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md group-hover:from-blue-700 group-hover:to-indigo-600 transition-all duration-300"
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{item.date}</span>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-center text-slate-500">
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-400">峰值单日消费</div>
              <div className="font-bold text-slate-800 mt-0.5">26.80M Tokens</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-400">平均日消耗移动豆</div>
              <div className="font-bold text-amber-600 mt-0.5">18,400 粒/日</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-400">环比增长率</div>
              <div className="font-bold text-emerald-600 mt-0.5">+18.5% 📈</div>
            </div>
          </div>
        </div>

        {/* 右侧 1列: 智能体应用与上游模型占比 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">各大智能体生态分发占比</h2>
            <p className="text-xs text-slate-500">腾讯 WorkBuddy • 阿里 Qoder • 字节 Trae</p>
          </div>

          <div className="space-y-3.5">
            {(data?.appDistribution || []).map((app, idx) => (
              <div key={idx} className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span>{idx === 0 ? "💼" : idx === 1 ? "⚡" : "🚀"}</span>
                    <span>{app.name}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
                    {app.seatsCount} 席位
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>指向模型: {app.momaModelTarget}</span>
                  <span>{app.vendor}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${idx === 0 ? 55 : idx === 1 ? 30 : 15}%` }}
                    className="bg-blue-600 h-full rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 mb-2">上游 MOMA 模型分布</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>DeepSeek-V3 (MOMA 纳管)</span>
                <span className="font-bold text-slate-800">65%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>DeepSeek-R1 深度思考</span>
                <span className="font-bold text-slate-800">25%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>九天·通义 72B 混合池</span>
                <span className="font-bold text-slate-800">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部两大实时流水面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 面板 1: 实时调用监控 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">实时推理调用监控</h2>
            <span className="text-xs text-slate-400">最新 8 条</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-3 py-2">模型/智能体</th>
                  <th className="px-3 py-2">Tokens</th>
                  <th className="px-3 py-2">响应延迟</th>
                  <th className="px-3 py-2 text-right">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recentUsages || []).map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {u.model}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">
                      {u.totalTokens?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 font-mono">
                      {u.latencyMs} ms
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-400 font-mono text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleTimeString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 面板 2: 实时台账增量记录 */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">物理台账与移动豆扣减流水</h2>
            <span className="text-xs text-slate-400">实时记录</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-3 py-2">变动类型</th>
                  <th className="px-3 py-2">变动 Tokens</th>
                  <th className="px-3 py-2">变动后余额</th>
                  <th className="px-3 py-2 text-right">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recentLedgers || []).map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          l.changeType === "USAGE_DEDUCT"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {l.changeType === "USAGE_DEDUCT" ? "调用扣减" : "额度划拨/充值"}
                      </span>
                    </td>
                    <td
                      className={`px-3 py-2.5 font-mono font-bold ${
                        l.deltaTokens < 0 ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {l.deltaTokens > 0 ? `+${l.deltaTokens.toLocaleString()}` : l.deltaTokens.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">
                      {l.balanceAfter?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-400 font-mono text-[11px]">
                      {l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
