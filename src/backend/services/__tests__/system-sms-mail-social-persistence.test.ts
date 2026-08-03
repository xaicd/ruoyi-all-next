import { beforeEach, describe, expect, it } from "vitest"
import { ruoyiPrisma } from "../../../modules/shared/backend/prisma"
import {
  SystemMailService,
  SystemSmsService,
  SystemSocialService,
} from "../../../modules/system/backend/services"

describe("system sms mail social persistence", () => {
  beforeEach(async () => {
    await ruoyiPrisma.setting.deleteMany({
      where: {
        key: {
          in: [
            "system.sms.channels",
            "system.sms.logs",
            "system.mail.accounts",
            "system.mail.logs",
            "system.social.users",
          ],
        },
      },
    })
  })

  it("persists sms/mail/social records through settings", async () => {
    const channel = await SystemSmsService.createChannel("admin-1", {
      name: "本地短信通道",
      signName: "文旅平台",
      status: "ACTIVE",
    })
    const mailAccount = await SystemMailService.createAccount("admin-1", {
      email: "ops@example.com",
      host: "smtp.example.com",
      status: "ACTIVE",
    })
    const socialUser = await SystemSocialService.createUser("admin-1", {
      provider: "WECHAT",
      nickname: "测试公众号",
      externalId: "wx-test-001",
      status: "ACTIVE",
    })

    const channelSetting = await ruoyiPrisma.setting.findUnique({ where: { key: "system.sms.channels" } })
    const mailSetting = await ruoyiPrisma.setting.findUnique({ where: { key: "system.mail.accounts" } })
    const socialSetting = await ruoyiPrisma.setting.findUnique({ where: { key: "system.social.users" } })

    expect(channelSetting?.value).toBeTruthy()
    expect(mailSetting?.value).toBeTruthy()
    expect(socialSetting?.value).toBeTruthy()

    const channels = await SystemSmsService.listChannels({ page: 1, pageSize: 10 })
    const accounts = await SystemMailService.listAccounts({ page: 1, pageSize: 10 })
    const users = await SystemSocialService.listUsers({ page: 1, pageSize: 10 })

    expect(channels.items.some((item) => item.id === channel.id)).toBe(true)
    expect(accounts.items.some((item) => item.id === mailAccount.id)).toBe(true)
    expect(users.items.some((item) => item.id === socialUser.id)).toBe(true)
  })
})
