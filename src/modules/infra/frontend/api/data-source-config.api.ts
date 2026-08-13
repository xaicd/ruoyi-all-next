import { request } from "@/modules/shared/frontend/lib/request"

export type DataSourceConfig = {
  id: string; name: string; driver: string; url: string; username: string
  remark: string | null; isMaster: boolean; hasPassword: boolean; createdAt: string; updatedAt: string
}
export type DataSourceConfigPage = { items: DataSourceConfig[]; total: number; page: number; pageSize: number }
export type DataSourceConfigPayload = { name: string; driver: string; url: string; username: string; password?: string; remark?: string }

const endpoint = "/api/v1/admin/infra/data-source-config"
export const dataSourceConfigApi = {
  page: (params: Record<string, unknown>) => request.get<DataSourceConfigPage>(endpoint, params),
  create: (data: Required<DataSourceConfigPayload>) => request.post<{ id: string }>(endpoint, data),
  update: (id: string, data: DataSourceConfigPayload) => request.put<{ id: string }>(endpoint, { id, ...data }),
  remove: (id: string) => request.delete(`${endpoint}?id=${encodeURIComponent(id)}`),
  test: (data: { id?: string } & Partial<DataSourceConfigPayload>) => request.post<{ latencyMs: number }>(`${endpoint}/test`, data),
}
