"use client"

type Child = { code: string; targetDefinitionCode: string; foreignKeyField: string; display: "TABLE" | "TABS" }
type MasterDetail = { layout?: "ERP" | "INNER" | "TAB"; children: Child[] }
type Props = { masterDetail?: MasterDetail; disabled: boolean; onChange: (value: MasterDetail) => void }

const control = "mt-1 h-9 w-full rounded border border-slate-200 bg-white px-2 text-sm"

export function OnlineMasterDetailSemanticsEditor({ masterDetail, disabled, onChange }: Props) {
  const children = masterDetail?.children ?? []
  const patchChild = (index: number, value: Partial<Child>) => onChange({ ...masterDetail, layout: masterDetail?.layout, children: children.map((child, position) => position === index ? { ...child, ...value } : child) })
  return <section className="rounded-lg border border-sky-200 bg-sky-50/40 p-4">
    <div className="mb-4"><h3 className="font-semibold text-sky-950">主子表语义</h3><p className="mt-1 text-xs text-sky-800">功能测试按 Jeecg AUTO 三种布局渲染：ERP 主表+下方子表、INNER 行展开、TAB 表单内页签。子表必须指向已发布的同租户 Definition。</p></div>
    <div className="mb-3 grid gap-3 md:grid-cols-2"><label className="text-xs">布局<select disabled={disabled} value={masterDetail?.layout ?? "ERP"} onChange={(event) => onChange({ layout: event.target.value as NonNullable<MasterDetail["layout"]>, children })} className={control}><option value="ERP">ERP 主子表</option><option value="INNER">内嵌子表</option><option value="TAB">Tab 主子表</option></select></label></div>
    <div className="mb-2 flex items-center justify-between"><span className="text-sm font-medium text-sky-950">子表</span><button type="button" disabled={disabled || children.length >= 16} onClick={() => onChange({ layout: masterDetail?.layout ?? "ERP", children: [...children, { code: `child_${children.length + 1}`, targetDefinitionCode: "", foreignKeyField: "parent_id", display: "TABLE" }] })} className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white disabled:opacity-50">+ 新增</button></div>
    <div className="overflow-x-auto rounded border border-sky-200 bg-white"><table className="min-w-[720px] w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-2">编码</th><th className="px-3 py-2">目标表单</th><th className="px-3 py-2">外键字段</th><th className="px-3 py-2">展示</th><th className="px-3 py-2 text-right">操作</th></tr></thead>
      <tbody>{children.map((child, index) => <tr key={`${child.code}-${index}`} className="border-t border-slate-100"><td className="px-3 py-2"><input disabled={disabled} value={child.code} onChange={(event) => patchChild(index, { code: event.target.value.trim() })} className="h-8 w-full rounded border px-2 font-mono" /></td><td className="px-3 py-2"><input disabled={disabled} value={child.targetDefinitionCode} onChange={(event) => patchChild(index, { targetDefinitionCode: event.target.value.trim() })} placeholder="已发布表单 code" className="h-8 w-full rounded border px-2 font-mono" /></td><td className="px-3 py-2"><input disabled={disabled} value={child.foreignKeyField} onChange={(event) => patchChild(index, { foreignKeyField: event.target.value.trim() })} className="h-8 w-full rounded border px-2 font-mono" /></td><td className="px-3 py-2"><select disabled={disabled} value={child.display} onChange={(event) => patchChild(index, { display: event.target.value as Child["display"] })} className="h-8 w-full rounded border px-2"><option value="TABLE">表格</option><option value="TABS">页签</option></select></td><td className="px-3 py-2 text-right"><button type="button" disabled={disabled} onClick={() => onChange({ layout: masterDetail?.layout ?? "ERP", children: children.filter((_, position) => position !== index) })} className="text-rose-600 disabled:opacity-50">删除</button></td></tr>)}</tbody>
    </table></div>
    {!children.length && <p className="mt-2 text-xs text-sky-800">至少配置一个子表后才能校验和发布主子表。</p>}
  </section>
}
