"use client"

import { useEffect, useMemo, useState } from "react"
import { API, request } from "@/modules/shared/frontend/lib/request"

export type DepartmentTreeNode = {
  id: string
  name: string
  status?: string
  children?: DepartmentTreeNode[]
}

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  tree?: DepartmentTreeNode[]
  activeOnly?: boolean
  excludeSubtreeId?: string
}

function collectIds(nodes: DepartmentTreeNode[], id: string): Set<string> {
  const collectSubtree = (node: DepartmentTreeNode): string[] => [node.id, ...(node.children ?? []).flatMap(collectSubtree)]
  for (const node of nodes) {
    if (node.id === id) return new Set(collectSubtree(node))
    const nested = collectIds(node.children ?? [], id)
    if (nested.size) return nested
  }
  return new Set()
}

function findName(nodes: DepartmentTreeNode[], id: string): string | undefined {
  for (const node of nodes) {
    if (node.id === id) return node.name
    const found = findName(node.children ?? [], id)
    if (found) return found
  }
}

export function DepartmentTreeSelect({ value, onChange, placeholder = "请选择部门", tree, activeOnly = false, excludeSubtreeId }: Props) {
  const [loadedTree, setLoadedTree] = useState<DepartmentTreeNode[]>(tree ?? [])
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(!tree)
  const [error, setError] = useState("")

  useEffect(() => {
    if (tree) { setLoadedTree(tree); setLoading(false); return }
    request.get<DepartmentTreeNode[]>(API.DEPTS, activeOnly ? { status: "ACTIVE" } : undefined).then((result) => {
      if (result.success && Array.isArray(result.data)) setLoadedTree(result.data)
      else setError(result.error || "部门加载失败")
    }).finally(() => setLoading(false))
  }, [tree, activeOnly])

  const excluded = useMemo(() => excludeSubtreeId ? collectIds(loadedTree, excludeSubtreeId) : new Set<string>(), [loadedTree, excludeSubtreeId])
  const selectedName = findName(loadedTree, value)
  const matches = (node: DepartmentTreeNode) => !keyword || node.name.toLowerCase().includes(keyword.toLowerCase())

  const renderNodes = (nodes: DepartmentTreeNode[], level = 0): React.ReactNode => nodes.map((node) => {
    if (excluded.has(node.id) || (activeOnly && node.status && node.status !== "ACTIVE")) return null
    const children = node.children ?? []
    const hasVisibleChildren = children.some((child) => !excluded.has(child.id) && (!activeOnly || !child.status || child.status === "ACTIVE"))
    const isExpanded = expanded.has(node.id) || Boolean(keyword)
    return <div key={node.id}>
      <div className="flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-blue-50" style={{ paddingLeft: `${level * 18 + 8}px` }}>
        <button type="button" onClick={() => setExpanded((current) => { const next = new Set(current); next.has(node.id) ? next.delete(node.id) : next.add(node.id); return next })} className="h-5 w-5 text-slate-400 disabled:invisible" disabled={!hasVisibleChildren}>{isExpanded && hasVisibleChildren ? "⌄" : "›"}</button>
        <button type="button" onClick={() => { onChange(node.id); setOpen(false); setKeyword("") }} className={`flex-1 text-left ${matches(node) ? "" : "text-slate-400"}`}>{matches(node) ? node.name : node.name}</button>
      </div>
      {hasVisibleChildren && isExpanded && renderNodes(children, level + 1)}
    </div>
  })

  return <div className="relative">
    <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-sm"><span className={selectedName ? "" : "text-slate-400"}>{selectedName ?? placeholder}</span><span className="text-slate-400">⌄</span></button>
    {open && <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-2 shadow-lg">
      <div className="mb-2 flex gap-2"><input autoFocus value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索部门" className="h-8 flex-1 rounded border px-2 text-sm" /><button type="button" onClick={() => { onChange(""); setOpen(false) }} className="px-2 text-xs text-slate-500">清空</button></div>
      <div className="max-h-56 overflow-y-auto">{loading ? <p className="p-2 text-xs text-slate-400">加载中...</p> : error ? <p className="p-2 text-xs text-red-500">{error}</p> : loadedTree.length ? renderNodes(loadedTree) : <p className="p-2 text-xs text-slate-400">暂无部门</p>}</div>
    </div>}
  </div>
}
