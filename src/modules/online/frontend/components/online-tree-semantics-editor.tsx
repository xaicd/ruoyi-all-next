"use client"

type Field = { code: string; type: string }
type Tree = { parentField: string; sortField?: string; rootValue?: string | number | null; childrenIndicator?: boolean }
type Props = { fields: Field[]; tree?: Tree; disabled: boolean; onChange: (tree: Tree) => void }

type RootMode = "UNSET" | "NULL" | "VALUE"

export function OnlineTreeSemanticsEditor({ fields, tree, disabled, onChange }: Props) {
  const parentFields = fields.filter((field) => field.type === "string" || field.type === "integer")
  const parent = parentFields.find((field) => field.code === tree?.parentField)
  const rootMode: RootMode = !tree || !("rootValue" in tree) ? "UNSET" : tree.rootValue === null ? "NULL" : "VALUE"
  const rootText = tree?.rootValue === undefined || tree.rootValue === null ? "" : String(tree.rootValue)
  const patch = (next: Partial<Tree>) => { if (!tree?.parentField) return; onChange({ ...tree, ...next }) }
  const setRootMode = (mode: RootMode) => {
    if (!tree?.parentField) return
    if (mode === "UNSET") { const { rootValue: _rootValue, ...next } = tree; onChange(next); return }
    if (mode === "NULL") { onChange({ ...tree, rootValue: null }); return }
    onChange({ ...tree, rootValue: parent?.type === "integer" ? 0 : "" })
  }
  return <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-4"><div className="mb-4"><h3 className="font-semibold text-violet-950">树表语义</h3><p className="mt-1 text-xs text-violet-800">树关系仅由当前 Draft 的受控字段定义。发布后功能测试按 Jeecg 树表 AUTO 页写入沙箱，并校验父节点、环和子节点删除。</p></div>{!parentFields.length ? <p className="rounded border border-violet-200 bg-white p-3 text-sm text-violet-900">请先添加一个 string 或 integer 类型字段，再指定父级字段。</p> : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs">父级字段<select disabled={disabled} value={tree?.parentField ?? ""} onChange={(event) => { const parentField = event.target.value; const selected = parentFields.find((field) => field.code === parentField); onChange({ parentField, childrenIndicator: tree?.childrenIndicator === true, ...(tree?.sortField ? { sortField: tree.sortField } : {}), ...(tree?.rootValue === null ? { rootValue: null } : tree?.rootValue !== undefined && selected?.type === typeof tree.rootValue ? { rootValue: tree.rootValue } : {}) }) }} className="mt-1 h-9 w-full rounded border px-2"><option value="">请选择父级字段</option>{parentFields.map((field) => <option key={field.code} value={field.code}>{field.code} · {field.type}</option>)}</select></label><label className="text-xs">排序字段<select disabled={disabled || !tree?.parentField} value={tree?.sortField ?? ""} onChange={(event) => patch({ sortField: event.target.value || undefined })} className="mt-1 h-9 w-full rounded border px-2"><option value="">不指定</option>{fields.map((field) => <option key={field.code} value={field.code}>{field.code} · {field.type}</option>)}</select></label><label className="text-xs">根节点值<select disabled={disabled || !tree?.parentField} value={rootMode} onChange={(event) => setRootMode(event.target.value as RootMode)} className="mt-1 h-9 w-full rounded border px-2"><option value="UNSET">不声明</option><option value="NULL">NULL</option><option value="VALUE">固定值</option></select></label>{rootMode === "VALUE" && <label className="text-xs">固定根值<input disabled={disabled || !tree?.parentField} type={parent?.type === "integer" ? "number" : "text"} value={rootText} onChange={(event) => { const raw = event.target.value; if (parent?.type === "integer") { if (!/^-?\d+$/.test(raw)) return; patch({ rootValue: Number(raw) }) } else patch({ rootValue: raw }) }} className="mt-1 h-9 w-full rounded border px-2" /></label>}<label className="mt-5 flex items-center gap-2 text-sm"><input disabled={disabled || !tree?.parentField} checked={tree?.childrenIndicator === true} onChange={(event) => patch({ childrenIndicator: event.target.checked })} type="checkbox" />维护子节点标记</label></div>}</section>
}
