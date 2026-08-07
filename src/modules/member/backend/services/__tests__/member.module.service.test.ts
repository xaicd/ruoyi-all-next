import { describe, expect, it } from "vitest"
import { MemberService } from ".."

describe("MemberService module baseline", () => {
  it("listUsers 返回分页结果", async () => {
    const result = await MemberService.listUsers({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.length).toBeGreaterThan(0)
  })

  it("updateUser 对不存在会员抛出错误", async () => {
    await expect(MemberService.updateUser({ id: "not-exist" })).rejects.toThrow("会员不存在")
  })

  it("listLevels 返回分页结果", async () => {
    const result = await MemberService.listLevels({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("createLevel 重复名称抛出错误", async () => {
    await expect(
      MemberService.createLevel({ name: "普通会员", minPoint: 0, discount: 100 }),
    ).rejects.toThrow("等级名称已存在")
  })

  it("adjustPoint 对不存在会员抛出错误", async () => {
    await expect(
      MemberService.adjustPoint({ userId: "not-exist", point: 100, remark: "测试" }),
    ).rejects.toThrow("会员不存在")
  })

  it("adjustPoint 积分不会低于0", async () => {
    const result = await MemberService.adjustPoint({
      userId: "mem-001",
      point: -99999,
      remark: "扣减测试",
    })
    expect(result.totalPoint).toBe(0)
  })
})
