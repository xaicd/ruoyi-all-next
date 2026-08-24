"use client"

import React, { useState } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

export default function AigwPlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"playground" | "demo">("demo")

  // Playground State
  const [model, setModel] = useState("gpt-4o-mini")
  const [prompt, setPrompt] = useState("请用一句话介绍 ruoyi-all-next 架构优势")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  // Demo 1 State
  const [demo1Running, setDemo1Running] = useState(false)
  const [demo1Steps, setDemo1Steps] = useState<Array<{ title: string; desc: string; status: "pending" | "running" | "done" }>>([])
  const [demo1Result, setDemo1Result] = useState<any>(null)

  // Demo 2 State
  const [demo2Running, setDemo2Running] = useState(false)
  const [demo2Steps, setDemo2Steps] = useState<Array<{ title: string; desc: string; status: "pending" | "running" | "done" }>>([])
  const [demo2Result, setDemo2Result] = useState<any>(null)

  const handleTest = async () => {
    setLoading(true)
    setResponse("")
    try {
      const res: any = await request.post(
        "/api/v1/open/aigw/chat/completions",
        {
          model,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: { Authorization: "Bearer sk-ruoyi-demo-gateway" },
          noAuth: true,
        }
      )
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

  // 场景 1 真实后端串联执行
  const runDemo1 = async () => {
    setDemo1Running(true)
    setDemo1Result(null)
    setDemo1Steps([
      { title: "校验 API Key 与 WorkBuddy 席位", desc: "验证账号 dev_seat_008@telecom.gd.cn 席位授权", status: "running" },
      { title: "安全合规内容审计", desc: "调用 assertContentSafety 审计规则，通过防线", status: "pending" },
      { title: "匹配招投标框架合约", desc: "命中 CT-2026-GD-0088 5000万 Token 框架划拨", status: "pending" },
      { title: "DeepSeek 大模型真实推理", desc: "真实发起 /api/v1/open/aigw/chat/completions 路由转发", status: "pending" },
      { title: "物理数据库落盘与清分", desc: "在数据库落盘台账 aigw_tenant_quota_ledger 与电信 30% 分成记录", status: "pending" },
    ])

    try {
      await new Promise((r) => setTimeout(r, 400))
      setDemo1Steps((prev) => [
        { ...prev[0], status: "done" },
        { ...prev[1], status: "running" },
        ...prev.slice(2),
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo1Steps((prev) => [
        prev[0],
        { ...prev[1], status: "done" },
        { ...prev[2], status: "running" },
        ...prev.slice(3),
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo1Steps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "done" },
        { ...prev[3], status: "running" },
        ...prev.slice(4),
      ])

      // 发起真实后端 API 调用
      const res: any = await request.post("/api/v1/admin/aigw/demo/execute", { scenario: "B2B_GOV" })

      setDemo1Steps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: "done" },
        { ...prev[4], status: "running" },
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo1Steps((prev) => prev.map((s) => ({ ...s, status: "done" })))

      if (res?.code === 0) {
        setDemo1Result(res.data)
      } else {
        alert(res?.msg || "场景 1 执行失败")
      }
    } catch (err: any) {
      alert("场景 1 执行异常: " + (err.message || String(err)))
    } finally {
      setDemo1Running(false)
    }
  }

  // 场景 2 真实后端串联执行
  const runDemo2 = async () => {
    setDemo2Running(true)
    setDemo2Result(null)
    setDemo2Steps([
      { title: "Mall 在线加购算力包 SKU", desc: "选择 DEEPSEEK_50M 算力包 (5,000万 Token)，在线支付 ¥ 199.00", status: "running" },
      { title: "Pay 支付成功消息回调", desc: "广播 ruoyi.evt.trade.order_paid 触发 AIGW 自动台账上充", status: "pending" },
      { title: "物理台账动账落盘", desc: "在数据库增量台账 aigw_tenant_quota_ledger 增加 +50,000,000 Token", status: "pending" },
      { title: "夜间闲时 5 折资费匹配", desc: "检测时刻 23:30 命中 5 折优惠，基准单价降为 ¥ 0.001/kToken", status: "pending" },
      { title: "Agent 生成爆款营销文案", desc: "调用 /api/v1/open/aigw 真实生成文案，扣减折后 Token 额度", status: "pending" },
    ])

    try {
      await new Promise((r) => setTimeout(r, 400))
      setDemo2Steps((prev) => [
        { ...prev[0], status: "done" },
        { ...prev[1], status: "running" },
        ...prev.slice(2),
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo2Steps((prev) => [
        prev[0],
        { ...prev[1], status: "done" },
        { ...prev[2], status: "running" },
        ...prev.slice(3),
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo2Steps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "done" },
        { ...prev[3], status: "running" },
        ...prev.slice(4),
      ])

      // 发起真实后端 API 调用
      const res: any = await request.post("/api/v1/admin/aigw/demo/execute", { scenario: "B2C_SKU" })

      setDemo2Steps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: "done" },
        { ...prev[4], status: "running" },
      ])

      await new Promise((r) => setTimeout(r, 400))
      setDemo2Steps((prev) => prev.map((s) => ({ ...s, status: "done" })))

      if (res?.code === 0) {
        setDemo2Result(res.data)
      } else {
        alert(res?.msg || "场景 2 执行失败")
      }
    } catch (err: any) {
      alert("场景 2 执行异常: " + (err.message || String(err)))
    } finally {
      setDemo2Running(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 顶部 Header 与 Tab 切换 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">模型中台场景演练 & 联调探测 (Playground & Agent Demos)</h1>
          <p className="text-sm text-gray-500 mt-1">全链路贯通：大模型 Gateway 算力路由、政企开户、电商加购与清分结算真实落盘</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("demo")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "demo" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🤖 智能体 Demo 真实串联演练 (物理落盘)
          </button>
          <button
            onClick={() => setActiveTab("playground")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "playground" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🚀 接口连通性探测 (OpenAI API)
          </button>
        </div>
      </div>

      {/* Tab 1: 智能体 Demo 真实串联演练 */}
      {activeTab === "demo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 场景 1 卡片 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-md border border-indigo-100">
                    场景 1：To B / To G 政企招投标闭环 (全链路真实贯通)
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2">政企 Agent 开发者席位授权与对公清分</h2>
                </div>
                <button
                  onClick={runDemo1}
                  disabled={demo1Running}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 transition-all shrink-0"
                >
                  {demo1Running ? "真实贯通执行中..." : "▶️ 运行场景 1 演示"}
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                点击将真实调用后端 API，在物理数据库中落盘企业开户记录、席位授权、生成真实用量日志与中国电信 30% 分成结算单！
              </p>

              {/* 步骤条 */}
              {demo1Steps.length > 0 && (
                <div className="space-y-2.5 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-2">全链路推演状态：</div>
                  {demo1Steps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 ${
                        step.status === "done" ? "bg-emerald-500 text-white" : step.status === "running" ? "bg-indigo-600 text-white animate-pulse" : "bg-gray-200 text-gray-500"
                      }`}>
                        {step.status === "done" ? "✓" : idx + 1}
                      </span>
                      <div>
                        <div className={`font-semibold ${step.status === "running" ? "text-indigo-600" : step.status === "done" ? "text-gray-900" : "text-gray-400"}`}>
                          {step.title}
                        </div>
                        <div className="text-gray-500 text-[11px]">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 真实后端返回的数据解压视图 */}
              {demo1Result && (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5 flex justify-between">
                    <span>🟢 后端 API 真实执行成功 (数据库已落盘)</span>
                    <span className="text-slate-400 font-normal">HTTP 200 OK</span>
                  </div>
                  <div>
                    <span className="text-slate-400">授权席位:</span> {demo1Result.userEmail}
                  </div>
                  <div>
                    <span className="text-slate-400">命中框架标:</span> <span className="text-indigo-300">{demo1Result.carrierContract}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">真实 LLM 推理响应:</span>
                    <pre className="text-emerald-300 whitespace-pre-wrap mt-1 p-2 bg-slate-950/60 rounded">{demo1Result.answerContent}</pre>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                    <div><span className="text-slate-400">消耗 Token:</span> {demo1Result.tokensUsed?.totalTokens}</div>
                    <div><span className="text-slate-400">数据库台账 ID:</span> {demo1Result.ledger?.id}</div>
                    <div><span className="text-slate-400">电信 30% 分成:</span> <span className="text-emerald-400">¥ {demo1Result.split?.carrierShare}</span></div>
                    <div><span className="text-slate-400">平台 70% 留存:</span> <span className="text-blue-400">¥ {demo1Result.split?.platformShare}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 场景 2 卡片 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-md border border-emerald-100">
                    场景 2：To C / 小微企线上加购闭环 (全链路真实贯通)
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2">算力加油包 SKU 扫码充值与闲时 5 折</h2>
                </div>
                <button
                  onClick={runDemo2}
                  disabled={demo2Running}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 transition-all shrink-0"
                >
                  {demo2Running ? "真实贯通执行中..." : "▶️ 运行场景 2 演示"}
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                点击将真实触发 Mall + Pay 订单履约事件，写入数据库增量台账（+5000万 Token），并按闲时 5 折单价计算消费。
              </p>

              {/* 步骤条 */}
              {demo2Steps.length > 0 && (
                <div className="space-y-2.5 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-2">全链路推演状态：</div>
                  {demo2Steps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 ${
                        step.status === "done" ? "bg-emerald-500 text-white" : step.status === "running" ? "bg-emerald-600 text-white animate-pulse" : "bg-gray-200 text-gray-500"
                      }`}>
                        {step.status === "done" ? "✓" : idx + 1}
                      </span>
                      <div>
                        <div className={`font-semibold ${step.status === "running" ? "text-emerald-600" : step.status === "done" ? "text-gray-900" : "text-gray-400"}`}>
                          {step.title}
                        </div>
                        <div className="text-gray-500 text-[11px]">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 真实后端返回的数据解压视图 */}
              {demo2Result && (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5 flex justify-between">
                    <span>🟢 后端 API 真实执行成功 (数据库已落盘)</span>
                    <span className="text-slate-400 font-normal">订单: {demo2Result.tradeOrderNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">加购 SKU 编码:</span> {demo2Result.skuCode}
                  </div>
                  <div>
                    <span className="text-slate-400">资费规则匹配:</span> <span className="text-amber-300">{demo2Result.tariffApplied}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">真实大模型生成文案:</span>
                    <pre className="text-emerald-300 whitespace-pre-wrap mt-1 p-2 bg-slate-950/60 rounded">{demo2Result.answerContent}</pre>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                    <div><span className="text-slate-400">台账充值增量:</span> +50,000,000 Token</div>
                    <div><span className="text-slate-400">变动后台账余额:</span> {demo2Result.rechargeLedger?.balanceAfter?.toLocaleString()} Token</div>
                    <div><span className="text-slate-400">移动分成结算:</span> <span className="text-emerald-400">¥ {demo2Result.split?.carrierShare}</span></div>
                    <div><span className="text-slate-400">履约底层事件:</span> ruoyi.evt.trade.order_paid</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 接口连通性探测 */}
      {activeTab === "playground" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">测试目标模型</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="gpt-4o-mini">gpt-4o-mini (默认极速)</option>
              <option value="deepseek-chat">deepseek-chat (DeepSeek V3)</option>
              <option value="deepseek-reasoner">deepseek-reasoner (DeepSeek R1)</option>
              <option value="qwen-plus">qwen-plus (通义千问)</option>
              <option value="mock-chat">mock-chat (本地模拟)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">测试 Prompt 输入</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 outline-none focus:border-indigo-500"
              placeholder="输入对话测试内容..."
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 transition-colors"
          >
            {loading ? "正在连通探测中..." : "🚀 发起连通性探测"}
          </button>

          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs font-semibold text-gray-500 mb-2">模型响应结果：</div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">{response}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
