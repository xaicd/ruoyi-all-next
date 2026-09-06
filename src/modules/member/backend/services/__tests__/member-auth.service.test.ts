import { describe, expect, it } from "vitest"
import { MemberAuthService } from "../member-auth.service"
import { MemberProfileService } from "../member-profile.service"

// 无 DB env → repository 走内存兜底，测试确定性、无需真实库。

describe("MemberAuthService", () => {
  it("注册 → 登录 → 取资料 → 改资料 全链路", async () => {
    const account = `u_${Date.now()}`
    const reg = await MemberAuthService.register({ account, password: "pass1234", nickname: "小明" })
    expect(reg.account).toBe(account)
    expect(reg.nickname).toBe("小明")
    expect((reg as any).passwordHash).toBeUndefined() // 不泄露密码

    const login = await MemberAuthService.login({ account, password: "pass1234" })
    expect(login.token.split(".")).toHaveLength(3) // JWT 三段
    expect(login.member.id).toBe(reg.id)

    const profile = await MemberProfileService.getProfile(login.member.id)
    expect(profile.nickname).toBe("小明")

    const updated = await MemberProfileService.updateProfile(login.member.id, { nickname: "改名" })
    expect(updated.nickname).toBe("改名")
  })

  it("重复账号注册被拒", async () => {
    const account = `dup_${Date.now()}`
    await MemberAuthService.register({ account, password: "pass1234" })
    await expect(MemberAuthService.register({ account, password: "other123" })).rejects.toThrow("账号已注册")
  })

  it("错误密码 / 不存在账号 登录统一报错（防枚举）", async () => {
    const account = `login_${Date.now()}`
    await MemberAuthService.register({ account, password: "right123" })
    await expect(MemberAuthService.login({ account, password: "wrong" })).rejects.toThrow("账号或密码错误")
    await expect(MemberAuthService.login({ account: "no_such_user", password: "x" })).rejects.toThrow("账号或密码错误")
  })

  it("昵称缺省时用账号兜底", async () => {
    const account = `nick_${Date.now()}`
    const reg = await MemberAuthService.register({ account, password: "pass1234" })
    expect(reg.nickname).toBe(account)
  })
})
