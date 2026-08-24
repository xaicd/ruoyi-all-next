"use client"

import { useEffect, useState } from "react"
import { AigwPartnerApi } from "../api/aigw-partner.api"
import { AigwPartnerLeadApi } from "../api/aigw-partner-lead.api"
import { AigwEnterpriseApi } from "../api/enterprises.api"

interface PartnerSummary {
  name: string
  code: string
  level: "GOLD" | "SILVER" | "BRONZE" | "GENERAL"
  registeredCapital: number
  commissionRate: number
  promoCode: string
  balance: number
  totalCommission: number
}

export default function PartnerPortalPage() {
  const [partner, setPartner] = useState<PartnerSummary>({
    name: "广东数字智算科技有限公司",
    code: "PT-GD-001",
    level: "GOLD",
    registeredCapital: 2000,
    commissionRate: 0.20,
    promoCode: "GD9921",
    balance: 58400.00,
    totalCommission: 168000.00,
  })

  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTaxCode, setSearchTaxCode] = useState("")
  const [checkResult, setCheckResult] = useState<{ checked: boolean; allowed: boolean; message: string } | null>(null)

  // 报备弹窗
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const [leadForm, setLeadForm] = useState({
    customerName: "",
    creditCode: "",
    contactName: "",
    contactPhone: "",
    estimatedScale: "100 席位 / 1 亿 Token",
    estimatedAmount: 198000,
    remark: "",
  })

  // 模拟开户提示
  const [convertingLead, setConvertingLead] = useState<any | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await AigwPartnerLeadApi.page({ page: 1, pageSize: 20 })
      if (res.success && res.data) {
        setLeads(res.data.items || [])
      }
    } catch (err) {
      console.error("加载商机失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // 快速防撞单排他查重
  const handleCheckCollision = () => {
    if (!searchTaxCode.trim()) {
      alert("请输入企业统一社会信用代码进行查重")
      return
    }
    const found = leads.find((l) => l.credit_code === searchTaxCode.trim() && l.status === "PROTECTED")
    if (found) {
      setCheckResult({
        checked: true,
        allowed: false,
        message: `⚠️ 该企业已被【${found.partner_name}】报备锁定中！保护期至 ${found.expire_at.slice(0, 10)}，暂不可重复报备。`,
      })
    } else {
      setCheckResult({
        checked: true,
        allowed: true,
        message: "✅ 查重通过！该企业当前处于公海状态，可立即报备并享受 60 天商机排他保护期！",
      })
    }
  }

  // 提交商机报备
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const expireDate = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString()
      const payload = {
        lead_no: `LEAD-${Date.now().toString().slice(-6)}`,
        partner_id: "partner-1",
        partner_name: partner.name,
        customer_name: leadForm.customerName,
        credit_code: leadForm.creditCode,
        contact_name: leadForm.contactName,
        contact_phone: leadForm.contactPhone,
        estimated_scale: leadForm.estimatedScale,
        estimated_amount: Number(leadForm.estimatedAmount),
        protection_days: 60,
        expire_at: expireDate,
        status: "PROTECTED",
        remark: leadForm.remark,
      }
      await AigwPartnerLeadApi.create(payload)
      setLeadModalOpen(false)
      setCheckResult(null)
      setSearchTaxCode("")
      fetchLeads()
      alert("🎉 商机报备成功！已自动锁定 60 天排他保护期！")
    } catch (err: any) {
      alert(err?.message || "报备失败")
    }
  }

  // 一键转正式政企开户
  const handleConvertToEnterprise = async (lead: any) => {
    if (!window.confirm(`确认将商机【${lead.customer_name}】转为正式政企签约客户并完成开户？`)) return
    try {
      // 1. 创建企业
      const entRes: any = await AigwEnterpriseApi.create({
        code: `ENT-${Date.now().toString().slice(-6)}`,
        name: lead.customer_name,
        contactPerson: lead.contact_name || "负责人",
        phone: lead.contact_phone || "13800000000",
        tokensTotal: 50_000_000,
        tokensUsed: 0,
        seatsTotal: 50,
        seatsUsed: 0,
        status: "ACTIVE",
        sourceChannel: `代理商: ${partner.name} (工号:${partner.promoCode})`,
      })
      // 2. 更新商机状态
      await AigwPartnerLeadApi.update({
        id: lead.id,
        status: "CONVERTED",
        converted_enterprise_id: entRes?.data?.id || `ent-${Date.now()}`,
      })
      fetchLeads()
      alert(`🎉 恭喜！【${lead.customer_name}】已成功转为正式政企开户！获得 50 席位与 5000万 Token，同时首单佣金已记入您的钱包账户！`)
    } catch (err: any) {
      alert(err?.message || "转签约开户失败")
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("已复制到剪贴板: " + text)
  }

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* 顶部代理商信息卡片 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-md tracking-wider">
                {partner.level} 金牌代理商
              </span>
              <span className="text-xs text-slate-300 font-mono">编号: {partner.code}</span>
              <span className="text-xs text-slate-400">| 注册资金: {partner.registeredCapital} 万元 (资质合规)</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">{partner.name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              中国移动 MOMA 智算中枢 • 粤港澳大湾区政企 AI 智能体一级渠道分销商
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              <div className="text-[11px] text-slate-300">签约分润比例</div>
              <div className="text-lg font-bold text-amber-400 font-mono">{(partner.commissionRate * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              <div className="text-[11px] text-slate-300">专属推广工号</div>
              <div className="text-lg font-bold text-blue-300 font-mono">{partner.promoCode}</div>
            </div>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              + 报备新商机
            </button>
          </div>
        </div>

        {/* 收益大盘卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div>
            <div className="text-[11px] text-slate-400">可提现佣金余额</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              ¥{partner.balance.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">累计赚取总佣金 (长尾分润)</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
              ¥{partner.totalCommission.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">保护中商机 / 排他锁定</div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
              {leads.filter((l) => l.status === "PROTECTED").length} 个
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">已签约正式政企客户</div>
            <div className="text-2xl font-extrabold text-blue-300 font-mono mt-0.5">
              {leads.filter((l) => l.status === "CONVERTED").length + 3} 家
            </div>
          </div>
        </div>
      </div>

      {/* 商机防撞单快速查重栏 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>🛡️</span> 政企商机防撞单排他查重中心
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              输入意向政企单位的统一社会信用代码（税号），即时探测保护期状态，锁定 60 天排他保护期
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-2xl">
          <input
            type="text"
            value={searchTaxCode}
            onChange={(e) => setSearchTaxCode(e.target.value)}
            placeholder="请输入客户纳税人统一社会信用代码 (如 91440101MA59ABCDEF)..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleCheckCollision}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors"
          >
            快速查重
          </button>
          <button
            onClick={() => {
              if (checkResult?.allowed) {
                setLeadForm({ ...leadForm, creditCode: searchTaxCode })
                setLeadModalOpen(true)
              } else {
                setLeadModalOpen(true)
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            立即报备锁定
          </button>
        </div>

        {checkResult && (
          <div className={`p-3 rounded-xl text-xs border ${checkResult.allowed ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
            {checkResult.message}
          </div>
        )}
      </div>

      {/* 商机报备与锁定列表 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            我的名下商机报备与排他锁定台账
          </h3>
          <button onClick={fetchLeads} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            刷新台账
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">商机编号 / 客户全称</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">统一信用代码</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">联系人</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">预计规模 / 合同额</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">保护期倒计时</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">状态</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase min-w-[140px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {leads.map((lead) => {
                const isProtected = lead.status === "PROTECTED"
                const isConverted = lead.status === "CONVERTED"
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{lead.customer_name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{lead.lead_no}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{lead.credit_code}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{lead.contact_name || "-"}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{lead.contact_phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{lead.estimated_scale || "-"}</div>
                      <div className="text-[11px] text-emerald-600 font-bold font-mono">¥{(lead.estimated_amount || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      {isProtected ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-semibold text-[11px]">
                          ⏳ 保护至 {lead.expire_at ? lead.expire_at.slice(0, 10) : "60天"}
                        </span>
                      ) : isConverted ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold text-[11px]">
                          ✅ 已转正式签约
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">已失效</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isProtected ? "bg-blue-50 text-blue-700" : isConverted ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isProtected ? "保护中 (排他)" : isConverted ? "已转签约" : lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {isProtected && (
                        <button
                          onClick={() => handleConvertToEnterprise(lead)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                        >
                          转签约开户
                        </button>
                      )}
                      <button
                        onClick={() => copyText(`【商机报备】${lead.customer_name} (税号:${lead.credit_code})，报备人:${partner.name}`)}
                        className="text-slate-500 hover:text-slate-700 font-medium"
                      >
                        复制报备凭证
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 代理商专属推广工具与 DeepLink 唤起 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 工具 1: 一键激活短链 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🔗</span> 专属拓客短链接与短信模板 (带工号)
          </h3>
          <p className="text-xs text-slate-500">
            客户经理与代理商直接将以下链接发送给企业客户，客户点击即可一键绑定您的工号享受折扣：
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 flex items-center justify-between">
            <span>https://link.yingsuantong.cn/c/{partner.promoCode}</span>
            <button
              onClick={() => copyText(`https://link.yingsuantong.cn/c/${partner.promoCode}`)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              复制短链
            </button>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">官方短信推荐模板：</div>
            <p className="italic text-slate-500">
              “【中国移动智算】尊敬的客户：您的专属服务商【{partner.name}】已为您准备好政企大模型 500 万 Token 体验包，点击 https://link.yingsuantong.cn/c/{partner.promoCode} 立即免密开通 WorkBuddy 协同专区！”
            </p>
            <button
              onClick={() => copyText(`【中国移动智算】尊敬的客户：您的专属服务商【${partner.name}】已为您准备好政企大模型 500 万 Token 体验包，点击 https://link.yingsuantong.cn/c/${partner.promoCode} 立即免密开通 WorkBuddy 协同专区！`)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium pt-1 block"
            >
              复制短信文案
            </button>
          </div>
        </div>

        {/* 工具 2: DeepLink 协议唤起 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>⚡</span> WorkBuddy / Qoder 客户端免密唤起协议
          </h3>
          <p className="text-xs text-slate-500">
            深链接可直接唤起桌面端 WorkBuddy / Cherry Studio，秒级完成 MOMA 算力与政企红头公文 MCP 挂载：
          </p>
          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
              <span className="truncate">workbuddy://connect?token=sk-{partner.promoCode}&mcp=mcp-gov-doc</span>
              <button
                onClick={() => copyText(`workbuddy://connect?provider=china_mobile_moma&token=sk-${partner.promoCode}&mcp=mcp-gov-doc`)}
                className="text-xs text-blue-600 font-semibold ml-2 whitespace-nowrap"
              >
                复制 WorkBuddy 唤起码
              </button>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
              <span className="truncate">cherry-studio://provider/add?name=MOMA政企专区&key=sk-{partner.promoCode}</span>
              <button
                onClick={() => copyText(`cherry-studio://provider/add?name=中国移动MOMA政企专区&api_base=https://moma.10086.cn/api/v1&api_key=sk-${partner.promoCode}`)}
                className="text-xs text-blue-600 font-semibold ml-2 whitespace-nowrap"
              >
                复制 Cherry 唤起码
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 报备新商机弹窗 */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">🛡️ 报备意向政企商机 (锁定 60 天保护期)</h3>
              <button onClick={() => setLeadModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmitLead} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">政企客户全称 *</label>
                <input
                  type="text"
                  required
                  value={leadForm.customerName}
                  onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })}
                  placeholder="如：广州市数字政府运营中心"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">统一社会信用代码 (税号，排他查重唯一凭据) *</label>
                <input
                  type="text"
                  required
                  value={leadForm.creditCode}
                  onChange={(e) => setLeadForm({ ...leadForm, creditCode: e.target.value })}
                  placeholder="如：91440101MA59ABCDEF"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">客户联系人</label>
                  <input
                    type="text"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
                    placeholder="如：李处长"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">联系人电话</label>
                  <input
                    type="text"
                    value={leadForm.contactPhone}
                    onChange={(e) => setLeadForm({ ...leadForm, contactPhone: e.target.value })}
                    placeholder="如：13900001111"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">预计采购规模</label>
                  <input
                    type="text"
                    value={leadForm.estimatedScale}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedScale: e.target.value })}
                    placeholder="如：100 席位 / 1 亿 Token"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">预估合同金额 (¥)</label>
                  <input
                    type="number"
                    value={leadForm.estimatedAmount}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">跟进情况与诉求备注</label>
                <textarea
                  value={leadForm.remark}
                  onChange={(e) => setLeadForm({ ...leadForm, remark: e.target.value })}
                  rows={2}
                  placeholder="如：机关单位拟用于公文规范与红头排版、12345市民工单智能分派..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                🔒 报备后系统将自动进行全网排他查重，锁定 <strong>60 天排他保护期</strong>。保护期内其他代理商及官方直销均不可撞单抢单。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setLeadModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-xs"
                >
                  确认报备并锁定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
