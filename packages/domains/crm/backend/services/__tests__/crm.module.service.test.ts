import { describe, expect, it } from "vitest"
import { CrmService } from ".."

describe("CrmService module baseline", () => {
  it("listCustomers 返回分页结果", async () => {
    const result = await CrmService.listCustomers({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  it("createFollowup 对不存在客户抛出错误", async () => {
    await expect(
      CrmService.createFollowup({ customerId: "not-exist", content: "跟进测试" }),
    ).rejects.toThrow("客户不存在")
  })
})
