import type { ErpPageQueryInput, ErpStockAdjustmentInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { alwaysTrue, comparePredicate, eqColumn, hasRealDatabase, joinAnd, mutateColumnAtomic } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId } from "@/modules/shared/backend/lib/biz-tenant"
import { executePlan, planDeduct, planReplenish } from "@/modules/shared/backend/lib/inventory-invariant"
import { ErpProductRepository } from "../repositories/erp-product.repository"
import { ErpStockRepository } from "../repositories/erp-stock.repository"

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

    /**
     * 库存调整。
     *
     * 改前的问题（真实存在，不是假想）:
     *   1. 读写的是 **MOCK_PRODUCTS 内存对象** —— `erp_stock` 表明明在却没用，调整不落库
     *   2. `nextStock = stock + delta; if (nextStock < 0) throw; stock = nextStock` 是
     *      **读-改-写**: 两个并发扣减会**双双通过检查**，各自扣一次 = 超卖
     *
     * 现在: 真实仓储 + 共享的库存不变量（纯函数判定 + **单条条件 UPDATE**）。
     * 契约（入参/返回/错误）保持不变 —— 这是修实现，不是改接口。
     */
    static async adjustStock(input: ErpStockAdjustmentInput) {
      domainLog.event("erp.stock.adjust", { productId: input.productId, delta: input.delta })

      const product = await ErpProductRepository.findById(input.productId)
      if (!product) {
        throw new Error("商品不存在")
      }

      // 取该商品的库存行；没有就建一条 0 库存（对齐源实现 selectByProductIdAndWarehouseId 的语义）。
      // 注意: 这依赖 erp_stock 的元数据里把 product_id 声明为可查（queryType: EQ）——
      // 没声明的话生成的 FILTERS 是空的，过滤参数会被**静默忽略**、返回全部行（实测踩到）。
      const existing = await ErpStockRepository.page({ page: 1, pageSize: 1, product_id: input.productId })
      let stockId = existing.items[0]?.id as string | undefined
      const current = Number((existing.items[0]?.count as number) ?? 0)
      if (!stockId) {
        const created = await ErpStockRepository.create({ product_id: input.productId, count: 0 })
        stockId = String((created as { id: string }).id)
      }

      const row = { id: stockId, qty: current, lockedQty: 0 }
      const amount = Math.abs(input.delta)
      const plan = input.delta >= 0 ? planReplenish(row, amount) : planDeduct(row, amount)

      const next = await executePlan(row, plan, amount, {
        applyConditionalUpdate: async (_id, executed, applied) => {
          if (!hasRealDatabase()) {
            // 内存回退: 与 SQL guard 同语义
            if (executed.kind === "deduct" && row.qty < applied) return 0
            await ErpStockRepository.update(stockId!, { count: executed.nextQty })
            return 1
          }
          const tenantId = getCurrentTenantId()
          const predicates = [eqColumn("id", stockId), tenantId ? eqColumn("tenant_id", tenantId) : alwaysTrue()]
          if (executed.conditionalUpdate.guardApplies) predicates.push(comparePredicate("count", applied, ">="))
          const signed = executed.kind === "deduct" ? -applied : applied
          return mutateColumnAtomic("erp_stock", "count", signed, joinAnd(predicates))
        },
      })

      domainLog.audit("erp.stock.adjust", {
        targetType: "PRODUCT",
        targetId: input.productId,
        delta: input.delta,
      })
      return {
        productId: input.productId,
        delta: input.delta,
        stock: next.qty,
        reason: input.reason,
      }
    }
}
