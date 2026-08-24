"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { request } from "@/modules/shared/frontend/lib/request"

interface EnterpriseQuotaSummary {
  enterpriseName: string
  creditCode: string
  tierName: string
  tokensTotal: number
  tokensUsed: number
  tokensRemain: number
  usagePercent: number
  momaBeansBalance: number
  seatsTotal: number
  seatsAssigned: number
  seatsActive: number
  monthlyBillAmount: number
  currentMonthExpireAt: string
  boundMcps: Array<{ code: string; name: string; version: string }>
}

interface MemberItem {
  id: string
  phone: string
  name: string
  deptName: string
  role: string
  allowedApps: string[]
  monthlyTokenCap: number
  usedTokens: number
  status: string
}

export function EnterprisePortalCpcPage() {
  const searchParams = useSearchParams()
  const embedded = searchParams.get("embedded") === "true"
  const ticket = searchParams.get("ticket") || ""
  const initialOrg = searchParams.get("org") || "gd-gov-data"

  const [orgCode, setOrgCode] = useState(initialOrg)
  const [loading, setLoading] = useState(true)
  const [quota, setQuota] = useState<EnterpriseQuotaSummary | null>(null)
  const [members, setMembers] = useState<MemberItem[]>([
    {
      id: "mem-1",
      phone: "13800000001",
      name: "李总",
      deptName: "数智推进处",
      role: "信息化处长 / IT管理员",
      allowedApps: ["workbuddy", "cherry-studio"],
      monthlyTokenCap: 20_000_000,
      usedTokens: 2_850_000,
      status: "ACTIVE",
    },
    {
      id: "mem-2",
      phone: "13911112222",
      name: "张工",
      deptName: "核心研发中心",
      role: "首席架构师",
      allowedApps: ["qoder", "trae"],
      monthlyTokenCap: 30_000_000,
      usedTokens: 12_400_000,
      status: "ACTIVE",
    },
    {
      id: "mem-3",
      phone: "13766668888",
      name: "王主任",
      deptName: "综合行政办",
      role: "行政主任",
      allowedApps: ["workbuddy"],
      monthlyTokenCap: 10_000_000,
      usedTokens: 1_200_000,
      status: "ACTIVE",
    },
  ])

  // 开通新员工弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    phone: "",
    name: "",
    deptName: "行政综合部",
    role: "公文起草专员",
    allowedApps: ["workbuddy"],
    monthlyTokenCap: 10_000_000,
  })

  // 调整额度弹窗
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [adjustTarget, setAdjustTarget] = useState<MemberItem | null>(null)
  const [newCap, setNewCap] = useState<number>(20_000_000)

  const fetchSummary = async (code = orgCode) => {
    setLoading(true)
    try {
      const res: any = await request.get(`/api/v1/open/enterprise/quota/summary?org=${code}`)
      if (res.success && res.data) {
        setQuota(res.data)
      }
    } catch (err) {
      console.error("加载政企算力大盘失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [orgCode])

  // 快捷为员工开通
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.phone || !form.name) return
    try {
      const res: any = await request.post("/api/v1/open/enterprise/members/sync", {
        members: [{ ...form, sendSmsNotification: true }],
      })
      if (res.success) {
        setMembers([
          {
            id: `mem-${Date.now()}`,
            phone: form.phone,
            name: form.name,
            deptName: form.deptName,
            role: form.role,
            allowedApps: form.allowedApps,
            monthlyTokenCap: Number(form.monthlyTokenCap),
            usedTokens: 0,
            status: "ACTIVE",
          },
          ...members,
        ])
        setModalOpen(false)
        setForm({ phone: "", name: "", deptName: "行政综合部", role: "公文起草专员", allowedApps: ["workbuddy"], monthlyTokenCap: 10_000_000 })
        alert(`🎉 成功为【${form.name} (${form.phone})】分配 ${(form.monthlyTokenCap / 10_000).toFixed(0)}万 Token 算力与 WorkBuddy 授权，激活短信已自动下发！`)
      }
    } catch (err: any) {
      alert(err.message || "开通失败")
    }
  }

  // 调整额度
  const handleSaveAdjust = () => {
    if (!adjustTarget) return
    setMembers(members.map((m) => (m.id === adjustTarget.id ? { ...m, monthlyTokenCap: Number(newCap) } : m)))
    setAdjustModalOpen(false)
    alert(`已将【${adjustTarget.name}】的月度算力额度调整为 ${(Number(newCap) / 10_000).toFixed(0)}万 Token`)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("已复制: " + text)
  }

  return (
    <div className={`space-y-4 ${embedded ? "p-3" : "p-6 max-w-7xl mx-auto"}`}>
      {/* 顶部企业身份 Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500 text-white rounded tracking-wider">
                政企自服务专区 (CPC)
              </span>
              {ticket && (
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                  🔑 免密单点已生效 ({ticket.slice(0, 12)}...)
                </span>
              )}
              <span className="text-xs text-slate-300 font-mono">纳税人识别号: {quota?.creditCode || "11440000MB2D00001X"}</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {quota?.enterpriseName || "广东省政务服务和数据管理局"}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              签约套餐：<span className="text-amber-300 font-bold">{quota?.tierName || "旗舰智算融合套餐"}</span> • 运营中枢：<span className="text-blue-300 font-bold">RoMA 应算通</span> • 算力供给：中国移动 MOMA 智算集群
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 切换模拟机构 */}
            <select
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="gd-gov-data" className="text-slate-900">广东省政务服务和数据管理局 (1亿Token)</option>
              <option value="yue-transport-tech" className="text-slate-900">广东省交通数智科技集团 (8000万Token)</option>
            </select>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors whitespace-nowrap"
            >
              + 为员工开通算力
            </button>
          </div>
        </div>

        {/* 算力资产大盘卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div>
            <div className="text-[11px] text-slate-400">本月可用算力总量</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
              {((quota?.tokensTotal || 100_000_000) / 10_000).toLocaleString()} <span className="text-xs font-normal">万 Token</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">本月剩余可用余额</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              {((quota?.tokensRemain || 82_000_000) / 10_000).toLocaleString()} <span className="text-xs font-normal">万 Token</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">折合移动豆余额</div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
              {(quota?.momaBeansBalance || 82_000).toLocaleString()} <span className="text-xs font-normal">粒 Beans</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">席位分配状态</div>
            <div className="text-2xl font-extrabold text-blue-300 font-mono mt-0.5">
              {members.length} / {quota?.seatsTotal || 100} <span className="text-xs font-normal">席 (已激活)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 挂载的政企私有 MCP 资产条 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏛️</span>
          <div>
            <span className="text-xs font-bold text-slate-900">本单位已自动注入的政企私有 MCP 连接器：</span>
            <span className="text-xs text-slate-500 ml-1">员工登录智能体客户端后将自动挂载以下内网工具，无需手动配置</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(quota?.boundMcps || []).map((mcp, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1">
              <span>⚡</span> {mcp.name} <span className="text-[10px] font-mono text-purple-500">({mcp.version})</span>
            </span>
          ))}
        </div>
      </div>

      {/* 员工手机号授权与配额管理表格 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              本单位员工手机号开户与智能体授权台账
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              员工在腾讯 WorkBuddy / 阿里 Qoder 客户端输入下方手机号，即可免密直连本单位算力池
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            + 开通员工
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">员工姓名 / 手机号</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">部门 / 职务</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">授权智能体应用</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">月度算力上限</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">本月已消耗</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">状态</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase min-w-[140px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {members.map((m) => {
                const remain = Math.max(0, m.monthlyTokenCap - m.usedTokens)
                const percent = Math.min(100, Math.round((m.usedTokens / m.monthlyTokenCap) * 100))
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] font-mono text-blue-600 font-semibold">{m.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{m.deptName}</div>
                      <div className="text-[11px] text-slate-400">{m.role}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.allowedApps.map((app, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[10px] font-bold">
                            {app === "workbuddy" ? "腾讯 WorkBuddy" : app === "qoder" ? "阿里 Qoder" : app === "trae" ? "字节 Trae" : "Cherry Studio"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {(m.monthlyTokenCap / 10_000).toLocaleString()} 万 Token
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-mono text-slate-600">{(m.usedTokens / 10_000).toFixed(1)} 万 ({percent}%)</div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className={`h-full ${percent > 80 ? "bg-rose-500" : "bg-blue-600"}`} style={{ width: `${percent}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                        正常使用
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setAdjustTarget(m)
                          setNewCap(m.monthlyTokenCap)
                          setAdjustModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        调整额度
                      </button>
                      <button
                        onClick={() => copyText(`workbuddy://connect?token=sk-gov-${m.phone}&mcp=mcp-gov-doc`)}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                      >
                        复制唤起码
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 开通员工弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">📱 为员工开通算力与智能体授权</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">员工手机号 (登录 SSO 凭据) *</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="如 13800000000"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">员工姓名 *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="如 陈科长"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">所属处室/部门</label>
                  <input
                    type="text"
                    value={form.deptName}
                    onChange={(e) => setForm({ ...form, deptName: e.target.value })}
                    placeholder="如 政策法规处"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">月度算力额度上限 (Tokens) *</label>
                <select
                  value={form.monthlyTokenCap}
                  onChange={(e) => setForm({ ...form, monthlyTokenCap: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                >
                  <option value={5_000_000}>500 万 Tokens / 月 (基础办公)</option>
                  <option value={10_000_000}>1,000 万 Tokens / 月 (重点协同)</option>
                  <option value={20_000_000}>2,000 万 Tokens / 月 (公文起草)</option>
                  <option value={30_000_000}>3,000 万 Tokens / 月 (架构与研发)</option>
                  <option value={50_000_000}>5,000 万 Tokens / 月 (高频攻坚)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">授权接入的智能体应用</label>
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.allowedApps.includes("workbuddy")}
                      onChange={(e) => {
                        const apps = e.target.checked
                          ? [...form.allowedApps, "workbuddy"]
                          : form.allowedApps.filter((a) => a !== "workbuddy")
                        setForm({ ...form, allowedApps: apps })
                      }}
                      className="rounded text-blue-600"
                    />
                    <span>腾讯 WorkBuddy (党政机关红头公文排版 / 会议纪要)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.allowedApps.includes("qoder")}
                      onChange={(e) => {
                        const apps = e.target.checked
                          ? [...form.allowedApps, "qoder"]
                          : form.allowedApps.filter((a) => a !== "qoder")
                        setForm({ ...form, allowedApps: apps })
                      }}
                      className="rounded text-blue-600"
                    />
                    <span>阿里 Qoder (国央企内网源码合规审计 / 智能研发)</span>
                  </label>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700">
                📲 开通后系统将自动下发短信通知与免密激活 DeepLink 短链，员工手机即可开箱即用。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-xs"
                >
                  确认开通并下发
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 调整额度弹窗 */}
      {adjustModalOpen && adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">⚡ 调整【{adjustTarget.name}】的算力额度</h3>
            <div>
              <label className="block text-slate-600 font-medium mb-1">新的月度算力额度 (Tokens)</label>
              <input
                type="number"
                value={newCap}
                onChange={(e) => setNewCap(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
              />
              <div className="text-[11px] text-slate-400 mt-1">折合 {(newCap / 10_000).toLocaleString()} 万 Token / 月</div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAdjustModalOpen(false)}
                className="px-4 py-1.5 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAdjust}
                className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-xs"
              >
                保存调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnterprisePortalCpcPage
