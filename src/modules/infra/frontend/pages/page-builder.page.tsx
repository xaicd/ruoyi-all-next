"use client"

import { useState } from "react"
import { Puck, Render, type Config, type Data } from "@measured/puck"
import "@measured/puck/puck.css"

// === 物料组件定义 ===

const puckConfig: Config = {
  components: {
    // 表格组件
    ProTable: {
      label: "数据表格",
      defaultProps: {
        title: "列表页",
        apiEndpoint: "/api/v1/admin/",
        columns: "id,name,status,createdAt",
        showSearch: true,
        showPagination: true,
      },
      fields: {
        title: { type: "text", label: "标题" },
        apiEndpoint: { type: "text", label: "API 端点" },
        columns: { type: "text", label: "列配置（逗号分隔）" },
        showSearch: { type: "radio", label: "显示搜索", options: [{ label: "是", value: true }, { label: "否", value: false }] },
        showPagination: { type: "radio", label: "显示分页", options: [{ label: "是", value: true }, { label: "否", value: false }] },
      },
      render: ({ title, apiEndpoint, columns, showSearch, showPagination }) => (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-slate-400">API: {apiEndpoint}</p>
          {showSearch && <div className="mt-3 flex gap-2"><div className="h-8 w-48 rounded border bg-slate-50" /><div className="h-8 w-16 rounded bg-slate-900" /></div>}
          <div className="mt-3 rounded border border-dashed p-6 text-center text-xs text-slate-400">表格区域 · 列: {columns}</div>
          {showPagination && <div className="mt-3 flex justify-end gap-1"><div className="h-7 w-16 rounded border" /><div className="h-7 w-16 rounded border" /></div>}
        </div>
      ),
    },

    // 表单组件
    FormPanel: {
      label: "表单面板",
      defaultProps: {
        title: "新增/编辑",
        fields: "name:文本,status:选择,remark:多行",
        submitLabel: "确认",
      },
      fields: {
        title: { type: "text", label: "标题" },
        fields: { type: "textarea", label: "字段配置（name:类型）" },
        submitLabel: { type: "text", label: "提交按钮文字" },
      },
      render: ({ title, fields, submitLabel }) => (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold">{title}</h3>
          <div className="space-y-2">
            {(fields as string).split(",").map((f: string, i: number) => {
              const [name, type] = f.split(":")
              return (
                <div key={i}>
                  <label className="mb-0.5 block text-xs text-slate-500">{name}</label>
                  {type === "多行" ? <div className="h-16 w-full rounded border bg-slate-50" /> : <div className="h-8 w-full rounded border bg-slate-50" />}
                </div>
              )
            })}
          </div>
          <button className="mt-3 h-8 rounded bg-blue-600 px-4 text-xs text-white">{submitLabel}</button>
        </div>
      ),
    },

    // 统计卡片
    StatCard: {
      label: "统计卡片",
      defaultProps: { title: "总数", value: "0", color: "blue" },
      fields: {
        title: { type: "text", label: "标题" },
        value: { type: "text", label: "值" },
        color: { type: "select", label: "颜色", options: [{ label: "蓝色", value: "blue" }, { label: "绿色", value: "green" }, { label: "紫色", value: "purple" }, { label: "橙色", value: "orange" }] },
      },
      render: ({ title, value, color }) => {
        const colors: Record<string, string> = { blue: "from-blue-500 to-blue-600", green: "from-green-500 to-green-600", purple: "from-purple-500 to-purple-600", orange: "from-orange-500 to-orange-600" }
        return (
          <div className="rounded-xl border bg-white p-4">
            <p className="text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{title}</p>
            <div className={`mt-2 h-1 w-10 rounded bg-gradient-to-r ${colors[color as string] ?? colors.blue}`} />
          </div>
        )
      },
    },

    // 标题区
    PageHeader: {
      label: "页面标题",
      defaultProps: { title: "页面标题", description: "页面描述" },
      fields: {
        title: { type: "text", label: "标题" },
        description: { type: "text", label: "描述" },
      },
      render: ({ title, description }) => (
        <div className="rounded-lg border bg-white p-4">
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
      ),
    },

    // 空白容器
    Container: {
      label: "容器",
      defaultProps: { padding: "16", background: "white", border: true },
      fields: {
        padding: { type: "select", label: "内边距", options: [{ label: "8px", value: "8" }, { label: "16px", value: "16" }, { label: "24px", value: "24" }] },
        background: { type: "select", label: "背景", options: [{ label: "白色", value: "white" }, { label: "灰色", value: "slate-50" }, { label: "透明", value: "transparent" }] },
        border: { type: "radio", label: "边框", options: [{ label: "有", value: true }, { label: "无", value: false }] },
      },
      render: ({ padding, background, border, puck }) => (
        <div className={`rounded-lg p-[${padding}px] bg-${background} ${border ? "border" : ""}`} style={{ padding: `${padding}px` }}>
          {(puck as any).renderDropZone({ zone: "content" })}
        </div>
      ),
    },

    // 按钮组
    ButtonGroup: {
      label: "操作按钮",
      defaultProps: { buttons: "新增:primary,导出:default,刷新:default" },
      fields: {
        buttons: { type: "text", label: "按钮配置（名称:样式）" },
      },
      render: ({ buttons }) => (
        <div className="flex gap-2">
          {(buttons as string).split(",").map((b: string, i: number) => {
            const [label, style] = b.split(":")
            return <button key={i} className={`h-9 rounded-md px-4 text-sm font-medium ${style === "primary" ? "bg-blue-600 text-white" : "border text-slate-600"}`}>{label}</button>
          })}
        </div>
      ),
    },
  },
}

// 默认空页面数据
const defaultData: Data = { content: [], root: {} }

// === 主组件 ===

export default function PageBuilderPage() {
  const [mode, setMode] = useState<"edit" | "preview" | "json">("edit")
  const [pageData, setPageData] = useState<Data>(defaultData)
  const [savedPages, setSavedPages] = useState<{ id: string; name: string; data: Data }[]>([])
  const [pageName, setPageName] = useState("未命名页面")

  const handleSave = () => {
    const id = `page-${Date.now()}`
    setSavedPages((prev) => [...prev, { id, name: pageName, data: pageData }])
    alert(`页面「${pageName}」已保存`)
  }

  const handleExportJson = () => {
    const json = JSON.stringify(pageData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${pageName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <input value={pageName} onChange={(e) => setPageName(e.target.value)} className="h-8 w-48 rounded border px-2 text-sm" />
          <div className="flex rounded-md border">
            {(["edit", "preview", "json"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 text-xs font-medium ${mode === m ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>
                {m === "edit" ? "编辑" : m === "preview" ? "预览" : "JSON"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportJson} className="h-8 rounded-md border px-3 text-xs text-slate-600">导出 JSON</button>
          <button onClick={handleSave} className="h-8 rounded-md bg-blue-600 px-4 text-xs font-medium text-white">保存页面</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === "edit" && (
          <Puck
            config={puckConfig}
            data={pageData}
            onPublish={(data) => { setPageData(data); alert("已发布") }}
            onChange={(data) => setPageData(data)}
          />
        )}

        {mode === "preview" && (
          <div className="h-full overflow-auto bg-slate-100 p-6">
            <div className="mx-auto max-w-5xl space-y-4">
              <Render config={puckConfig} data={pageData} />
            </div>
          </div>
        )}

        {mode === "json" && (
          <div className="h-full overflow-auto bg-slate-900 p-4">
            <pre className="text-xs text-slate-100">{JSON.stringify(pageData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
