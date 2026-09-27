import { describe, expect, it } from "vitest"
import { MemberAuthService } from "../member-auth.service"
import { MemberProfileService } from "../member-profile.service"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

// 无 DB env → repository 走内存兜底，测试确定性、无需真实库。
// 会员按租户隔离（AGENTS.md §4.8）：注册与个人中心都要求租户上下文，故统一在租户内执行。

const TENANT_A = "tenant-test-a"
const TENANT_B = "tenant-test-b"

function inTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
  return runWithTenantContext({ tenantId, endpoint: "app", isPlatform: false }, fn)
}

function decodeJwtPayload(token: string): Record<string, any> {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"))
}

describe("MemberAuthService", () => {
  it("注册 → 登录 → 取资料 → 改资料 全链路", async () => {
    const account = `u_${Date.now()}`
    const reg = await inTenant(TENANT_A, () =>
      MemberAuthService.register({ account, password: "pass1234", nickname: "小明" }),
    )
    expect(reg.account).toBe(account)
    expect(reg.nickname).toBe("小明")
    expect((reg as any).passwordHash).toBeUndefined() // 不泄露密码

    const login = await inTenant(TENANT_A, () => MemberAuthService.login({ account, password: "pass1234" }))
    expect(login.token.split(".")).toHaveLength(3) // JWT 三段
    expect(login.member.id).toBe(reg.id)
    // 租户必须随 JWT 下发，否则后续 app 请求没有租户上下文（withAppRoute → toTenantContext）
    expect(decodeJwtPayload(login.token).tenantId).toBe(TENANT_A)

    const profile = await inTenant(TENANT_A, () => MemberProfileService.getProfile(login.member.id))
    expect(profile.nickname).toBe("小明")

    const updated = await inTenant(TENANT_A, () =>
      MemberProfileService.updateProfile(login.member.id, { nickname: "改名" }),
    )
    expect(updated.nickname).toBe("改名")
  })

  it("重复账号注册被拒（租户内）", async () => {
    const account = `dup_${Date.now()}`
    await inTenant(TENANT_A, () => MemberAuthService.register({ account, password: "pass1234" }))
    await expect(
      inTenant(TENANT_A, () => MemberAuthService.register({ account, password: "other123" })),
    ).rejects.toThrow("账号已注册")
  })

  it("错误密码 / 不存在账号 登录统一报错（防枚举）", async () => {
    const account = `login_${Date.now()}`
    await inTenant(TENANT_A, () => MemberAuthService.register({ account, password: "right123" }))
    await expect(MemberAuthService.login({ account, password: "wrong" })).rejects.toThrow("账号或密码错误")
    await expect(MemberAuthService.login({ account: "no_such_user", password: "x" })).rejects.toThrow(
      "账号或密码错误",
    )
  })

  it("昵称缺省时用账号兜底", async () => {
    const account = `nick_${Date.now()}`
    const reg = await inTenant(TENANT_A, () => MemberAuthService.register({ account, password: "pass1234" }))
    expect(reg.nickname).toBe(account)
  })

  it("按租户隔离：同名账号跨租户互不可见，无租户标识时拒绝歧义登录", async () => {
    const account = `iso_${Date.now()}`
    const memberA = await inTenant(TENANT_A, () =>
      MemberAuthService.register({ account, password: "pass1234" }),
    )
    const memberB = await inTenant(TENANT_B, () =>
      MemberAuthService.register({ account, password: "pass1234" }),
    )
    // 同名账号在两个租户下是两个独立会员
    expect(memberA.id).not.toBe(memberB.id)

    // 跨租户读取被隔离：B 租户读不到 A 租户的会员
    await expect(inTenant(TENANT_B, () => MemberProfileService.getProfile(memberA.id))).rejects.toThrow(
      "会员不存在",
    )
    const ownB = await inTenant(TENANT_B, () => MemberProfileService.getProfile(memberB.id))
    expect(ownB.account).toBe(account)

    // 未提供租户标识时账号歧义必须报错，绝不静默取其一（否则等于跨租户冒名登录）
    await expect(MemberAuthService.login({ account, password: "pass1234" })).rejects.toThrow("多个租户")
  })
})
