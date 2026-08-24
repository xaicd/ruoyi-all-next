import { request } from "@/modules/shared/frontend/lib/request"

export function getInvoicePage(params?: any) {
  return request.get("/api/v1/admin/aigw/invoices", { params })
}

export function createInvoice(data: any) {
  return request.post("/api/v1/admin/aigw/invoices", data)
}

export function updateInvoice(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/invoices?id=${id}`, data)
}

export function deleteInvoice(id: string) {
  return request.delete(`/api/v1/admin/aigw/invoices?id=${id}`)
}

export const AigwInvoiceApi = {
  page: (params?: any) => getInvoicePage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createInvoice(data),
  update: (id: string, data: any) => updateInvoice(id, data),
  delete: (id: string) => deleteInvoice(id),
}
