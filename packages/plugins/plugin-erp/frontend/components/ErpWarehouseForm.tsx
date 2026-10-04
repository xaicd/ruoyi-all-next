"use client"

import React, { useState, useEffect } from "react"
import { ErpWarehouseApi } from "../api/erp-warehouse.api"
import type { ErpWarehouseCreateDTO, ErpWarehouseVO } from "@/modules/erp/backend/types/erp-warehouse.types"

interface ErpWarehouseFormProps {
  open: boolean
  initialData?: ErpWarehouseVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpWarehouseForm({ open, initialData, onClose, onSuccess }: ErpWarehouseFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    address: initialData?.address ?? "",
    sort: initialData?.sort ?? undefined,
    remark: initialData?.remark ?? "",
    principal: initialData?.principal ?? "",
    warehouse_price: initialData?.warehouse_price ?? undefined,
    truckage_price: initialData?.truckage_price ?? undefined,
    status: initialData?.status ?? undefined,
    default_status: initialData?.default_status ?? false,
      })
    }
  }, [open, initialData])

  if (!open) return null

  const isEdit = Boolean(initialData?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit && initialData?.id) {
        await ErpWarehouseApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpWarehouseApi.create(formData as ErpWarehouseCreateDTO)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || "操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-testid="erp-warehouse-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑ERP 仓库" : "新增ERP 仓库"}
        data-testid="erp-warehouse-form"
        data-agent-scope="erp-warehouse:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑ERP 仓库" : "新增ERP 仓库"}
          </h3>
          <button onClick={onClose} data-testid="erp-warehouse-form-close" data-agent-target="erp-warehouse:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="erp-warehouse-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="erp-warehouse-name" className="block text-xs text-slate-600 mb-1">仓库名称</label>
          <input
            type="text"
            id="erp-warehouse-name"
            data-testid="field-name"
            data-agent-target="erp-warehouse:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="仓库名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓库名称"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-address" className="block text-xs text-slate-600 mb-1">仓库地址</label>
          <input
            type="text"
            id="erp-warehouse-address"
            data-testid="field-address"
            data-agent-target="erp-warehouse:field:address"
            data-agent-state={formData.address ? "filled" : "empty"}
            aria-label="仓库地址"
            value={formData.address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓库地址"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-sort" className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            id="erp-warehouse-sort"
            data-testid="field-sort"
            data-agent-target="erp-warehouse:field:sort"
            data-agent-state={formData.sort == null || formData.sort === "" ? "empty" : "filled"}
            aria-label="排序"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="erp-warehouse-remark"
            data-testid="field-remark"
            data-agent-target="erp-warehouse:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-principal" className="block text-xs text-slate-600 mb-1">负责人</label>
          <input
            type="text"
            id="erp-warehouse-principal"
            data-testid="field-principal"
            data-agent-target="erp-warehouse:field:principal"
            data-agent-state={formData.principal ? "filled" : "empty"}
            aria-label="负责人"
            value={formData.principal ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, principal: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-warehouse_price" className="block text-xs text-slate-600 mb-1">仓储费，单位：元</label>
          <input
            type="number"
            id="erp-warehouse-warehouse_price"
            data-testid="field-warehouse_price"
            data-agent-target="erp-warehouse:field:warehouse_price"
            data-agent-state={formData.warehouse_price == null || formData.warehouse_price === "" ? "empty" : "filled"}
            aria-label="仓储费，单位：元"
            value={formData.warehouse_price != null ? String(formData.warehouse_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓储费，单位：元"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-truckage_price" className="block text-xs text-slate-600 mb-1">搬运费，单位：元</label>
          <input
            type="number"
            id="erp-warehouse-truckage_price"
            data-testid="field-truckage_price"
            data-agent-target="erp-warehouse:field:truckage_price"
            data-agent-state={formData.truckage_price == null || formData.truckage_price === "" ? "empty" : "filled"}
            aria-label="搬运费，单位：元"
            value={formData.truckage_price != null ? String(formData.truckage_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, truckage_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入搬运费，单位：元"
            
          />
        </div>

        <div>
          <label htmlFor="erp-warehouse-status" className="block text-xs text-slate-600 mb-1">开启状态</label>
          <input
            type="number"
            id="erp-warehouse-status"
            data-testid="field-status"
            data-agent-target="erp-warehouse:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="开启状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开启状态"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="erp-warehouse-default_status"
            data-testid="field-default_status"
            data-agent-target="erp-warehouse:field:default_status"
            data-agent-state={formData.default_status ? "on" : "off"}
            aria-label="是否默认"
            checked={Boolean(formData.default_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, default_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="erp-warehouse-default_status" className="text-xs text-slate-700 font-medium">是否默认</label>
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="erp-warehouse-form-cancel"
              data-agent-target="erp-warehouse:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="erp-warehouse-form-submit"
              data-agent-target="erp-warehouse:submit"
              data-agent-state={loading ? "busy" : "idle"}
              className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
