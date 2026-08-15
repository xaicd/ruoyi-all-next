"use client"

import { useCallback, useEffect, useState } from "react"
import type { {{featureListPascal}}DO } from "@/modules/{{moduleKebab}}/backend/types/{{featureListKebab}}.types"
import type { {{featureListPascal}}CreateInput, {{featureListPascal}}UpdateInput } from "@/modules/{{moduleKebab}}/backend/validators/{{featureListKebab}}.validator"
import { {{featureCamel}}Api } from "../api/{{featureListKebab}}.api"
import { {{featureListPascal}}Form } from "../components/{{featureListPascal}}Form"

type PageData = { items: {{featureListPascal}}DO[]; total: number; page: number; pageSize: number }
type FormSubmitResult = { success: boolean; error?: string }

export default function {{featureListPascal}}ListPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [editing, setEditing] = useState<{{featureListPascal}}DO | null | undefined>(undefined)
  const load = useCallback(async () => { const result = await {{featureCamel}}Api.page({ page: 1, pageSize: 20 }); if (result.success && result.data) setData(result.data) }, [])
  useEffect(() => { void load() }, [load])
  const save = async (value: {{featureListPascal}}CreateInput | {{featureListPascal}}UpdateInput): Promise<FormSubmitResult> => {
    const result = editing ? await {{featureCamel}}Api.update({ ...value, id: editing.id }) : await {{featureCamel}}Api.create(value as {{featureListPascal}}CreateInput)
    if (result.success) { setEditing(undefined); await load(); return { success: true } }
    return { success: false, error: result.error || "操作失败" }
  }
  return <div className="space-y-4"><header className="flex justify-between rounded-lg border bg-white p-4"><h1 className="font-semibold">{{moduleLabel}}{{featureListLabel}}</h1><button onClick={() => setEditing(null)} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">新增</button></header><section className="rounded-lg border bg-white"><table className="w-full text-sm"><thead><tr><th className="p-3 text-left">名称</th><th className="p-3 text-left">状态</th><th className="p-3 text-right">操作</th></tr></thead><tbody>{data.items.map((item) => <tr key={item.id} className="border-t"><td className="p-3">{item.name}</td><td className="p-3">{item.status}</td><td className="p-3 text-right"><button onClick={() => setEditing(item)} className="text-blue-600">编辑</button></td></tr>)}</tbody></table></section>{editing !== undefined && <{{featureListPascal}}Form mode={editing ? "edit" : "create"} initialData={editing ?? undefined} onSubmit={save} onCancel={() => setEditing(undefined)} />}</div>
}
