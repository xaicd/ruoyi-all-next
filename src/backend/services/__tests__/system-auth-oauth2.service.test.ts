import { describe, expect, it } from "vitest"
import { SystemAuthService } from "../system-auth.service"
import { SystemCaptchaService } from "../system-captcha.service"
import { SystemOauth2Service } from "../system-oauth2.service"

describe("System auth and oauth2 services", () => {
  it("logs in and returns token", async () => {
    const result = await SystemAuthService.login({
      username: "superadmin",
      password: "admin123",
    })

    expect(result.token).toBeTruthy()
    expect(result.user.username).toBe("superadmin")
  })

  it("returns permission info", async () => {
    const result = await SystemAuthService.getPermissionInfo("u-001")
    expect(result.roles.length).toBeGreaterThan(0)
    expect(result.permissions.length).toBeGreaterThan(0)
  })

  it("lists oauth2 clients and tokens", async () => {
    const clients = await SystemOauth2Service.listClients({ page: 1, pageSize: 20, keyword: "" })
    const tokens = await SystemOauth2Service.listTokens({ page: 1, pageSize: 20, keyword: "" })

    expect(clients.total).toBeGreaterThan(0)
    expect(tokens.total).toBeGreaterThan(0)
  })

  it("generates and verifies captcha", async () => {
    const captcha = await SystemCaptchaService.generate()
    const decoded = Buffer.from(captcha.imageBase64, "base64").toString("utf-8")
    const code = decoded.replace("CAPTCHA:", "")

    const verified = await SystemCaptchaService.verify({
      captchaId: captcha.captchaId,
      code,
    })

    expect(verified.success).toBe(true)
  })

  it("issues oauth2 open token and reads user info", async () => {
    const token = await SystemOauth2Service.openToken({
      clientId: "admin-web",
      clientSecret: "admin-web-secret",
      grantType: "password",
      username: "superadmin",
      password: "admin123",
    })

    const user = await SystemOauth2Service.getUserInfo({ accessToken: token.accessToken })

    expect(token.accessToken).toBeTruthy()
    expect(user.username).toBe("superadmin")
  })
})
