import { afterEach, describe, expect, it } from "vitest"
import { registerAdminSession, resetAdminSessions } from "@/modules/shared/backend/auth/session-registry"
import { SystemOnlineUserService } from "../online-user.service"

describe("SystemOnlineUserService", () => {
  afterEach(() => {
    resetAdminSessions()
  })

  it("lists active sessions from the in-process registry", async () => {
    registerAdminSession({
      sessionId: "sess-online-1",
      userId: "u-1",
      username: "admin",
      nickname: "在线用户",
      userIp: "127.0.0.1",
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })

    const result = await SystemOnlineUserService.list({ page: 1, pageSize: 20, keyword: "在线" })
    expect(result.total).toBe(1)
    expect(result.items.some((item) => item.sessionId === "sess-online-1")).toBe(true)
  })

  it("force-logout revokes the session", async () => {
    registerAdminSession({
      sessionId: "sess-kick",
      userId: "u-2",
      username: "test",
      nickname: "测试",
      userIp: "127.0.0.1",
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })
    await SystemOnlineUserService.forceLogoutOnlineUser({ sessionId: "sess-kick", operatorId: "admin" })
    const result = await SystemOnlineUserService.list({ page: 1, pageSize: 20 })
    expect(result.items.some((item) => item.sessionId === "sess-kick")).toBe(false)
  })
})
