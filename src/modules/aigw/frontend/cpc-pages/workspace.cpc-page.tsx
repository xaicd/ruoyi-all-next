"use client"

import { useState } from "react"
import Link from "next/link"

type ToolMode = "chat" | "document" | "knowledge" | "code" | "meeting" | "mcp"
type ThemeMode = "light" | "dark"

type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  thinking?: string
  mcpInfo?: string
  docPreview?: {
    orgHeader: string
    docNumber: string
    title: string
    mainTo: string
    body: string
    signOrg: string
    signDate: string
  }
}

export function WorkspaceCpcPage() {
  const [theme, setTheme] = useState<ThemeMode>("light") // 默认政企清爽浅色主题
  const [activeMode, setActiveMode] = useState<ToolMode>("chat")
  const [selectedModel, setSelectedModel] = useState("DeepSeek-R1 (671B 深度推理)")
  const [phone] = useState("13800000001")
  const [userNickname] = useState("李总 (数智推进处)")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [showWorkBuddyModal, setShowWorkBuddyModal] = useState(false)

  // 历史对话与生产力画布
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      role: "assistant",
      content: "您好！我是 **RoMA 应算通 • 移动 MOMA 智算协同助手**。当前已为您自动挂载《国家标准红头公文排版与合规审计 MCP》、《广东省数字政府标准化知识库》。\n\n您可以选择左侧生产力工具，或在下方直接起草公文、审计代码、查询算力与分解会议待办。",
    },
  ])

  // 预设高频业务 Prompt
  const PRESET_PROMPTS = [
    {
      icon: "📜",
      title: "党政公文起草",
      desc: "起草广州市政务大数据平台接入 DeepSeek-R1 的批复通知",
      prompt: "请以广东省政务服务和数据管理局的名义，起草一份关于同意广州市数字政府运营中心接入中国移动 MOMA 智算集群的批复通知，要求符合 GB/T 9704-2012 国家标准党政机关公文格式。",
    },
    {
      icon: "🛡️",
      title: "政务 SQL 合规排查",
      desc: "排查用户查询接口中的 SQL 防注入与租户隔离漏洞",
      prompt: "请对以下政务用户查询接口进行安全合规审计，重点排查是否存在 SQL 注入、缺少 tenant_id 租户物理隔离以及未脱敏敏感手机号的问题：\nSELECT * FROM system_user WHERE username = '$input'",
    },
    {
      icon: "📊",
      title: "算力清分汇报大纲",
      desc: "生成本月地市算力调度与运营商 20% 清分汇报 PPT 提纲",
      prompt: "请为地市运营商分管领导生成一份《2026年8月地市 AI 算力调度与 20% 清分运营成果汇报》PPT 提纲，包含政企开户数、DeepSeek 算力消纳量与移动豆清分收入。",
    },
    {
      icon: "🏢",
      title: "数字政府知识库检索",
      desc: "检索《数字政府大模型合规指引》中关于私网脱敏的要求",
      prompt: "请从《广东省数字政府政务大模型安全合规指引》中，提炼出关于政企内网调用公有云大模型时的‘脱敏前置网关’与‘数据不出内网’的具体条款要求。",
    },
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || prompt
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
    }

    setPrompt("")
    setLoading(true)
    const updated = [...chatLog, userMsg]
    setChatLog(updated)

    setTimeout(() => {
      setLoading(false)

      let assistantMsg: ChatMessage

      if (text.includes("批复") || text.includes("公文") || text.includes("通知")) {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          thinking: "1. 识别发文单位：广东省政务服务和数据管理局\n2. 识别主送机关：广州市数字政府运营中心\n3. 应用国家标准 GB/T 9704-2012 党政公文排版引擎\n4. 校验发文字号规则：粤政数批〔2026〕12号\n5. 注入附件与印发日期规范排版",
          mcpInfo: "⚡ 已自动挂载: 国家标准《党政机关公文格式》(GB/T 9704-2012) 排版与审计引擎 (v2.1)",
          content: "已严格按照国家标准 GB/T 9704-2012 为您生成规范红头公文排版。您可以直接在下方预览、一键复制排版文本或导出 Word。",
          docPreview: {
            orgHeader: "广东省政务服务和数据管理局文件",
            docNumber: "粤政数批〔2026〕12号",
            title: "关于广州市数字政府运营中心接入中国移动 MOMA 智算集群的批复",
            mainTo: "广州市数字政府运营中心：",
            body: "你中心《关于申请接入中国移动 MOMA 智算集群开展公文智能协同试点的请示》（穗数运〔2026〕45号）收悉。经研究，批复如下：\n\n一、同意你中心接入中国移动 MOMA 智算中心（广州/韶关算力节点），首期划拨 5,000 万 Token 算力额度与 50 个腾讯 WorkBuddy / 阿里 Qoder 协同席位。\n\n二、请严格遵守《广东省政务大模型安全合规指引》，落实政务数据脱敏前置网关，确保核心政务内网数据不出域。\n\n三、算力消耗费用按 20% 专项优惠政策纳入年度数字政府运营专项统筹清分。\n\n此复。",
            signOrg: "广东省政务服务和数据管理局",
            signDate: "2026年8月24日",
          },
        }
      } else if (text.includes("SQL") || text.includes("代码") || text.includes("注入")) {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          thinking: "1. 识别输入 SQL: 存在字符串直接拼接变量 $input\n2. 识别安全漏洞: 缺少预编译参数化 (SQL Injection Risk)\n3. 识别多租户漏洞: 业务表 system_user 查询缺少 tenant_id 隔离约束\n4. 依据 All-Next 编码规范输出安全重构代码",
          mcpInfo: "🛡️ 已调用: 政企代码合规与安全漏洞扫描 MCP (v1.3)",
          content: "### 🚨 安全合规审计报告 (发现 2 处高危风险)\n\n1. **高危 SQL 注入风险**：原始查询使用字符串拼接，攻击者可通过 `' OR '1'='1` 绕过认证。\n2. **缺少多租户物理隔离**：根据《All-Next 研发手册》§4.8 规定，业务表查询必须强制附带 `tenant_id` 过滤。\n\n#### ✅ 推荐安全合规修复代码 (Kysely 参数化查询)：\n```ts\nimport { getCurrentTenantId } from '@/modules/shared/backend/lib/biz-tenant'\n\n// 安全参数化与租户隔离查询\nexport async function getSafeUser(username: string) {\n  const tenantId = getCurrentTenantId()\n  return await db\n    .selectFrom('system_user')\n    .selectAll()\n    .where('username', '=', username) // 强类型参数化防注入\n    .where('tenant_id', '=', tenantId) // 强制租户物理隔离\n    .executeTakeFirst()\n}\n```",
        }
      } else {
        assistantMsg = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          thinking: "1. 分析任务需求\n2. 检索 RoMA 算力中台运营指标\n3. 结构化提炼汇报内容",
          content: `### 📊 2026年8月地市 AI 算力调度与清分运营汇报提纲\n\n#### 一、算力消纳与地市开户进展\n- **政企签约客户数**：本月新增政企签约客户 **12 家**（涵盖政数局、交通集团、公安数智中心）；\n- **Token 消纳总量**：累计调度 DeepSeek-V3 / R1 算力 **3.8 亿 Token**，平均日活席位 **168 人**。\n\n#### 二、20% 算力清分与分成收益\n- **算力采购总额**：￥76,000.00\n- **地市代理商 20% 运营分成**：**￥15,200.00**（已折算为 15,200 粒移动豆）；\n- **结算周期**：次月 5 日自动出账合并至中国移动集团统付账单。`,
        }
      }

      setChatLog([...updated, assistantMsg])
    }, 800)
  }

  // 生成 WorkBuddy 标准配置文件 JSON
  const workbuddyConfigJson = JSON.stringify(
    {
      version: "1.0.0",
      platform: "RoMA-YingSuanTong",
      user: {
        mobile: phone,
        nickname: userNickname,
        tenant: "广东省政务服务和数据管理局",
      },
      modelProvider: {
        type: "openai-compatible",
        apiBase: "http://localhost:3200/api/v1/aigw/relay",
        apiKey: `sk-roma-tkt-${phone}`,
        defaultModel: "deepseek-r1",
      },
      mcpServers: {
        "gb-t-9704-doc": {
          command: "node",
          args: ["mcp/doc-formatter.js"],
          env: { ORG_NAME: "广东省政务服务和数据管理局" },
          description: "GB/T 9704-2012 党政公文标准排版与红头格式化引擎",
        },
      },
    },
    null,
    2
  )

  // 触发 DeepLink 唤起
  const triggerWorkBuddyDeepLink = () => {
    const deepLink = `workbuddy://open?workspace=http://localhost:3200&token=auth_tkt_${phone}`
    try {
      window.location.href = deepLink
    } catch {}
    setShowWorkBuddyModal(true)
  }

  // 下载配置文件
  const downloadConfigFile = () => {
    const blob = new Blob([workbuddyConfigJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workbuddy.config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // 主题样式类映射
  const isDark = theme === "dark"
  const bgMain = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
  const bgSidebar = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-xs"
  const bgCard = isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/90 shadow-sm"
  const bgInput = isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900 shadow-inner"
  const textMuted = isDark ? "text-slate-400" : "text-slate-500"
  const textTitle = isDark ? "text-white" : "text-slate-900"
  const borderCol = isDark ? "border-slate-800" : "border-slate-200"

  return (
    <div className={`flex h-screen max-h-screen ${bgMain} selection:bg-blue-600 selection:text-white antialiased font-sans overflow-hidden transition-colors duration-200`}>
      {/* 1. 左侧：生产力工具导轨 (Side Navigation) */}
      <aside className={`w-64 border-r ${borderCol} ${bgSidebar} flex flex-col justify-between shrink-0 transition-colors`}>
        <div>
          {/* Logo 区域 */}
          <div className={`h-16 px-5 flex items-center justify-between border-b ${borderCol}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-500/20">
                R
              </div>
              <div>
                <div className={`text-xs font-black ${textTitle} tracking-tight`}>RoMA 应算通</div>
                <div className={`text-[10px] ${textMuted} font-mono`}>政企 AI 协同工作台 (CPC)</div>
              </div>
            </div>

            {/* 明暗主题切换器 */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title="切换明暗主题"
              className={`p-1.5 rounded-lg border ${borderCol} text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* 场景功能切换 */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              生产力工具箱
            </div>

            <button
              type="button"
              onClick={() => setActiveMode("chat")}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeMode === "chat" ? "bg-blue-600 text-white shadow-sm" : `${textMuted} hover:${textTitle} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
            >
              <span>💬</span>
              <span>智能对话与推理</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("document")
                handleSend("请起草一份广东省政务服务和数据管理局关于接入 DeepSeek-R1 算力集群的批复通知")
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeMode === "document" ? "bg-blue-600 text-white shadow-sm" : `${textMuted} hover:${textTitle} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
            >
              <span>📜</span>
              <span>红头公文排版神器</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("knowledge")
                handleSend("请检索广东省数字政府知识库中关于大模型安全脱敏的要求")
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeMode === "knowledge" ? "bg-blue-600 text-white shadow-sm" : `${textMuted} hover:${textTitle} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
            >
              <span>🏢</span>
              <span>政务标准化知识库</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("code")
                handleSend("请排查一段政务 SQL 是否存在 SQL 注入与缺少租户隔离问题")
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeMode === "code" ? "bg-blue-600 text-white shadow-sm" : `${textMuted} hover:${textTitle} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
            >
              <span>🛡️</span>
              <span>代码安全与合规审计</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("meeting")
                handleSend("请生成一份本月地市 AI 算力调度与运营商清分汇报大纲")
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${activeMode === "meeting" ? "bg-blue-600 text-white shadow-sm" : `${textMuted} hover:${textTitle} hover:bg-slate-100 dark:hover:bg-slate-800`}`}
            >
              <span>📊</span>
              <span>算力清分与纪要报告</span>
            </button>
          </div>

          {/* 挂载的私有 MCP 插件 */}
          <div className={`p-3 border-t ${borderCol}`}>
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              已挂载政企 MCP 插件
            </div>
            <div className="space-y-1.5 text-[11px] mt-1">
              <div className={`p-2 rounded-lg ${isDark ? "bg-slate-950/60" : "bg-slate-50"} border ${borderCol} text-slate-600 dark:text-slate-300 flex items-center justify-between`}>
                <span className="truncate">GB/T 9704 公文排版</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <div className={`p-2 rounded-lg ${isDark ? "bg-slate-950/60" : "bg-slate-50"} border ${borderCol} text-slate-600 dark:text-slate-300 flex items-center justify-between`}>
                <span className="truncate">政务数字规范知识库</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <div className={`p-2 rounded-lg ${isDark ? "bg-slate-950/60" : "bg-slate-50"} border ${borderCol} text-slate-600 dark:text-slate-300 flex items-center justify-between`}>
                <span className="truncate">代码注入与合规审计</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 底部用户卡片与返回专区 */}
        <div className={`p-3 border-t ${borderCol} space-y-2`}>
          <Link
            href="/portal/enterprise"
            className={`w-full px-3 py-2 rounded-xl border ${borderCol} ${isDark ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"} text-xs font-semibold flex items-center justify-between transition-colors`}
          >
            <span>🏛️ 政企自服务大盘</span>
            <span>↗</span>
          </Link>
          <div className={`p-2.5 rounded-xl border ${borderCol} ${isDark ? "bg-slate-950" : "bg-slate-100"} flex items-center gap-2.5`}>
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              李
            </div>
            <div className="overflow-hidden flex-1">
              <div className={`text-xs font-bold ${textTitle} truncate`}>{userNickname}</div>
              <div className={`text-[10px] ${textMuted} font-mono truncate`}>{phone}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. 中间：AI 协同与生产力核心画布 (Main Content) */}
      <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* 顶部微导轨 */}
        <header className={`h-16 border-b ${borderCol} px-6 flex items-center justify-between ${bgSidebar} backdrop-blur-xl shrink-0`}>
          <div className="flex items-center gap-3">
            {/* 模型选择器 */}
            <div className={`flex items-center gap-2 px-3 py-1.5 border ${borderCol} rounded-xl text-xs ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
              <span className={textMuted}>当前模型:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`bg-transparent ${textTitle} font-bold focus:outline-none cursor-pointer`}
              >
                <option value="DeepSeek-R1 (671B 深度推理)">DeepSeek-R1 (671B 满血深度思考)</option>
                <option value="DeepSeek-V3 (671B 极速生成)">DeepSeek-V3 (671B 极速创作)</option>
                <option value="中国移动 MOMA 智算集群 (专线)">中国移动 MOMA 智算专线</option>
              </select>
            </div>

            <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded font-mono font-medium">
              ⚡ 中国移动 MOMA 专线直连
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 text-xs border ${borderCol} px-3 py-1.5 rounded-lg ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
              <span className={textMuted}>本月剩余:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">1,800 万 Token</strong>
              <span className="text-slate-400">|</span>
              <strong className="text-amber-600 dark:text-amber-300 font-mono">18,000 豆</strong>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm("确定要退出协同工作台吗？")) {
                  localStorage.removeItem("ruoyi_token")
                  localStorage.removeItem("ruoyi_user")
                  window.location.href = "/login"
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg border ${borderCol} text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1`}
              title="退出登录"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">退出</span>
            </button>
          </div>
        </header>

        {/* 消息与生成画布区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 预设推荐卡片 (仅无长对话时展示) */}
          {chatLog.length <= 1 && (
            <div className="max-w-4xl mx-auto space-y-4 pt-4">
              <div className="text-center space-y-1">
                <h2 className={`text-xl font-black ${textTitle} tracking-tight`}>政企 AI 场景生产力工具</h2>
                <p className={`text-xs ${textMuted}`}>点击下方快捷卡片，一键唤起国家标准公文排版、政务知识库或代码审计</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {PRESET_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p.prompt)}
                    className={`p-4 rounded-2xl ${bgCard} text-left transition-all group active:scale-[0.99] space-y-1 hover:border-blue-500 hover:shadow-md`}
                  >
                    <div className="text-xl">{p.icon}</div>
                    <div className={`font-bold text-xs ${textTitle} group-hover:text-blue-600 transition-colors`}>
                      {p.title}
                    </div>
                    <div className={`text-[11px] ${textMuted} leading-relaxed`}>
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 消息列表 */}
          <div className="max-w-4xl mx-auto space-y-6">
            {chatLog.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs text-white shrink-0 shadow-md">
                    R
                  </div>
                )}

                <div className={`space-y-3 max-w-3xl ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {/* MCP 挂载提示 */}
                  {msg.mcpInfo && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-mono">
                      <span>{msg.mcpInfo}</span>
                    </div>
                  )}

                  {/* 思考过程折叠块 */}
                  {msg.thinking && (
                    <div className={`p-3.5 rounded-xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"} border text-xs space-y-1.5 font-mono`}>
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <span>🧠 深度思考过程 (Reasoning Tokens)</span>
                      </div>
                      <pre className={`text-[11px] ${textMuted} whitespace-pre-wrap font-sans leading-relaxed`}>
                        {msg.thinking}
                      </pre>
                    </div>
                  )}

                  {/* 消息文本正文 */}
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20" : `${bgCard} ${isDark ? "text-slate-200" : "text-slate-800"}`}`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* 红头公文富文本专业排版预览区 */}
                  {msg.docPreview && (
                    <div className="p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-5 text-xs font-serif select-text">
                      {/* 公文红头大字 */}
                      <div className="text-center border-b-2 border-rose-600 pb-4 space-y-1.5">
                        <div className="text-2xl font-black text-rose-600 tracking-wider">
                          {msg.docPreview.orgHeader}
                        </div>
                        <div className="text-[11px] font-mono text-slate-600 text-right">
                          {msg.docPreview.docNumber}
                        </div>
                      </div>

                      {/* 公文标题 */}
                      <div className="text-center font-bold text-base text-slate-900 pt-2 tracking-wide">
                        {msg.docPreview.title}
                      </div>

                      {/* 主送机关 */}
                      <div className="font-bold text-slate-800 pt-1">
                        {msg.docPreview.mainTo}
                      </div>

                      {/* 公文正文 */}
                      <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap indent-6">
                        {msg.docPreview.body}
                      </div>

                      {/* 落款与日期 */}
                      <div className="text-right pt-6 space-y-1">
                        <div className="font-bold text-slate-900">{msg.docPreview.signOrg}</div>
                        <div className="text-slate-600 font-mono text-[11px]">{msg.docPreview.signDate}</div>
                      </div>

                      {/* 公文操作条 */}
                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sans text-[11px] text-slate-500 font-sans">
                        <span>符合国家标准 GB/T 9704-2012 党政机关公文格式</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText?.(
                                `${msg.docPreview?.orgHeader}\n${msg.docPreview?.docNumber}\n\n${msg.docPreview?.title}\n\n${msg.docPreview?.mainTo}\n${msg.docPreview?.body}\n\n${msg.docPreview?.signOrg}\n${msg.docPreview?.signDate}`
                              )
                              alert("✓ 已复制标准红头公文排版文本到剪贴板！")
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
                          >
                            复制公文排版
                          </button>
                          <button
                            type="button"
                            onClick={() => alert("✓ 已生成标准 Word (.docx) 导出任务！")}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
                          >
                            导出 Word
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                    李
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-xs text-blue-600 dark:text-blue-400 animate-pulse py-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>DeepSeek-R1 正在调取政务 MCP 插件进行多步深度推理与公文排版...</span>
              </div>
            )}
          </div>
        </div>

        {/* 底部智能输入与控制栏 */}
        <div className={`p-4 border-t ${borderCol} ${bgSidebar} backdrop-blur-xl shrink-0`}>
          <div className="max-w-4xl mx-auto space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="输入公文起草需求、政策合规排查、SQL防注入审计或政企知识库检索..."
                className={`w-full pl-4 pr-24 py-3.5 ${bgInput} rounded-2xl text-xs focus:outline-none focus:border-blue-500`}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                {loading ? "推理中..." : "发 送"}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>按 Enter 发送 • 支持自动挂载政务 MCP 与 DeepSeek-R1 满血思考</span>
              <span className="font-mono">算力直连: 中国移动 MOMA 智算专线</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. 右侧：个人算力卡包与 WorkBuddy 真实唤起与配置 (Collapsible Right Panel) */}
      {showRightPanel && (
        <aside className={`w-72 border-l ${borderCol} ${bgSidebar} p-5 space-y-5 shrink-0 overflow-y-auto hidden xl:block`}>
          {/* 个人算力卡包 */}
          <div className={`p-4 rounded-2xl ${bgCard} space-y-3`}>
            <div className="text-xs font-bold flex items-center justify-between">
              <span className={textTitle}>个人算力配额</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">● 正常</span>
            </div>

            <div className="space-y-1">
              <div className={`text-2xl font-black ${textTitle} font-mono`}>
                1,800 <span className={`text-xs font-normal ${textMuted}`}>/ 2,000 万</span>
              </div>
              <div className={`text-[11px] ${textMuted}`}>本月可用 Token 余额 (消耗 14%)</div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "14%" }} />
              </div>
            </div>

            <div className={`pt-2 border-t ${borderCol} text-[11px] ${textMuted} flex justify-between`}>
              <span>折合移动豆</span>
              <span className="font-mono text-amber-600 dark:text-amber-300 font-bold">18,000 粒</span>
            </div>
          </div>

          {/* 桌面端直连唤起 & 目录配置 */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-gradient-to-br dark:from-blue-950/60 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-500/20 space-y-3">
            <div className="text-xs font-bold text-blue-900 dark:text-white flex items-center gap-1.5">
              <span>📱</span>
              <span>腾讯 WorkBuddy 客户端直连</span>
            </div>
            <p className="text-[11px] text-blue-800/80 dark:text-slate-300 leading-relaxed">
              支持一键唤起 WorkBuddy 桌面端，并自动配置直连当前政企算力池。
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={triggerWorkBuddyDeepLink}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>⚡ 唤起 WorkBuddy 客户端</span>
              </button>
              <button
                type="button"
                onClick={() => setShowWorkBuddyModal(true)}
                className={`w-full py-1.5 border border-blue-300 dark:border-blue-500/40 ${isDark ? "bg-slate-900/60 text-blue-300" : "bg-white text-blue-700"} hover:bg-blue-50 rounded-xl text-[11px] font-semibold transition-colors`}
              >
                ⚙️ 查看与下载目录配置文件
              </button>
            </div>
          </div>

          {/* 安全合规认证 */}
          <div className={`p-4 rounded-2xl ${bgCard} text-[11px] ${textMuted} space-y-2`}>
            <div className={`font-bold ${textTitle} flex items-center gap-1.5`}>
              <span>🔒</span>
              <span>政务内网安全保障</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-500 dark:text-slate-400">
              <li>物理级多租户隔离</li>
              <li>敏感数据脱敏前置网关</li>
              <li>国密 SM4 链路传输加密</li>
              <li>全流程操作审计日志</li>
            </ul>
          </div>
        </aside>
      )}

      {/* WorkBuddy 配置文件生成与落盘指引弹窗 */}
      {showWorkBuddyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border rounded-3xl p-6 shadow-2xl space-y-4`}>
            <div className={`flex items-center justify-between border-b ${borderCol} pb-3`}>
              <h3 className={`text-base font-bold ${textTitle} flex items-center gap-2`}>
                <span>⚙️ WorkBuddy 客户端配置与一键落盘</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWorkBuddyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 rounded-xl text-blue-800 dark:text-blue-300 space-y-1">
                <div className="font-bold">📁 客户端配置文件存放路径：</div>
                <div className="font-mono text-[11px]">
                  • Windows: <code className="bg-white/60 dark:bg-black/30 px-1 py-0.5 rounded">%APPDATA%\WorkBuddy\config.json</code><br />
                  • 或在项目根目录下创建: <code className="bg-white/60 dark:bg-black/30 px-1 py-0.5 rounded">.workbuddy/config.json</code>
                </div>
              </div>

              <div>
                <label className={`block font-medium ${textTitle} mb-1`}>
                  自动生成的专属配置文件内容 (已注入公文 MCP 与算力 Token)：
                </label>
                <pre className={`p-3 rounded-xl border ${borderCol} ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-800"} font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed`}>
                  {workbuddyConfigJson}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(workbuddyConfigJson)
                    alert("✓ 配置文件 JSON 已复制到剪贴板！")
                  }}
                  className={`px-4 py-2 border ${borderCol} rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  📋 复制配置文本
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadConfigFile}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                  >
                    💾 下载 workbuddy.config.json
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
