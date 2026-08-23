"use client"

import { useState } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

export default function AigwPlaygroundPage() {
  const [model, setModel] = useState("gpt-4o-mini")
  const [prompt, setPrompt] = useState("请用一句话介绍 ruoyi-all-next 架构优势")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResponse("")
    try {
      const res: any = await request.post("/api/v1/open/ai/chat/completions", {
        model,
        messages: [{ role: "user", content: prompt }],
      }, {
        headers: { Authorization: "Bearer sk-ruoyi-demo-gateway" },
        noAuth: true,
      })
      if (res?.choices?.[0]?.message?.content) {
        setResponse(res.choices[0].message.content)
      } else {
        setResponse(JSON.stringify(res, null, 2))
      }

    } catch (err: any) {
      setResponse(`探测失败: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">模型联调探测 (Playground)</h1>
        <p className="text-sm text-slate-500 mt-1">使用平台内置默认令牌探测上游模型响应与延迟表现</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">测试目标模型</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="gpt-4o-mini">gpt-4o-mini (默认极速)</option>
            <option value="deepseek-chat">deepseek-chat (DeepSeek V3)</option>
            <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek R1)</option>
            <option value="qwen-plus">qwen-plus (通义千问)</option>
            <option value="mock-chat">mock-chat (本地模拟)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">测试 Prompt 输入</label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500"
            placeholder="输入对话测试内容..."
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "正在连通探测中..." : "🚀 发起连通性探测"}
        </button>

        {response && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-2">模型响应结果：</div>
            <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">{response}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
