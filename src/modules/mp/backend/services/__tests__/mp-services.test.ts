import { describe, expect, it } from "vitest"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"
import { MpAccountService } from "../account.service"
import { MpFanService } from "../fan.service"
import { MpMessageService } from "../message.service"

describe("mp services", () => {
  it("lists persisted accounts and fans from the database", async () => {
    await ruoyiPrisma.setting.upsert({
      where: { key: "mp.accounts" },
      create: {
        key: "mp.accounts",
        value: {
          items: [{ id: "mp-100", name: "测试服务号", appId: "wx100", status: "ACTIVE" }],
        },
      },
      update: {
        value: {
          items: [{ id: "mp-100", name: "测试服务号", appId: "wx100", status: "ACTIVE" }],
        },
      },
    })

    await ruoyiPrisma.setting.upsert({
      where: { key: "mp.fans" },
      create: {
        key: "mp.fans",
        value: {
          items: [{ id: "fan-100", nickname: "测试粉丝", accountId: "mp-100", subscribed: true }],
        },
      },
      update: {
        value: {
          items: [{ id: "fan-100", nickname: "测试粉丝", accountId: "mp-100", subscribed: true }],
        },
      },
    })

    const accounts = await MpAccountService.list({ page: 1, pageSize: 20, keyword: "测试" })
    const fans = await MpFanService.list({ page: 1, pageSize: 20, keyword: "测试" })

    expect(accounts.items[0]?.name).toBe("测试服务号")
    expect(fans.items[0]?.nickname).toBe("测试粉丝")
  })

  it("sends a message for an existing account", async () => {
    await ruoyiPrisma.setting.upsert({
      where: { key: "mp.accounts" },
      create: {
        key: "mp.accounts",
        value: {
          items: [{ id: "mp-200", name: "消息测试号", appId: "wx200", status: "ACTIVE" }],
        },
      },
      update: {
        value: {
          items: [{ id: "mp-200", name: "消息测试号", appId: "wx200", status: "ACTIVE" }],
        },
      },
    })

    const result = await MpMessageService.send({ accountId: "mp-200", content: "hello" })

    expect(result.status).toBe("QUEUED")
    expect(result.accountId).toBe("mp-200")
  })
})
