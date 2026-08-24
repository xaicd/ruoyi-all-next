"use client"

import React, { useState, useEffect, useCallback } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

export type SystemPartnerItem = {
  id: string
  partnerCode: string
  name: string
  level: "GOLD" | "SILVER" | "BRONZE" | "STRATEGIC"
  registeredCapital?: number
  creditCode: string
  contactName: string
  contactPhone: string
  region: string
  commissionRate: number
  promoCode: string
  balance: number
  totalCommission: number
  allowedTenantIds: string[]
  masterPoolTokens: number
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export function SystemPartnersPage() {
  const [items, setItems] = useState<SystemPartnerItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [keyword, setKeyword] = useState("")
  const [level, setLevel] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false)
  const [scopeModalOpen, setScopeModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SystemPartnerItem | null>(null)
  const [selectedPartnerForScope, setSelectedPartnerForScope] = useState<SystemPartnerItem | null>(null)

  // 表单状态
  const [formData, setFormData] = useState<{
    partnerCode: string
    name: string
    level: "GOLD" | "SILVER" | "BRONZE" | "STRATEGIC"
    creditCode: string
    contactName: string
    contactPhone: string
    region: string
    commissionRate: number
    promoCode: string
    masterPoolTokens: number
    status: "ACTIVE" | "DISABLED"
    allowedTenantIds: string[]
  }>({
    partnerCode: "",
    name: "",
    level: "GOLD",
    creditCode: "",
    contactName: "",
    contactPhone: "",
    region: "广东省-广州市",
    commissionRate: 0.20,
    promoCode: "",
    masterPoolTokens: 1000000000,
    status: "ACTIVE",
    allowedTenantIds: ["2", "3", "4"],
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res: any = await request.get("/api/v1/admin/system/partners", {
        params: { page, pageSize, keyword: keyword.trim() || undefined, level: level || undefined, status: status || undefined },
      })
      if (res.success) {
        setItems(res.items || [])
        setTotal(res.total || 0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, keyword, level, status])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormData({
      partnerCode: `PT-${Date.now().toString().slice(-4)}`,
      name: "",
      level: "GOLD",
      creditCode: "",
      contactName: "",
      contactPhone: "",
      region: "广东省-广州市",
      commissionRate: 0.20,
      promoCode: `GD${Math.floor(1000 + Math.random() * 9000)}`,
      masterPoolTokens: 1000000000,
      status: "ACTIVE",
      allowedTenantIds: ["2", "3", "4"],
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (item: SystemPartnerItem) => {
    setEditingItem(item)
    setFormData({
      partnerCode: item.partnerCode,
      name: item.name,
      level: item.level,
      creditCode: item.creditCode,
      contactName: item.contactName,
      contactPhone: item.contactPhone,
      region: item.region,
      commissionRate: item.commissionRate,
      promoCode: item.promoCode,
      masterPoolTokens: item.masterPoolTokens,
      status: item.status,
      allowedTenantIds: item.allowedTenantIds,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await request.put("/api/v1/admin/system/partners", { id: editingItem.id, ...formData })
      } else {
        await request.post("/api/v1/admin/system/partners", formData)
      }
      setModalOpen(false)
      loadData()
    } catch (err: any) {
      alert(err.message || "保存失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要解除该合伙人合作关系吗？")) return
    try {
      await request.delete(`/api/v1/admin/system/partners?id=${id}`)
      loadData()
    } catch (err: any) {
      alert(err.message || "删除失败")
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. 页面 Header 规范 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>🤝</span>
            <span>渠道代理商与合伙人管理</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            全网渠道合伙人准入准出、20% 算力清分比例、算力大池切片与所辖企业数据权限管理
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>刷新</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>签约新合伙人</span>
          </button>
        </div>
      </div>

      {/* 2. 搜索栏 Search Container */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索合伙人名称 / 手机号 / 编码..."
            className="w-64 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="">全部代理等级</option>
            <option value="GOLD">🥇 金牌独家合伙人</option>
            <option value="SILVER">🥈 银牌区域代理</option>
            <option value="BRONZE">🥉 铜牌分销伙伴</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="">全部状态</option>
            <option value="ACTIVE">正常合作 (ACTIVE)</option>
            <option value="DISABLED">暂停合作 (DISABLED)</option>
          </select>
          <button
            type="button"
            onClick={() => { setPage(1); loadData() }}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            查询
          </button>
          <button
            type="button"
            onClick={() => { setKeyword(""); setLevel(""); setStatus(""); setPage(1) }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
          >
            重置
          </button>
        </div>
        <div className="text-slate-500 text-[11px]">
          共纳管 <strong>{total}</strong> 家渠道生态合伙人
        </div>
      </div>

      {/* 3. 表格 Table 规范 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">合伙人信息</th>
              <th className="px-5 py-3">等级与区域</th>
              <th className="px-5 py-3">负责人 / 联系手机</th>
              <th className="px-5 py-3">签约返佣比例</th>
              <th className="px-5 py-3">算力大池配额</th>
              <th className="px-5 py-3">所辖授权企业</th>
              <th className="px-5 py-3">状态</th>
              <th className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">正在加载数据...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">暂无合伙人记录</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">编码: {item.partnerCode} • 信用码: {item.creditCode}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-semibold text-[11px]">
                      {item.level === "GOLD" ? "🥇 金牌独家" : item.level === "SILVER" ? "🥈 银牌区域" : "🥉 铜牌分销"}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{item.region}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{item.contactName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.contactPhone}</div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600 font-mono">
                    {(item.commissionRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-5 py-3.5 font-mono">
                    <div className="font-bold text-blue-600">{(item.masterPoolTokens / 100000000).toFixed(1)} 亿 Token</div>
                    <div className="text-[10px] text-slate-400">收益余额: ￥{item.balance.toLocaleString()}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPartnerForScope(item)
                        setScopeModalOpen(true)
                      }}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 text-[11px] font-medium transition-colors"
                    >
                      🛡️ {item.allowedTenantIds?.length || 0} 家授权企业 ▾
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                      {item.status === "ACTIVE" ? "● 正常合作" : "○ 暂停"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium"
                    >
                      解约
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 弹窗 1: 新增/编辑合伙人 Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? "编辑渠道合伙人信息" : "签约录入新渠道合伙人"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">合伙人企业全称 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="如: 广东数字智算科技有限公司"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">统一社会信用代码 *</label>
                  <input
                    type="text"
                    required
                    value={formData.creditCode}
                    onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="91440101MA..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">负责人姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="陈总"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">负责人手机号 (登录账号) *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="18600186000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">代理等级</label>
                  <select
                    value={formData.level}
                    onChange={(e: any) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="GOLD">🥇 金牌独家</option>
                    <option value="SILVER">🥈 银牌区域</option>
                    <option value="BRONZE">🥉 铜牌分销</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">签约返佣比例</label>
                  <select
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  >
                    <option value={0.20}>20% (标准金牌)</option>
                    <option value={0.18}>18% (银牌)</option>
                    <option value={0.15}>15% (铜牌)</option>
                    <option value={0.25}>25% (战略总代)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">批发采购总池 (亿 Token)</label>
                  <input
                    type="number"
                    value={formData.masterPoolTokens / 100000000}
                    onChange={(e) => setFormData({ ...formData, masterPoolTokens: Number(e.target.value) * 100000000 })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700">所辖企业租户数据授权 (Data Scope)</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>🏛️ 广东省政数局</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>🏢 交通数智集团</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>🏛️ 广州数字政府</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  保存合伙人信息
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 弹窗 2: 数据权限租户查看 Modal */}
      {scopeModalOpen && selectedPartnerForScope && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                【{selectedPartnerForScope.name}】所辖企业租户授权
              </h3>
              <button type="button" onClick={() => setScopeModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="font-bold text-blue-900">数据范围隔离模式: CUSTOM (自定义授权租户)</div>
                <div className="text-blue-700 text-[11px]">该代理商登录商户中控端只能查看并切片划拨以下所选企业：</div>
              </div>

              <div className="space-y-2 divide-y divide-slate-100">
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">🏛️ 广东省政务服务和数据管理局</span>
                  <span className="text-emerald-600 font-mono">已绑定 (租户2)</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">🏢 广东省交通数智科技集团有限公司</span>
                  <span className="text-emerald-600 font-mono">已绑定 (租户3)</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">🏛️ 广州市数字政府运营中心</span>
                  <span className="text-emerald-600 font-mono">已绑定 (租户4)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setScopeModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-medium rounded-lg"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
