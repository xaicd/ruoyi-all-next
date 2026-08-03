import type { ErpPageQueryInput, ErpStockAdjustmentInput } from "../validators"
import { domainLog } from "../../../../backend/lib/domain-log"

type ErpProduct = {
  id: string
  name: string
  sku: string
  stock: number
}

type ErpOrder = {
  id: string
  code: string
  amount: number
  status: "PENDING" | "PAID"
}

const MOCK_PRODUCTS: ErpProduct[] = [
  { id: "erp-p-001", name: "农旅联名礼盒", sku: "SKU-001", stock: 320 },
  { id: "erp-p-002", name: "乡村伴手礼", sku: "SKU-002", stock: 180 },
]

const MOCK_ORDERS: ErpOrder[] = [
  { id: "erp-o-001", code: "PO-202608-001", amount: 12800, status: "PENDING" },
  { id: "erp-o-002", code: "PO-202608-002", amount: 5600, status: "PAID" },
]

export class ErpService {
  static async listProducts(input: ErpPageQueryInput) {
    domainLog.event("erp.product.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_PRODUCTS.filter((item) => item.name.toLowerCase().includes(keyword) || item.sku.toLowerCase().includes(keyword))
      : MOCK_PRODUCTS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async listOrders(input: ErpPageQueryInput) {
    domainLog.event("erp.order.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_ORDERS.filter((item) => item.code.toLowerCase().includes(keyword) || item.status.toLowerCase().includes(keyword))
      : MOCK_ORDERS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async adjustStock(input: ErpStockAdjustmentInput) {
    domainLog.event("erp.stock.adjust", { productId: input.productId, delta: input.delta })
    const product = MOCK_PRODUCTS.find((item) => item.id === input.productId)
    if (!product) {
      throw new Error("商品不存在")
    }

    const nextStock = product.stock + input.delta
    if (nextStock < 0) {
      throw new Error("库存不足，无法扣减")
    }

    product.stock = nextStock
    domainLog.audit("erp.stock.adjust", {
      targetType: "PRODUCT",
      targetId: product.id,
      delta: input.delta,
    })
    return {
      productId: product.id,
      delta: input.delta,
      stock: product.stock,
      reason: input.reason,
    }
  }
}
