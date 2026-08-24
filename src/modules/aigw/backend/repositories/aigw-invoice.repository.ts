export interface AigwInvoiceRow {
  id: string
  tenantId: string
  invoiceNo: string
  title: string
  taxNo: string
  amount: number
  type: "增值税专用发票" | "增值税普通发票"
  status: "ISSUED" | "PENDING" | "CANCELLED"
  createdAt: string
  updatedAt: string
}

export const MEMORY_INVOICES: AigwInvoiceRow[] = [
  {
    id: "inv-1",
    tenantId: "1",
    invoiceNo: "INV-202608-001",
    title: "中国电信股份有限公司广东省政企分公司",
    taxNo: "91440000123456789X",
    amount: 150000,
    type: "增值税专用发票",
    status: "ISSUED",
    createdAt: "2026-08-20",
    updatedAt: "2026-08-20",
  },
  {
    id: "inv-2",
    tenantId: "1",
    invoiceNo: "INV-202608-002",
    title: "中国移动通信集团浙江有限公司云中心",
    taxNo: "91330000987654321Y",
    amount: 80000,
    type: "增值税专用发票",
    status: "ISSUED",
    createdAt: "2026-08-21",
    updatedAt: "2026-08-21",
  },
]

export class AigwInvoiceRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20) {
    const filtered = MEMORY_INVOICES.filter((item) => item.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(tenantId: string, data: any) {
    const record: AigwInvoiceRow = {
      id: `inv-${Date.now()}`,
      tenantId,
      invoiceNo: data.invoiceNo || `INV-202608-${Math.floor(Math.random() * 899 + 100)}`,
      title: data.title || "未命名企业抬头",
      taxNo: data.taxNo || "91440000XXXXXXXXXX",
      amount: Number(data.amount || 10000),
      type: data.type || "增值税专用发票",
      status: data.status || "ISSUED",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    MEMORY_INVOICES.unshift(record)
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_INVOICES.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_INVOICES[idx] = {
        ...MEMORY_INVOICES[idx],
        ...data,
        updatedAt: new Date().toISOString().split("T")[0],
      }
      return MEMORY_INVOICES[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_INVOICES.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_INVOICES.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwInvoiceRepository = new AigwInvoiceRepository()
