"use client"

import { useState } from "react"
import { Puck, Render, type Data } from "@puckeditor/core"
import "@puckeditor/core/puck.css"
import { emptyOnlinePuckData, onlinePuckConfig } from "./online-puck.config"
import type { OnlineViewDetail } from "../../backend/application/online-definition.contract"

type DraftView = { code: "list" | "form" | "detail" | "dashboard"; kind: "PUCK"; puckData: Record<string, unknown>; version: 1 }
type Props = { definitionCode: string; views: OnlineViewDetail[]; disabled?: boolean; onChange: (views: DraftView[]) => void }
const codes = ["list", "form", "detail", "dashboard"] as const

function dataFor(views: ReadonlyArray<{ code: string; puckData: Record<string, unknown> }>, code: string): Data {
  return (views.find((view) => view.code === code)?.puckData as Data | undefined) ?? emptyOnlinePuckData
}
function normalizeData(data: Data, definitionCode: string, viewCode: string): Record<string, unknown> {
  return { content: data.content.map((node: any) => {
    const { fieldScope, actionScope, ...rest } = node.props ?? {}
    return { type: node.type, props: { ...rest, definitionCode, viewCode, ...(typeof fieldScope === "string" ? { fieldScope: fieldScope.split(",").map((value: string) => value.trim()).filter(Boolean) } : {}), ...(typeof actionScope === "string" ? { actionScope: actionScope.split(",").map((value: string) => value.trim()).filter(Boolean) } : {}) } }
  }), root: {} }
}

export function OnlinePuckDesigner({ definitionCode, views, disabled, onChange }: Props) {
  const [active, setActive] = useState<typeof codes[number]>("list")
  const data = dataFor(views, active)
  const update = (nextData: Data) => {
    const next = views.filter((view) => view.code !== active).map((view) => ({ code: view.code, kind: "PUCK" as const, puckData: view.puckData, version: 1 as const }))
    next.push({ code: active, kind: "PUCK", puckData: normalizeData(nextData, definitionCode, active), version: 1 })
    onChange(next.sort((left, right) => left.code.localeCompare(right.code)) as DraftView[])
  }
  return <section className="rounded-lg border bg-white p-4"><div className="mb-3"><h3 className="text-sm font-medium">Puck 受控页面设计</h3><p className="mt-1 text-xs text-slate-500">仅允许注册的 Online 组件和 Definition/View/字段/动作绑定；不保存 URL、HTML、脚本、SQL 或执行逻辑。</p></div><div className="mb-3 flex flex-wrap gap-2">{codes.map((code) => <button key={code} disabled={disabled} onClick={() => setActive(code)} className={`rounded border px-3 py-1 text-xs ${active === code ? "border-blue-600 bg-blue-50 text-blue-700" : ""}`}>{code}</button>)}</div><div className="min-h-[38rem] overflow-hidden rounded border">{disabled ? <Render config={onlinePuckConfig} data={data} /> : <Puck config={onlinePuckConfig} data={data} onChange={update} onPublish={update} />}</div></section>
}
