"use client"

import { useState } from "react"

export function WorkspaceCpcPage() {
  const [phone, setPhone] = useState("13800000001")
  const [prompt, setPrompt] = useState("")
  const [chatLog, setChatLog] = useState<Array<{ role: string; content: string; mcpInfo?: string }>>([
    {
      role: "assistant",
      content: "您好！我是中国移动 MOMA 政企算力专区助手，已为您自动挂载《国家标准红头公文排版与合规审计 MCP》。请输入您需要起草的公文或需要重构的代码。",
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!prompt.trim()) return
    const userMsg = prompt
    setPrompt("")
    setLoading(true)

    const updated = [...chatLog, { role: "user", content: userMsg }]
    setChatLog(updated)

    setTimeout(() => {
      setLoading(false)
      setChatLog([
        ...updated,
        {
          role: "assistant",
          content: `【广东省政务服务和数据管理局 批复通知】\n\n粤政数批〔2026〕12号\n\n关于广州市政务大数据平台接入 DeepSeek-R1 算力集群的批复\n\n广州市数字政府运营中心：\n  你中心《关于申请接入中国移动 MOMA 智算集群的请示》收悉。经研究，同意你中心接入广州/韶关算力节点，首期划拨 5000 万 Token 算力额度与 50 个 WorkBuddy 协同席位。\n\n此复。\n\n广东省政务服务和数据管理局\n2026年8月24日`,
          mcpInfo: "⚡ 已自动应用: 国家标准《党政机关公文格式》(GB/T 9704-2012) 智能合规排版",
        },
      ])
    }, 700)
  }

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen bg-slate-900 text-white">
      {/* 顶部微导轨 */}
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
            R
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>RoMA 应算通 智算中枢 • 政企 AI 协同工作台 (CPC)</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                DeepSeek-V3 671B 满血公文版
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-400">
            当前绑定账号: <span className="font-mono text-blue-400 font-bold">{phone}</span>
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/10 text-amber-300 font-mono font-semibold">
            本月剩余: 1,800 万 Token (18,000 豆)
          </div>
        </div>
      </header>

      {/* 主对话区 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto w-full">
        {chatLog.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className="text-[10px] text-slate-500 mb-1">
              {msg.role === "user" ? "政企员工 (您)" : "中国移动 MOMA 智算中枢"}
            </div>
            <div
              className={`p-4 rounded-2xl max-w-[85%] text-xs whitespace-pre-wrap leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.mcpInfo && (
              <div className="mt-1 text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                {msg.mcpInfo}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            正在调用中国移动 MOMA 韶关智算集群推理并校验公文格式...
          </div>
        )}
      </div>

      {/* 底部输入框 */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
            placeholder="输入公文起草需求、政策合规排查、12345民生工单智能派单指令..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceCpcPage
