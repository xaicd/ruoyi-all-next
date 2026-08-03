import { afterEach, describe, expect, it, vi } from "vitest"
import { ruoyiPrisma } from "../../../../shared/backend/prisma"
import { SystemOnlineUserService } from "../online-user.service"

describe("SystemOnlineUserService", () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await ruoyiPrisma.session.deleteMany({ where: { user: { phone: { startsWith: "1399000" } } } })
    await ruoyiPrisma.user.deleteMany({ where: { phone: { startsWith: "1399000" } } })
  })

  it("lists active sessions from the database", async () => {
    const user = await ruoyiPrisma.user.create({
      data: {
        phone: "13990001234",
        password: "x",
        name: "在线用户",
      },
    })
    const session = await ruoyiPrisma.session.create({
      data: {
        sessionToken: `session-${Date.now()}`,
        userId: user.id,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    })

    const result = await SystemOnlineUserService.list({ page: 1, pageSize: 20, keyword: "在线" })

    expect(result.total).toBeGreaterThan(0)
    expect(result.items.some((item) => item.sessionId === session.id)).toBe(true)
  })
})
