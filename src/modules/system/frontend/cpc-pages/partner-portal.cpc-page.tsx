"use client"

import { useState } from "react"
import Link from "next/link"

// 代理商动态展位定义
export type PartnerWidgetType =
  | "quota_pool"        // 算力批发总池切片划拨
  | "tenant_fleet"      // 所辖企业租户与一键代管
  | "commission_wallet" // 20% 算力清分与佣金提现
  | "promo_qrcode"      // 专属展业码与推广引流
  | "usage_heatmap"     // 实时用量热力图与预警
  | "sub_partners"      // 下级分销渠道网络

export type PartnerWidgetConfig = {
  id: PartnerWidgetType
  title: string
  icon: string
  description: string
  enabled: boolean
  sort: number
}

const DEFAULT_WIDGETS: PartnerWidgetConfig[] = [
  { id: "quota_pool", title: "算力批发大池切片划拨", icon: "💎", description: "向名下企业像切蛋糕一样自由划拨月度 Token 配额", enabled: true, sort: 1 },
  { id: "tenant_fleet", title: "企业客户舰队与一键代管", icon: "🏢", description: "名下全部企业客户全生命周期管理与免密代管开户", enabled: true, sort: 2 },
  { id: "commission_wallet", title: "20% 算力清分与佣金钱包", icon: "💰", description: "汇聚全网客户公文/代码消耗移动豆，实时提现", enabled: true, sort: 3 },
  { id: "promo_qrcode", title: "专属展业码与拓客引流", icon: "📱", description: "专属带工号推广二维码，扫码签约自动终身绑定", enabled: true, sort: 4 },
  { id: "usage_heatmap", title: "实时用量热力图与预警", icon: "📈", description: "客户余额低于 20% 自动预警并一键推升档包", enabled: true, sort: 5 },
  { id: "sub_partners", title: "下级分销渠道网络", icon: "🤝", description: "发展二级代理商，获取多级分销管道收益", enabled: true, sort: 6 },
]

export function PartnerPortalCpcPage() {
  const [widgets, setWidgets] = useState<PartnerWidgetConfig[]>(DEFAULT_WIDGETS)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showAllocateModal, setShowAllocateModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showPosterModal, setShowPosterModal] = useState(false)
  const [partnerLevel] = useState("🥇 城市独家金牌合伙人")
  const [partnerName] = useState("广东数字智算科技有限公司 (陈总)")
  const [promoCode] = useState("GD9921")
  const [totalPool, setTotalPool] = useState(1000000000) // 10 亿 Token
  const [allocatedPool, setAllocatedPool] = useState(230000000) // 2.3 亿
  const [walletBalance, setWalletBalance] = useState(15200.0) // ￥15,200

  // 名下企业客户真实数据
  const [managedTenants, setManagedTenants] = useState([
    { id: "2", name: "广东省政务服务和数据管理局", orgCode: "gd-gov-data", totalTokens: 100000000, usedTokens: 18000000, status: "ACTIVE", beans: 18000 },
    { id: "3", name: "广东省交通数智科技集团有限公司", orgCode: "yue-transport-tech", totalTokens: 80000000, usedTokens: 24000000, status: "ACTIVE", beans: 24000 },
    { id: "4", name: "广州市数字政府运营中心", orgCode: "gz-digital-gov", totalTokens: 50000000, usedTokens: 12000000, status: "ACTIVE", beans: 12000 },
  ])

  const [selectedTenantForAlloc, setSelectedTenantForAlloc] = useState(managedTenants[0]?.id || "2")
  const [allocAmount, setAllocAmount] = useState(10000000) // 默认切 1000 万

  const toggleWidget = (id: PartnerWidgetType) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    )
  }

  const handleAllocate = () => {
    setAllocatedPool((prev) => prev + allocAmount)
    setManagedTenants((prev) =>
      prev.map((t) => (t.id === selectedTenantForAlloc ? { ...t, totalTokens: t.totalTokens + allocAmount } : t))
    )
    setShowAllocateModal(false)
    alert("✓ 算力配额切片划拨成功！目标企业自服务大盘已实时生效。")
  }

  const remainingPool = totalPool - allocatedPool
  const poolUsageRate = Math.round((allocatedPool / totalPool) * 100)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white antialiased font-sans flex flex-col">
      {/* 1. 顶部中控导轨 (Top Navigation) */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-500/25">
            🤝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">RoMA 应算通</span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="text-xs font-semibold text-slate-300">渠道代理商与合伙人中控门户</span>
              <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-medium">
                {partnerLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>自定义展位组合 ({widgets.filter((w) => w.enabled).length}/{widgets.length})</span>
          </button>

          <Link
            href="/portal/enterprise"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-all flex items-center gap-1"
          >
            <span>代管直入企业大盘</span>
            <span>↗</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (confirm("确定要退出代理商中控端吗？")) {
                localStorage.removeItem("ruoyi_token")
                window.location.href = "/login"
              }
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <span>🚪</span>
            <span>退出</span>
          </button>
        </div>
      </header>

      {/* 2. 核心大盘展位矩阵 (Dashboard Body) */}
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl mx-auto w-full">
        {/* 代理商欢迎面板 */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{partnerName}</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                ● 授权合作中 (合规单层返佣: 20%)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              中国移动 MOMA 智算中心生态合伙人 • 邀请码: <strong className="text-blue-400 font-mono">{promoCode}</strong> • 覆盖区域: 广州市、佛山市全域政企
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowPosterModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <span>🖼️</span>
              <span>生成开户邀请海报</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAllocateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>切片划拨算力</span>
            </button>
            <button
              type="button"
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>💰</span>
              <span>20% 佣金提现</span>
            </button>
          </div>
        </div>

        {/* 动态展位 1: 算力批发总池切片划拨 (Master Quota Pool) */}
        {widgets.find((w) => w.id === "quota_pool")?.enabled && (
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <h2 className="text-sm font-bold text-white">算力批发采购总池与切片概览</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                已切片划拨: <strong className="text-blue-400">{(allocatedPool / 100000000).toFixed(2)} 亿</strong> / 10.00 亿 Token ({poolUsageRate}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">批发采购总池</div>
                <div className="text-2xl font-black text-white font-mono">10.00 <span className="text-xs text-slate-400 font-normal">亿 Token</span></div>
                <div className="text-[10px] text-slate-500">中国移动 MOMA 智算中心直供</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">已划拨给企业</div>
                <div className="text-2xl font-black text-blue-400 font-mono">2.30 <span className="text-xs text-slate-400 font-normal">亿 Token</span></div>
                <div className="text-[10px] text-slate-500">分配至名下 3 家核心企业</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">当前可划拨剩余大池</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{(remainingPool / 100000000).toFixed(2)} <span className="text-xs text-slate-400 font-normal">亿 Token</span></div>
                <div className="text-[10px] text-slate-500">可随时新开企业划拨</div>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${poolUsageRate}%` }} />
            </div>
          </div>
        )}

        {/* 动态展位 2: 企业客户舰队与一键代管 (Tenant Fleet Control) */}
        {widgets.find((w) => w.id === "tenant_fleet")?.enabled && (
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏢</span>
                <h2 className="text-sm font-bold text-white">所辖企业客户舰队 (Tenant Fleet)</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPosterModal(true)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <span>+</span>
                <span>邀请新企业开户</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-medium">
                    <th className="pb-3 px-3">企业客户名称</th>
                    <th className="pb-3 px-3">机构代号</th>
                    <th className="pb-3 px-3">已划拨配额</th>
                    <th className="pb-3 px-3">本月消耗量</th>
                    <th className="pb-3 px-3">产生移动豆 (20%分成)</th>
                    <th className="pb-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {managedTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-white">{t.name}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-400">{t.orgCode}</td>
                      <td className="py-3.5 px-3 font-mono text-blue-400">{(t.totalTokens / 10000000).toFixed(0)} 千万</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{(t.usedTokens / 10000000).toFixed(0)} 千万</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300 font-bold">{t.beans.toLocaleString()} 粒</td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTenantForAlloc(t.id)
                            setShowAllocateModal(true)
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          划拨算力
                        </button>
                        <Link
                          href={`/portal/enterprise?tenantId=${t.id}`}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          ⚡ 一键代管
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 动态展位 3: 20% 算力清分与佣金钱包 (Commission Wallet) */}
        {widgets.find((w) => w.id === "commission_wallet")?.enabled && (
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h2 className="text-sm font-bold text-white">20% 算力清分与长尾佣金钱包</h2>
              </div>
              <span className="text-xs text-emerald-400 font-mono">严格遵循税法 • 增值税专用发票对公结算</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">可提现佣金余额</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">￥{walletBalance.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500">支持对公账户一键开票提现</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">累计消纳移动豆</div>
                <div className="text-2xl font-black text-amber-300 font-mono">54,000 <span className="text-xs font-normal">粒</span></div>
                <div className="text-[10px] text-slate-500">名下所有企业公文与代码消耗</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">累计已提现收益</div>
                <div className="text-2xl font-black text-white font-mono">￥60,800.00</div>
                <div className="text-[10px] text-slate-500">已开具增值税专用发票</div>
              </div>
            </div>
          </div>
        )}

        {/* 动态展位 4: 专属展业码与拓客引流 (Promo QR) */}
        {widgets.find((w) => w.id === "promo_qrcode")?.enabled && (
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <h2 className="text-sm font-bold text-white">合规邀请裂变中心与专属短链</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">遵循《禁止传销条例》• 零门槛合规分销</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-white">
                  合伙人专属开户短链: <code className="text-blue-400 font-mono">https://roma.link/i/{promoCode}</code>
                </div>
                <p className="text-slate-400 text-[11px]">
                  新政企客户扫码申请开户或点击链接，系统自动终身锁定归属于当前代理商，享受 20% 算力长尾清分。
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPosterModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl whitespace-nowrap"
                >
                  生成开户海报
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(`https://roma.link/i/${promoCode}`)
                    alert(`✓ 专属开户短链 https://roma.link/i/${promoCode} 已复制到剪贴板！`)
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl whitespace-nowrap"
                >
                  复制推广短链
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 弹窗 1: 邀请海报与专属二维码 (Poster Modal) */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-center text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-sm">🏛️ 企业算力开户专属邀请函</span>
              <button type="button" onClick={() => setShowPosterModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="p-4 bg-white rounded-2xl space-y-2 text-slate-900 shadow-inner">
              <div className="font-black text-base text-blue-900 tracking-tight">RoMA 应算通</div>
              <div className="text-[11px] text-slate-600 font-medium">政企智能公文与 DeepSeek 算力专线</div>
              
              <div className="w-36 h-36 mx-auto bg-slate-100 border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center font-mono text-[11px] text-blue-700">
                <span className="text-3xl mb-1">📱</span>
                <span>[ 二维码 ]</span>
                <span className="text-[9px] text-slate-500 mt-1">code: {promoCode}</span>
              </div>

              <div className="text-[10px] text-slate-500 pt-1">
                推荐合伙人: <strong>{partnerName}</strong>
              </div>
              <div className="text-[10px] bg-amber-50 text-amber-800 p-1.5 rounded font-medium">
                🎁 扫码立享 1000 万公文排版与代码体验算力大礼包
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-left space-y-1">
              <div className="text-slate-300 font-semibold">⚖️ 法律合规声明：</div>
              <div>• 零加盟费，收益 100% 来源于企业真实算力消纳；</div>
              <div>• 严格遵守《禁止传销条例》，仅支持合法单层佣金。</div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("✓ 邀请海报高清图片已生成并保存！可直接发送给政企客户负责人。")
                setShowPosterModal(false)
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/25"
            >
              保存高清海报分享微信
            </button>
          </div>
        </div>
      )}

      {/* 弹窗 2: 动态展位组合配置器 (Widget Composer Modal) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚙️ 自定义代理商中控展位组合</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 text-[11px]">
              按需勾选或关闭中控台展位，系统将自动记住您的工作台排版配置：
            </p>

            <div className="space-y-2.5">
              {widgets.map((w) => (
                <div
                  key={w.id}
                  onClick={() => toggleWidget(w.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${w.enabled ? "bg-blue-950/40 border-blue-500/40 text-white" : "bg-slate-950 border-slate-800 text-slate-500"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{w.icon}</span>
                    <div>
                      <div className="font-bold text-xs">{w.title}</div>
                      <div className="text-[10px] text-slate-400">{w.description}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={w.enabled}
                    onChange={() => {}}
                    className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
              >
                保存工作台布局
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗 3: 切片划拨算力 (Master Quota Slicing Modal) */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚡ 算力总池切片划拨</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">选择目标企业客户</label>
                <select
                  value={selectedTenantForAlloc}
                  onChange={(e) => setSelectedTenantForAlloc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  {managedTenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (当前配额: {t.totalTokens / 10000000}千万)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">划拨切片数量 (Token)</label>
                <select
                  value={allocAmount}
                  onChange={(e) => setAllocAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none font-mono"
                >
                  <option value={10000000}>+ 1,000 万 Token (10,000 移动豆)</option>
                  <option value={30000000}>+ 3,000 万 Token (30,000 移动豆)</option>
                  <option value={50000000}>+ 5,000 万 Token (50,000 移动豆)</option>
                  <option value={100000000}>+ 10,000 万 Token (1 亿大包)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-blue-300 text-[11px]">
                💡 划拨后将直接从您的 10 亿大池中扣除，并实时记入不可篡改的双向算力审计流水。
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAllocate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  立即划拨
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗 4: 佣金提现申请 (Withdraw Modal) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>💰 20% 算力清分佣金提现</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">当前可提现金额</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">￥{walletBalance.toFixed(2)}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">对公银行账户</label>
                <input
                  type="text"
                  readOnly
                  value="招商银行广州分行营业部 (账号: 1209 0088 1102 991)"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-300 font-mono text-[11px]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowWithdrawModal(false)
                  setWalletBalance(0)
                  alert("✓ 提现申请已提交！系统已生成增值税专票代开工单，款项将在 T+1 日自动汇入对公账户。")
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
              >
                确认提交对公提现申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
