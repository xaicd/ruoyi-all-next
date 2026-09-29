"use client"

import { useState, useEffect, useCallback } from "react"
import { mcpHubApi } from "../api/mcp-hub.api"
import { AigwMcpAsset, CreateMcpAssetInput } from "../../backend/types/aigw-mcp.types"
import { ViewModeSwitcher, ViewMode } from "@/modules/shared/frontend/components/view-mode-switcher"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

export default function AigwMcpHubPage() {
  const [items, setItems] = useState<AigwMcpAsset[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [selectedMcp, setSelectedMcp] = useState<AigwMcpAsset | null>(null)

  const [formData, setFormData] = useState<CreateMcpAssetInput>({
    mcpCode: "",
    name: "",
    category: "CUSTOM",
    icon: "⚡",
    version: "v1.0.0",
    description: "",
    endpoint: "http://127.0.0.1:8090/mcp/custom/sse",
  })

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword, cat = category) => {
    setLoading(true)
    try {
      const res = await mcpHubApi.page({ page: p, pageSize: ps, keyword: kw || undefined, category: cat || undefined })
      if (res.success && res.data) {
        setItems(res.data.list || [])
        setTotal(res.data.total || (res.data.list ? res.data.list.length : 0))
      }
    } catch (err: any) {
      console.error("加载 MCP 资产失败", err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, keyword, category])

  useEffect(() => {
    loadData(page, pageSize, keyword, category)
  }, [page, pageSize, keyword, category, loadData])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await mcpHubApi.create(formData)
      if (res.success) {
        setIsCreateOpen(false)
        setFormData({
          mcpCode: "",
          name: "",
          category: "CUSTOM",
          icon: "⚡",
          version: "v1.0.0",
          description: "",
          endpoint: "http://127.0.0.1:8090/mcp/custom/sse",
        })
        loadData()
      } else {
        alert(`创建失败: ${res.msg}`)
      }
    } catch (err: any) {
      alert(`创建失败: ${err.message}`)
    }
  }

  const handleToggleStatus = async (item: AigwMcpAsset) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      const res = await mcpHubApi.update({ id: item.id, status: nextStatus })
      if (res.success) {
        loadData()
      }
    } catch (err: any) {
      alert(`更新失败: ${err.message}`)
    }
  }

  const handleDelete = async (item: AigwMcpAsset) => {
    if (!confirm(`确定下架并删除 ${item.name} 吗？`)) return
    try {
      const res = await mcpHubApi.delete(item.id)
      if (res.success) {
        loadData()
      }
    } catch (err: any) {
      alert(`删除失败: ${err.message}`)
    }
  }

  const handleOpenExport = (item: AigwMcpAsset) => {
    setSelectedMcp(item)
    setIsExportOpen(true)
  }

  const getMcpJsonConfig = (item: AigwMcpAsset) => {
    return JSON.stringify(
      {
        mcpServers: {
          [item.mcpCode]: {
            url: item.endpoint,
            transport: "sse",
            headers: {
              Authorization: "Bearer ${RUOYI_AGENT_TOKEN}",
            },
          },
        },
      },
      null,
      2
    )
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "GOV_DOC":
        return "政务公文规范"
      case "MEETING_OA":
        return "会议与企微待办"
      case "BIDDING":
        return "标书对比审查"
      case "DEV_SECURITY":
        return "研发安全单测"
      case "HOTLINE":
        return "12345民生工单"
      case "TELECOM_CRM":
        return "移动政企CRM"
      default:
        return "自定义私有扩展"
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 1. 页面 Header 规范 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            政企私有 MCP 连接器与行业 Skill 资产库
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管理红头公文、企微会议待办、标书对比、代码安全等私有连接器，动态注入 WorkBuddy / Cherry Studio
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 通用视图切换组件 */}
          <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />

          <button
            onClick={() => loadData()}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition"
          >
            刷新
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5"
          >
            <span>+ 上架私有 MCP</span>
          </button>
        </div>
      </div>

      {/* 2. 搜索栏 Search Container */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索 MCP 名称、代码或功能描述..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-72 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="">全部类别</option>
            <option value="GOV_DOC">政务公文规范</option>
            <option value="MEETING_OA">会议与企微待办</option>
            <option value="BIDDING">标书对比审查</option>
            <option value="DEV_SECURITY">研发安全单测</option>
            <option value="HOTLINE">12345民生工单</option>
            <option value="TELECOM_CRM">移动政企CRM</option>
          </select>

          <button
            onClick={() => {
              setKeyword("")
              setCategory("")
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            重置
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          共收录 <span className="text-slate-900 font-bold">{items.length}</span> 项私有 MCP 资产
        </div>
      </div>

      {/* 3.1 表格列表视图 (严格单行不换行 Table View Mode) */}
      {viewMode === "table" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-5 py-3">MCP 连接器名称</th>
                  <th className="px-5 py-3">功能描述</th>
                  <th className="px-5 py-3">业务分类</th>
                  <th className="px-5 py-3">协议版本</th>
                  <th className="px-5 py-3">服务 SSE 端点</th>
                  <th className="px-5 py-3">授权员工</th>
                  <th className="px-5 py-3">资产状态</th>
                  <th className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-xs text-slate-400">
                      加载 MCP 资产数据中...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-xs text-slate-400">
                      暂无匹配的 MCP 资产
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                      <td className="px-5 py-3">
                        <div className="inline-flex items-center gap-2.5">
                          <span className="text-base p-1 bg-slate-100 rounded-lg flex-shrink-0">{item.icon}</span>
                          <span className="font-semibold text-slate-900">{item.name}</span>
                          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 py-0.5 rounded border border-slate-200">
                            {item.mcpCode}
                          </code>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className="max-w-[240px] truncate inline-block align-middle text-slate-500 text-[11px]" title={item.description}>
                          {item.description || "暂无描述"}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium border border-indigo-100">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono rounded text-[10px] border border-blue-100 font-medium">
                          {item.version}
                        </span>
                      </td>

                      <td className="px-5 py-3 font-mono text-slate-600">
                        <span className="max-w-[160px] truncate inline-block align-middle text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100" title={item.endpoint}>
                          {item.endpoint}
                        </span>
                      </td>

                      <td className="px-5 py-3 font-mono font-semibold text-slate-800">
                        {item.authorizedCount} 位
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "已就绪" : "已停用"}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenExport(item)}
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            [配置导出]
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`text-[11px] font-medium px-2 py-1 rounded transition ${
                              item.status === "ACTIVE"
                                ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                                : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                            }`}
                          >
                            {item.status === "ACTIVE" ? "停用" : "启用"}
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition px-2 py-1 hover:bg-rose-50 rounded"
                          >
                            删除
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
      )}

      {/* 3.2 卡片网格视图 (Card Grid View Mode) */}
      {viewMode === "card" && (
        <>
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">加载 MCP 资产中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 bg-slate-100 rounded-xl">{item.icon}</span>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h3>
                          <span className="text-[10px] text-slate-400 font-mono">code: {item.mcpCode}</span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "已就绪" : "已停用"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="p-2 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-600 truncate">
                      端点: {item.endpoint}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium text-[11px]">
                      已授权给 <strong className="text-slate-800">{item.authorizedCount}</strong> 位政企员工
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${
                          item.status === "ACTIVE" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "停用" : "启用"}
                      </button>
                      <button
                        onClick={() => handleOpenExport(item)}
                        className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                      >
                        配置
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 通用底部分页控件 */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p)
          loadData(p, pageSize, keyword, category)
        }}
        onPageSizeChange={(ps) => {
          setPageSize(ps)
          setPage(1)
          loadData(1, ps, keyword, category)
        }}
      />

      {/* 4. 上架弹窗 */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">上架政企私有 MCP 连接器</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">MCP 名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如: 省医保数据核验 MCP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">MCP 代码 Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.mcpCode}
                    onChange={(e) => setFormData({ ...formData, mcpCode: e.target.value })}
                    placeholder="如: mcp-medical-audit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">图标 Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="如: 🏥"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">所属分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="GOV_DOC">政务公文规范</option>
                  <option value="MEETING_OA">会议与企微待办</option>
                  <option value="BIDDING">标书对比审查</option>
                  <option value="DEV_SECURITY">研发安全单测</option>
                  <option value="HOTLINE">12345民生工单</option>
                  <option value="TELECOM_CRM">移动政企CRM</option>
                  <option value="CUSTOM">自定义私有扩展</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">服务 SSE / HTTP 端点 *</label>
                <input
                  type="text"
                  required
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="http://127.0.0.1:8090/mcp/custom/sse"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">功能描述</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明该连接器在政企业务中的作用与数据接口..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  确定上架
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. 导出配置弹窗 */}
      {isExportOpen && selectedMcp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedMcp.icon}</span>
                <h2 className="text-sm font-bold text-slate-900">{selectedMcp.name} • 连接配置</h2>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-blue-800 leading-relaxed">
                复制以下 JSON 配置，可直接粘贴进 <strong>腾讯 WorkBuddy</strong>、<strong>Cherry Studio</strong> 或 <strong>Claude Desktop</strong> 的 <code>mcp.json</code> 中：
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {getMcpJsonConfig(selectedMcp)}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(getMcpJsonConfig(selectedMcp))
                    alert("已复制 MCP 配置到剪贴板！")
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  复制 JSON 配置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
