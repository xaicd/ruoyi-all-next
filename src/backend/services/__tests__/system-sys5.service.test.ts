import { describe, expect, it } from "vitest"
import { SystemSmsService } from "../system-sms.service"
import { SystemMailService } from "../system-mail.service"
import { SystemSocialService } from "../system-social.service"
import { SystemIpAreaService } from "../system-ip-area.service"

describe("System SYS-5 services", () => {
  it("lists sms/mail/social/ip resources", async () => {
    const smsChannels = await SystemSmsService.listChannels({ page: 1, pageSize: 20, keyword: "" })
    const smsLogs = await SystemSmsService.listLogs({ page: 1, pageSize: 20, keyword: "" })
    const mailAccounts = await SystemMailService.listAccounts({ page: 1, pageSize: 20, keyword: "" })
    const mailLogs = await SystemMailService.listLogs({ page: 1, pageSize: 20, keyword: "" })
    const socialUsers = await SystemSocialService.listUsers({ page: 1, pageSize: 20, keyword: "" })
    const areas = await SystemIpAreaService.listAreas({ page: 1, pageSize: 20, keyword: "" })

    expect(smsChannels.total).toBeGreaterThan(0)
    expect(smsLogs.total).toBeGreaterThan(0)
    expect(mailAccounts.total).toBeGreaterThan(0)
    expect(mailLogs.total).toBeGreaterThan(0)
    expect(socialUsers.total).toBeGreaterThan(0)
    expect(areas.total).toBeGreaterThan(0)
  })

  it("creates sms channel/mail account/social user", async () => {
    const sms = await SystemSmsService.createChannel("admin-1", {
      name: "华为云短信",
      signName: "文旅助手",
      status: "ACTIVE",
    })
    const mail = await SystemMailService.createAccount("admin-1", {
      email: "service@wenlv.local",
      host: "smtp.service.local",
      status: "ACTIVE",
    })
    const social = await SystemSocialService.createUser("admin-1", {
      provider: "WECHAT",
      nickname: "服务号A",
      externalId: "wx_service_a",
      status: "ACTIVE",
    })

    expect(sms.id).toBeTruthy()
    expect(mail.id).toBeTruthy()
    expect(social.id).toBeTruthy()
  })
})
