"use client"

import { useState } from "react"
import type { {{featureListPascal}}DO } from "@/modules/{{moduleKebab}}/backend/types/{{featureListKebab}}.types"
import type { {{featureListPascal}}CreateInput, {{featureListPascal}}UpdateInput } from "@/modules/{{moduleKebab}}/backend/validators/{{featureListKebab}}.validator"

type FormSubmitResult = { success: boolean; error?: string }
type Props = { mode: "create" | "edit"; initialData?: {{featureListPascal}}DO; onSubmit: (data: {{featureListPascal}}CreateInput | {{featureListPascal}}UpdateInput) => Promise<FormSubmitResult>; onCancel: () => void }

export function {{featureListPascal}}Form({ mode, initialData, onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(null)
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as {{featureListPascal}}CreateInput
      const result = await onSubmit(mode === "edit" ? { ...data, id: initialData!.id } : data)
      if (!result.success) setError(result.error || "操作失败，请稍后重试")
    } finally { setLoading(false) }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={(event) => void submit(event)} className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl"><h2 className="text-base font-semibold">{mode === "create" ? "新增" : "编辑"}{{featureListLabel}}</h2><label className="block text-sm">名称<input name="name" defaultValue={initialData?.name ?? ""} required className="mt-1 h-9 w-full rounded border px-3" /></label><label className="block text-sm">状态<select name="status" defaultValue={initialData?.status ?? "ACTIVE"} className="mt-1 h-9 w-full rounded border px-3"><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select></label>{error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded border px-4 py-2 text-sm">取消</button><button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">{loading ? "提交中..." : "确认"}</button></div></form></div>
}
