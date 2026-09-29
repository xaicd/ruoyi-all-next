import { describe, it, expect } from "vitest"
import { SystemPartnerService } from "../partner.service"

describe("SystemPartnerService", () => {
  it("should page, create, update and delete partners in system domain", async () => {
    const list = await SystemPartnerService.page({ page: 1, pageSize: 10 })
    expect(list.total).toBeGreaterThanOrEqual(1)

    // 创建新合伙人
    const created = await SystemPartnerService.create({
      partnerCode: "PT-TEST-001",
      name: "广州市粤智算力科技有限公司",
      level: "GOLD",
      creditCode: "91440101TEST99999",
      contactName: "赵总",
      contactPhone: "13700137000",
      region: "广东省-广州市",
      commissionRate: 0.20,
      promoCode: "GZ9900",
      balance: 0,
      totalCommission: 0,
      allowedTenantIds: ["2", "3"],
      masterPoolTokens: 1000000000,
      status: "ACTIVE",
      tenantId: "1",
    })
    expect(created.id).toBeDefined()
    expect(created.name).toBe("广州市粤智算力科技有限公司")
    expect(created.allowedTenantIds).toEqual(["2", "3"])

    // 更新合伙人
    const updated = await SystemPartnerService.update(created.id, {
      balance: 10000,
      commissionRate: 0.22,
    })
    expect(updated.balance).toBe(10000)
    expect(updated.commissionRate).toBe(0.22)

    // 删除合伙人
    await SystemPartnerService.delete(created.id)
    const found = await SystemPartnerService.get(created.id)
    expect(found).toBeNull()
  })
})
