import { describe, it, expect } from "vitest"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import { ProductSkuService } from "../product-sku.service"

describe("ProductSkuService - 库存扣减与防超卖守卫", () => {
  it("应正确支持库存扣减、防超卖不变量守卫以及售后库存回退", async () => {
    await runWithTenantContext({ tenantId: "100" }, async () => {
      // 1. 初始化 SKU
      const sku = await ProductSkuService.create({
        spu_id: 1001,
        properties: "颜色:黑色;内存:512G",
        price: 8999,
        market_price: 9999,
        cost_price: 6000,
        stock: 50,
      } as any)
      expect(sku.id).toBeDefined()
      expect(sku.stock).toBe(50)

      // 2. 正常扣减库存 5 件
      const deducted = await ProductSkuService.deductStock(sku.id, 5, "user-01")
      expect(deducted.stock).toBe(45)
      expect(deducted.sales_count).toBe(5)

      // 3. 不变量守卫：超卖拦截（尝试扣减 100 件超过当前剩余 45 件）
      await expect(ProductSkuService.deductStock(sku.id, 100, "user-01")).rejects.toThrow("商品库存不足")

      // 4. 不变量守卫：扣减负数或零件被拦截
      await expect(ProductSkuService.deductStock(sku.id, 0, "user-01")).rejects.toThrow("扣减库存数量必须大于0")
      await expect(ProductSkuService.deductStock(sku.id, -5, "user-01")).rejects.toThrow("扣减库存数量必须大于0")

      // 5. 订单取消，售后回退 5 件库存
      const restored = await ProductSkuService.restoreStock(sku.id, 5, "user-01")
      expect(restored.stock).toBe(50)
      expect(restored.sales_count).toBe(0)
    })
  })
})
