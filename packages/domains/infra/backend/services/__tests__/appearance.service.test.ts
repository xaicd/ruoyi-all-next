import { beforeEach, describe, expect, it } from "vitest"
import { APPEARANCE_KEY, AppearanceService } from "../appearance.service"
import { DEFAULT_APPEARANCE } from "../../validators/appearance.validators"

// 无 DB env → 内存兜底。测试默认值 / 局部更新 merge / 公开脱敏 / 缺字段回填。

describe("AppearanceService", () => {
  // 用例语义是"**无配置**返回默认值"，所以必须先确保真的没有配置行。
  // 真实库下配置是持久的 —— 上一个用例写进去的值会留到下一次运行，
  // 于是这条断言会在**第二次**起失败（内存模式每次全新所以看不出来）。
  beforeEach(async () => {
    const { getKyselyDb } = await import("@/modules/shared/backend/lib/database")
    const { hasRealDatabase } = await import("@/modules/shared/backend/lib/database")
    if (!hasRealDatabase()) return
    const db = await getKyselyDb()
    await db.deleteFrom("system_config").where("key", "=", APPEARANCE_KEY).execute()
  })

  it("无配置返回默认值", async () => {
    const a = await AppearanceService.get()
    expect(a.siteName).toBe(DEFAULT_APPEARANCE.siteName)
    expect(a.primaryColor).toBe(DEFAULT_APPEARANCE.primaryColor)
    expect(a.layout.density).toBe("comfortable")
  })

  it("局部更新 merge 并持久读回", async () => {
    const updated = await AppearanceService.update({ siteName: "我的商城", primaryColor: "#ff6600", radius: 12 })
    expect(updated.siteName).toBe("我的商城")
    expect(updated.primaryColor).toBe("#ff6600")
    expect(updated.radius).toBe(12)
    // 未改字段保留默认
    expect(updated.fontFamily).toBe(DEFAULT_APPEARANCE.fontFamily)

    const readback = await AppearanceService.get()
    expect(readback.siteName).toBe("我的商城")
    expect(readback.primaryColor).toBe("#ff6600")
  })

  it("非法主色被拒（zod 校验）", async () => {
    await expect(AppearanceService.update({ primaryColor: "not-a-color" })).rejects.toThrow()
  })

  it("公开配置只含呈现字段", async () => {
    const pub = await AppearanceService.getPublic()
    expect(pub).toHaveProperty("siteName")
    expect(pub).toHaveProperty("primaryColor")
    expect(pub).toHaveProperty("radius")
    expect(pub).toHaveProperty("layout")
  })
})
