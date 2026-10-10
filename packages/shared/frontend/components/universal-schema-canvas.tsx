"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  GENERATED_PAGE_SCHEMAS,
  type GeneratedPageSchema,
  type GeneratedPageField,
} from "../../contract/page-schemas.generated"
import { Pagination } from "./pagination"
import { request } from "../lib/request"

export interface UniversalSchemaCanvasProps {
  entity: string
  domain?: string
  apiEndpoint?: string
  title?: string
  schema?: GeneratedPageSchema
  readOnly?: boolean
  className?: string
}

/**
 * 将下划线/驼峰转为 kebab-case (如 pay_order -> pay-order, AiApiKey -> ai-api-key)
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase()
}

/**
 * 格式化单元格数据展示
 */
function formatCellValue(val: any, field: GeneratedPageField): React.ReactNode {
  if (val === null || val === undefined || val === "") {
    return <span className="text-slate-300 font-mono">-</span>
  }

  // 状态类字段智能 Badge
  if (field.code.includes("status") || field.code.includes("state")) {
    const num = Number(val)
    if (num === 0 || num === 1 || String(val).toLowerCase() === "active" || String(val).toLowerCase() === "success") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          {String(val)}
        </span>
      )
    }
    if (num === 2 || String(val).toLowerCase() === "pending" || String(val).toLowerCase() === "wait") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          {String(val)}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        {String(val)}
      </span>
    )
  }

  // 金额分单位转换
  if (field.code.includes("price") || field.code.includes("amount") || field.code.includes("balance")) {
    const num = Number(val)
    if (!isNaN(num)) {
      const yuan = (num / 100).toFixed(2)
      return <span className="font-mono text-slate-900 font-medium">¥{yuan}</span>
    }
  }

  // 图片展示
  if (field.type === "image" || field.code.includes("url") && (String(val).startsWith("http") && /\.(png|jpg|jpeg|webp|gif)/i.test(String(val)))) {
    return (
      <img
        src={String(val)}
        alt="preview"
        className="w-8 h-8 rounded-md object-cover border border-slate-200 shadow-2xs"
      />
    )
  }

  // 布尔值
  if (field.type === "boolean" || typeof val === "boolean") {
    return val ? (
      <span className="text-emerald-600 font-medium text-xs">是</span>
    ) : (
      <span className="text-slate-400 text-xs">否</span>
    )
  }

  // 普通文本截断展示
  const str = String(val)
  if (str.length > 40) {
    return <span title={str}>{str.slice(0, 37)}...</span>
  }
  return <span>{str}</span>
}

/**
 * UniversalSchemaCanvas (通用动态本体画布)
 *
 * 核心设计：
 * 1. 契约优先：直接驱动自全仓 326 份机器契约与 Page Schema，80% 标准 CRUD 无需人肉手写页面代码。
 * 2. 状态机自感知：自动生成多条件动态查询、表格分页、表单浮层校验、Agent 探针信息透视。
 * 3. 渐进增强：支持与 20% 特殊定制手写页面无缝平滑共存。
 */
export function UniversalSchemaCanvas({
  entity,
  domain,
  apiEndpoint: customEndpoint,
  title: customTitle,
  schema: customSchema,
  readOnly = false,
  className = "",
}: UniversalSchemaCanvasProps) {
  // 1. 动态解析 Schema 元数据
  const schema: GeneratedPageSchema | null = useMemo(() => {
    if (customSchema) return customSchema
    const normalizedKey = entity.toLowerCase().replace(/-/g, "_")
    return GENERATED_PAGE_SCHEMAS[normalizedKey] || null
  }, [customSchema, entity])

  // 2. 推导标准 API Endpoint
  const apiEndpoint = useMemo(() => {
    if (customEndpoint) return customEndpoint
    const dom = domain || "system"
    const kebab = toKebabCase(entity)
    return `/api/v1/admin/${dom}/${kebab}`
  }, [customEndpoint, domain, entity])

  const pageTitle = customTitle || schema?.title || `${entity} 业务管理`

  // 3. 业务数据状态
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // 4. 搜索与筛选状态
  const [queryState, setQueryState] = useState<Record<string, any>>({})

  // 5. 模态框与详情状态
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<any | null>(null)

  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // 6. 加载数据流
  const loadData = useCallback(async (p = page, ps = pageSize, q = queryState) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await request.get(apiEndpoint, { page: p, pageSize: ps, ...q })
      if (res && res.success !== false) {
        const payload = res.data ?? res
        if (Array.isArray(payload)) {
          setItems(payload)
          setTotal(payload.length)
        } else if (payload && Array.isArray(payload.items)) {
          setItems(payload.items)
          setTotal(payload.total ?? payload.items.length)
        } else if (payload && Array.isArray(payload.list)) {
          setItems(payload.list)
          setTotal(payload.total ?? payload.list.length)
        } else {
          setItems([])
          setTotal(0)
        }
      } else {
        setErrorMsg(res?.message || "数据加载失败")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "网络请求异常")
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, page, pageSize, queryState])

  useEffect(() => {
    loadData(page, pageSize, queryState)
  }, [loadData, page, pageSize])

  // 7. 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadData(1, pageSize, queryState)
  }

  const handleReset = () => {
    setQueryState({})
    setPage(1)
    loadData(1, pageSize, {})
  }

  // 8. 处理保存 (新建/修改)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    setFormError(null)
    try {
      const isEdit = Boolean(editingItem?.id)
      const res = isEdit
        ? await request.put(`${apiEndpoint}/${editingItem.id}`, formData)
        : await request.post(apiEndpoint, formData)

      if (res && res.success !== false) {
        showToast(isEdit ? "更新记录成功" : "创建新记录成功")
        setFormOpen(false)
        loadData(page, pageSize, queryState)
      } else {
        setFormError(res?.message || "操作提交失败")
      }
    } catch (err: any) {
      setFormError(err.message || "请求异常")
    } finally {
      setFormSubmitting(false)
    }
  }

  // 9. 处理删除
  const handleDelete = async (row: any) => {
    const id = row.id || row.no || row.code
    if (!id) return
    if (!window.confirm(`确定要删除此条记录 (${id}) 吗？此操作将触发审计日志留存。`)) return
    try {
      const res = await request.delete(`${apiEndpoint}/${id}`)
      if (res && res.success !== false) {
        showToast("删除记录成功")
        loadData(page, pageSize, queryState)
      } else {
        alert(res?.message || "删除失败")
      }
    } catch (err: any) {
      alert(err.message || "删除网络请求异常")
    }
  }

  // 选取主要字段展示 (最多 8 列以保障大屏人机工效与适度留白)
  const displayFields = useMemo(() => {
    if (!schema?.fields) return []
    return schema.fields.slice(0, 8)
  }, [schema])

  // 选取可筛选字段 (前 4 个)
  const filterFields = useMemo(() => {
    if (!schema?.fields) return []
    return schema.fields.filter((f) => f.type === "text" || f.type === "number" || f.type === "select").slice(0, 4)
  }, [schema])

  return (
    <div className={`space-y-4 text-slate-800 ${className}`}>
      {/* Toast 提示浮层 */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMsg}
        </div>
      )}

      {/* 1. 顶部全息态头卡片 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{pageTitle}</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Universal Schema Canvas
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-500 bg-slate-100">
              {entity}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>API: {apiEndpoint}</span>
            <span>•</span>
            <span>契约字段: {schema?.fields.length ?? 0} 个</span>
          </p>
        </div>

        {/* 快捷操作区 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInspectorOpen(true)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            <span>契约透视</span>
          </button>
          <button
            type="button"
            onClick={() => loadData(page, pageSize, queryState)}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
          >
            刷新
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null)
                setFormData({})
                setFormOpen(true)
              }}
              className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition shadow-xs flex items-center gap-1.5"
            >
              <span>+ 新增</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. 动态搜索过滤器栏 */}
      {filterFields.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            {filterFields.map((field) => (
              <div key={field.code} className="flex items-center gap-2 text-xs">
                <label className="text-slate-500 font-medium whitespace-nowrap">{field.label}:</label>
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={queryState[field.code] ?? ""}
                  onChange={(e) => setQueryState((prev) => ({ ...prev, [field.code]: e.target.value }))}
                  placeholder={`输入${field.label}...`}
                  className="h-8.5 w-44 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="submit"
                className="h-8.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition"
              >
                查询
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-8.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
              >
                重置
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. 数据主表区 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {errorMsg && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-xs text-rose-700 flex items-center justify-between">
            <span>请求响应异常: {errorMsg}</span>
            <button onClick={() => loadData()} className="underline font-semibold">重试</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                {displayFields.map((field) => (
                  <th key={field.code} className="py-3 px-4 whitespace-nowrap">
                    {field.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-right whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={displayFields.length + 2} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                      <span>正在按契约提取业务数据...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={displayFields.length + 2} className="py-14 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="text-sm font-medium text-slate-600">暂无业务实体数据</p>
                      <p className="text-xs text-slate-400">
                        当前环境数据库无记录，可通过上方【+ 新增】按钮手动创建，或通过 Agent 契约快速造数。
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    {displayFields.map((field) => (
                      <td key={field.code} className="py-3 px-4 text-slate-700">
                        {formatCellValue(row[field.code], field)}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDetailItem(row)
                            setDetailOpen(true)
                          }}
                          className="px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 font-medium transition text-xs"
                        >
                          详情
                        </button>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(row)
                                setFormData({ ...row })
                                setFormOpen(true)
                              }}
                              className="px-2 py-1 rounded-md text-slate-700 hover:bg-slate-100 font-medium transition text-xs"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row)}
                              className="px-2 py-1 rounded-md text-rose-600 hover:bg-rose-50 font-medium transition text-xs"
                            >
                              删除
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. 底部分页 */}
        <div className="p-3 border-t border-slate-100">
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(ps) => {
              setPageSize(ps)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* 5. 动态表单模态框 (新增 / 编辑) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? `编辑实体 (${editingItem.id || ""})` : `新增 ${pageTitle}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">表单字段基于 Schema 运行时严格校验</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(schema?.fields || []).map((field) => (
                  <div key={field.code} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {field.label}
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                      <span className="text-slate-300 font-mono font-normal ml-1.5 text-[11px]">
                        ({field.code})
                      </span>
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        value={formData[field.code] ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.code]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        required={field.required}
                        value={formData[field.code] ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.code]: field.type === "number" ? Number(e.target.value) : e.target.value,
                          }))
                        }
                        className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-9 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium transition shadow-xs"
                >
                  {formSubmitting ? "正在保存..." : "确认保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. 详情查看模态框 */}
      {detailOpen && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">实体详细属性透视</h3>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {(schema?.fields || []).map((field) => (
                  <div key={field.code} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="text-slate-400 font-mono text-[11px]">{field.label} ({field.code})</div>
                    <div className="mt-1 text-slate-800 font-medium break-all">
                      {formatCellValue(detailItem[field.code], field)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="h-8.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 契约透视抽屉 */}
      {inspectorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-4 flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-900">Agent 契约与 Schema 描述</h3>
              <button
                type="button"
                onClick={() => setInspectorOpen(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:bg-slate-100 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-3 font-mono text-[11px]">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-1">Entity Identifier</span>
                <span className="text-slate-900 font-semibold">{entity}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block mb-1">API Base Path</span>
                <span className="text-blue-600 font-semibold">{apiEndpoint}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto rounded-xl">
                <pre>{JSON.stringify(schema, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
