import { describe, expect, it } from "vitest"
import { ErpService } from ".."

describe("ErpService module baseline", () => {
  it("listProducts 返回分页结果", async () => {
    const result = await ErpService.listProducts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  it("adjustStock 对不存在商品抛出错误", async () => {
    await expect(
      ErpService.adjustStock({ productId: "not-exist", delta: 1, reason: "盘点" }),
    ).rejects.toThrow("商品不存在")
  })
})
