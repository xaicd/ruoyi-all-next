import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import { describe, expect, it } from "vitest"
import { ErpService } from ".."

/**
 * 这些用例直接驱动仓储/服务，**必须带租户上下文** —— 业务表 tenant_id 非空
 * （AGENTS §4.8: 租户从全局上下文取）。生成的测试模板本来就会包这一层，
 * 手写的这几个漏了，于是真实库报 `null value in column "tenant_id"`。
 */
const asTenant = <T>(work: () => Promise<T>) => runWithTenantContext({ tenantId: "1" }, work)

describe("ErpService plugin baseline", () => {
  it("listProducts 返回分页结果", () => asTenant(async () => {
    const result = await ErpService.listProducts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  }))

  it("adjustStock 对不存在商品抛出错误", () => asTenant(async () => {
    await expect(
      ErpService.adjustStock({ productId: "not-exist", delta: 1, reason: "盘点" }),
    ).rejects.toThrow("商品不存在")
  }))
})

/**
 * 修复前 `adjustStock` 读写的是 **MOCK_PRODUCTS 内存对象**、且是读-改-写:
 * 调整不落库，并发下还会超卖。这两条钉住修复后的行为。
 */
describe("ErpService 库存调整（修复后）", () => {
  it("落到 erp_stock（不再改内存 mock）", () => asTenant(async () => {
    const { ErpProductRepository } = await import("../../repositories/erp-product.repository")
    const { ErpStockRepository } = await import("../../repositories/erp-stock.repository")
    const product = await ErpProductRepository.create({ name: "测试商品", sku: "SKU-T1" })

    const result = await ErpService.adjustStock({ productId: String(product.id), delta: 10, reason: "入库" })
    expect(result.stock).toBe(10)

    const stockRows = await ErpStockRepository.page({ page: 1, pageSize: 10, product_id: String(product.id) })
    expect(stockRows.items).toHaveLength(1)
    expect(Number(stockRows.items[0].count)).toBe(10)
  }))

  it("扣减超过库存时拒绝，且**数据未被改动**（不是扣成负数）", () => asTenant(async () => {
    const { ErpProductRepository } = await import("../../repositories/erp-product.repository")
    const { ErpStockRepository } = await import("../../repositories/erp-stock.repository")
    const product = await ErpProductRepository.create({ name: "测试商品2", sku: "SKU-T2" })
    await ErpService.adjustStock({ productId: String(product.id), delta: 5, reason: "入库" })

    await expect(
      ErpService.adjustStock({ productId: String(product.id), delta: -99, reason: "出库" }),
    ).rejects.toThrow(/库存不可用|未生效/)

    const stockRows = await ErpStockRepository.page({ page: 1, pageSize: 10, product_id: String(product.id) })
    expect(Number(stockRows.items[0].count)).toBe(5)
  }))

  it("出库后再入库，数值正确累计", () => asTenant(async () => {
    const { ErpProductRepository } = await import("../../repositories/erp-product.repository")
    const product = await ErpProductRepository.create({ name: "测试商品3", sku: "SKU-T3" })
    await ErpService.adjustStock({ productId: String(product.id), delta: 8, reason: "入库" })
    const after = await ErpService.adjustStock({ productId: String(product.id), delta: -3, reason: "出库" })
    expect(after.stock).toBe(5)
  }))
})
