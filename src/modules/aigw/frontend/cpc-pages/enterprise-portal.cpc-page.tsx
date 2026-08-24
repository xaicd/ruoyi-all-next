"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type EnterpriseQuota = {
  enterpriseName: string
  creditCode: string
  tierName: string
  totalTokenMonthly: number
  usedTokenMonthly: number
  remainingTokenMonthly: number
  mobileBeansEquivalent: number
  activeSeats: number
  totalSeats: number
  privateMcps: Array<{ id: string; name: string; version: string; description: string }>
}

type MemberSeat = {
  id: string
  mobile: string
  name: string
  dept: string
  title: string
  agentApp: string
  monthlyLimitToken: number
  usedTokenMonthly: number
  status: "ACTIVE" | "SUSPENDED"
}

export function EnterprisePortalCpcPage() {
  const [quota, setQuota] = useState<EnterpriseQuota>({
    enterpriseName: "广东省政务服务和数据管理局",
    creditCode: "11440000MB2D00001X",
    tierName: "旗舰智算融合套餐 (月包)",
    totalTokenMonthly: 100000000,
    usedTokenMonthly: 18000000,
    remainingTokenMonthly: 82000000,
    mobileBeansEquivalent: 82000,
    activeSeats: 3,
    totalSeats: 100,
    privateMcps: [
      { id: "mcp-doc", name: "国家标准红头公文排版与合规审计", version: "v2.1", description: "GB/T 9704-2012 党政机关公文格式自动化" },
      { id: "mcp-meeting", name: "腾讯会议速记与企微待办任务派发", version: "v1.4", description: "政企私有部署会议纪要自动提炼" },
    ],
  })

  const [members, setMembers] = useState<MemberSeat[]>([
    {
      id: "mem-1",
      mobile: "13800000001",
      name: "李总",
      dept: "数智推进中心",
      title: "信息化负责人 / IT总监",
      agentApp: "腾讯 WorkBuddy • Cherry Studio",
      monthlyLimitToken: 20000000,
      usedTokenMonthly: 2850000,
      status: "ACTIVE",
    },
    {
      id: "mem-2",
      mobile: "13911112222",
      name: "张工",
      dept: "核心研发中心",
      title: "首席架构师",
      agentApp: "阿里 Qoder • 字节 Trae",
      monthlyLimitToken: 30000000,
      usedTokenMonthly: 12400000,
      status: "ACTIVE",
    },
    {
      id: "mem-3",
      mobile: "13766668888",
      name: "王主任",
      dept: "综合行政办",
      title: "行政主任",
      agentApp: "腾讯 WorkBuddy",
      monthlyLimitToken: 10000000,
      usedTokenMonthly: 1200000,
      status: "ACTIVE",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    dept: "大数据应用科",
    agentApp: "腾讯 WorkBuddy",
    monthlyLimitToken: 10000000,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.mobile || !formData.name) return

    const newMember: MemberSeat = {
      id: `mem-${Date.now()}`,
      mobile: formData.mobile,
      name: formData.name,
      dept: formData.dept,
      title: "业务经办人",
      agentApp: formData.agentApp,
      monthlyLimitToken: Number(formData.monthlyLimitToken),
      usedTokenMonthly: 0,
      status: "ACTIVE",
    }

    setMembers([newMember, ...members])
    setQuota({ ...quota, activeSeats: quota.activeSeats + 1 })
    setShowModal(false)
    setFormData({ mobile: "", name: "", dept: "大数据应用科", agentApp: "腾讯 WorkBuddy", monthlyLimitToken: 10000000 })
    alert(`🎉 成功为【${newMember.name}】开通算力！\n已自动模拟下发短信授权通知与客户端唤起码。`)
  }

  const handleCopyLink = (m: MemberSeat) => {
    const link = `workbuddy://connect?token=auth_tkt_${m.mobile}&server=http://localhost:3200`
    navigator.clipboard?.writeText?.(link)
    setCopiedId(m.id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const filteredMembers = members.filter(
    (m) => m.name.includes(searchTerm) || m.mobile.includes(searchTerm) || m.dept.includes(searchTerm)
  )

  const usagePercent = Math.round((quota.usedTokenMonthly / quota.totalTokenMonthly) * 100)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white antialiased flex flex-col font-sans">
      {/* 顶部顶级科技微导轨 */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-500/25">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">RoMA 应算通</span>
              <span className="text-slate-500 text-xs">/</span>
              <span className="text-xs font-semibold text-slate-300">政企内网算力自服务专区 (CPC)</span>
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono font-medium">
                SSO 免密直连中
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* 多租户代运营切换器 (Tenant Switcher) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-sans shadow-xs">
            <span className="text-slate-400">托管机构:</span>
            <select
              value={quota.enterpriseName}
              onChange={async (e) => {
                const selectedName = e.target.value
                let targetId = "2"
                let newTokens = 100000000
                let newCredit = "11440000MB2D00001X"

                if (selectedName.includes("交通")) {
                  targetId = "3"
                  newTokens = 80000000
                  newCredit = "91440000MA5CL9999X"
                } else if (selectedName.includes("广州")) {
                  targetId = "4"
                  newTokens = 50000000
                  newCredit = "11440100MB2D88888X"
                }

                try {
                  const res = await fetch("/api/v1/auth/switch-tenant", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tenantId: targetId }),
                  })
                  const json = await res.json()
                  if (json.success && json.data?.token) {
                    localStorage.setItem("ruoyi_token", json.data.token)
                  }
                } catch {}

                setQuota({
                  ...quota,
                  enterpriseName: selectedName,
                  creditCode: newCredit,
                  totalTokenMonthly: newTokens,
                  remainingTokenMonthly: Math.round(newTokens * 0.82),
                  usedTokenMonthly: Math.round(newTokens * 0.18),
                  mobileBeansEquivalent: Math.round(newTokens * 0.82 / 1000),
                })
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="广东省政务服务和数据管理局" className="bg-slate-900 text-white">🏛️ 广东省政务服务和数据管理局</option>
              <option value="广东省交通数智科技集团有限公司" className="bg-slate-900 text-white">🏢 广东省交通数智科技集团有限公司</option>
              <option value="广州市数字政府运营中心" className="bg-slate-900 text-white">🏛️ 广州市数字政府运营中心</option>
            </select>
          </div>

          <Link
            href="/workspace"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-medium shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>进入工作台</span>
            <span>→</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm("确定要退出当前政企专区吗？")) {
                localStorage.removeItem("ruoyi_token")
                localStorage.removeItem("ruoyi_user")
                window.location.href = "/login"
              }
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            title="退出登录"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">退出</span>
          </button>
        </div>
      </header>

      {/* 主体大盘 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 space-y-6">
        {/* 1. 机构契约与算力供给横幅 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-slate-900 border border-blue-500/20 p-6 lg:p-8 backdrop-blur-md shadow-2xl">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{quota.enterpriseName}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-mono">
                  税号: {quota.creditCode}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>签约套餐：<strong className="text-amber-300">{quota.tierName}</strong></span>
                <span>运营中枢：<strong className="text-blue-300">RoMA 应算通</strong></span>
                <span>算力供给：<strong className="text-emerald-300">中国移动 MOMA 智算集群 (满血 DeepSeek-R1/V3)</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span className="text-base font-bold">+</span>
                <span>为单位员工开通算力席位</span>
              </button>
            </div>
          </div>

          {/* 4 联 KPI 核心资产仪表盘 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* 卡片 1: 本月算力总量 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>本月签约算力池</span>
                <span className="text-blue-400">⚡ Monthly</span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {(quota.totalTokenMonthly / 10000).toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">万 Token</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${usagePercent}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>已消耗 {usagePercent}%</span>
                <span>按需动态扩缩容</span>
              </div>
            </div>

            {/* 卡片 2: 本月剩余可用 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>本月剩余可用额度</span>
                <span className="text-emerald-400">● 充足</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                {(quota.remainingTokenMonthly / 10000).toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">万 Token</span>
              </div>
              <div className="text-[10px] text-slate-400">
                次月 1 日 0 点自动重置续期
              </div>
            </div>

            {/* 卡片 3: 折合移动豆 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>折合移动豆余额</span>
                <span className="text-amber-400">🌾 1:1000</span>
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                {quota.mobileBeansEquivalent.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-normal">粒 Beans</span>
              </div>
              <div className="text-[10px] text-slate-400">
                支持中国移动话费账单合并出账
              </div>
            </div>

            {/* 卡片 4: 席位划拨情况 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>席位分配状态</span>
                <span className="text-indigo-400">👥 Seats</span>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {quota.activeSeats} <span className="text-xs text-slate-400 font-sans font-normal">/ {quota.totalSeats} 席 (已激活)</span>
              </div>
              <div className="text-[10px] text-slate-400">
                剩余 {quota.totalSeats - quota.activeSeats} 个待分配名额
              </div>
            </div>
          </div>
        </div>

        {/* 2. 政企私有 MCP 资产挂载面板 */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="text-base">🏛️</span>
            <span className="font-semibold text-white">本单位已自动注入的政企私有 MCP 插件：</span>
            <span className="text-slate-400 text-[11px] hidden lg:inline">员工在腾讯 WorkBuddy / 阿里 Qoder 登录手机号即可免配置调用</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {quota.privateMcps.map((mcp) => (
              <div key={mcp.id} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>{mcp.name}</span>
                <span className="text-[9px] font-mono text-slate-400">({mcp.version})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 员工算力席位与授权台账 */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          {/* 表格顶栏操作 */}
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>单位员工手机开户与智能体授权台账</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded-full font-mono">
                  共 {filteredMembers.length} 名人员
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                数据严格隔离在当前租户（{quota.enterpriseName}）下，跨租户物理级不可见。
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名、手机、部门..."
                className="px-3.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 w-48 sm:w-60 font-medium"
              />
            </div>
          </div>

          {/* 表格内容 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">员工姓名 / 手机号</th>
                  <th className="px-6 py-3.5">所属部门 / 职务</th>
                  <th className="px-6 py-3.5">已授权智能体端</th>
                  <th className="px-6 py-3.5">月度算力上限</th>
                  <th className="px-6 py-3.5">本月消耗进度</th>
                  <th className="px-6 py-3.5">状态</th>
                  <th className="px-6 py-3.5 text-right">协同操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((m) => {
                  const percent = Math.round((m.usedTokenMonthly / m.monthlyLimitToken) * 100)
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{m.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{m.mobile}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-200 font-medium">{m.dept}</div>
                        <div className="text-[11px] text-slate-400">{m.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex flex-wrap gap-1">
                          {m.agentApp.split("•").map((app, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded text-[11px] font-medium"
                            >
                              {app.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        {(m.monthlyLimitToken / 10000).toLocaleString()} 万 Token
                      </td>
                      <td className="px-6 py-4 min-w-[140px]">
                        <div className="text-[11px] font-mono text-slate-300 mb-1">
                          {(m.usedTokenMonthly / 10000).toFixed(1)} 万 ({percent}%)
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${percent > 80 ? "bg-rose-500" : percent > 50 ? "bg-amber-500" : "bg-blue-500"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          正常使用
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(m)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          {copiedId === m.id ? "✓ 已复制协议" : "复制唤起码"}
                        </button>
                        <span className="text-slate-700">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newLimit = prompt(`请输入【${m.name}】新的月度算力额度 (单位: 万 Token):`, String(m.monthlyLimitToken / 10000))
                            if (newLimit && !isNaN(Number(newLimit))) {
                              setMembers(members.map((item) => (item.id === m.id ? { ...item, monthlyLimitToken: Number(newLimit) * 10000 } : item)))
                              alert(`已将【${m.name}】额度调整为 ${newLimit} 万 Token！`)
                            }
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                        >
                          调整额度
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 新增员工开户弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>⚡ 为单位员工开通算力席位</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">员工手机号码 (登录唯一账号)</label>
                <input
                  type="text"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="如 13800138000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">员工姓名</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如 陈科长"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">所属科室 / 部门</label>
                <input
                  type="text"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">授权智能体应用</label>
                <select
                  value={formData.agentApp}
                  onChange={(e) => setFormData({ ...formData, agentApp: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="腾讯 WorkBuddy • Cherry Studio">腾讯 WorkBuddy (公文/协同推荐)</option>
                  <option value="阿里 Qoder • 字节 Trae">阿里 Qoder (代码/架构研发推荐)</option>
                  <option value="全生态智能体 (WorkBuddy + Qoder + Trae)">全生态全功能智能体席位</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">月度算力分配额度</label>
                <select
                  value={formData.monthlyLimitToken}
                  onChange={(e) => setFormData({ ...formData, monthlyLimitToken: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value={5000000}>500 万 Token / 月 (日常公文轻度)</option>
                  <option value={10000000}>1,000 万 Token / 月 (标准业务中度)</option>
                  <option value={20000000}>2,000 万 Token / 月 (核心业务深度)</option>
                  <option value={50000000}>5,000 万 Token / 月 (研发与算法高频)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
                >
                  立即开通并授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
