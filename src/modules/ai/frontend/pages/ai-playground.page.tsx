"use client"

import { useState } from "react"

export default function AiPlaygroundPage() {
  const [model, setModel] = useState("mock-chat")
  const [prompt, setPrompt] = useState("ping")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      const response = await fetch("/api/v1/admin/ai/playground", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      })
      const json = await response.json()
      setOutput(JSON.stringify(json, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">联调探测</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          走底座模型中台网关。企业应用请调 /api/v1/open/ai/v1/chat/completions。
        </p>
      </div>
      <div className="space-y-3 rounded-lg border bg-white p-4">
        <label className="block text-sm">
          模型
          <input
            className="mt-1 h-9 w-full rounded-md border px-3 text-sm"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          提示
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={4}
          />
        </label>
        <button
          type="button"
          className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white disabled:opacity-50"
          onClick={() => void run()}
          disabled={loading}
        >
          {loading ? "调用中" : "发送"}
        </button>
        <pre className="overflow-auto rounded-md bg-slate-50 p-3 text-xs">{output}</pre>
      </div>
    </div>
  )
}
