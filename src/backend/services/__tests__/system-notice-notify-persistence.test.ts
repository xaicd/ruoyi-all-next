import { describe, expect, it, beforeEach } from "vitest"
import { ruoyiPrisma } from "../../../modules/shared/backend/prisma"
import {
  SystemNoticeService,
  SystemNotifyTemplateService,
  SystemNotifyMessageService,
} from "../../../modules/system/backend/services"

describe("system notice and notify persistence", () => {
  beforeEach(async () => {
    await ruoyiPrisma.setting.deleteMany({
      where: {
        key: {
          in: [
            "system.notice.items",
            "system.notify.templates",
            "system.notify.messages",
          ],
        },
      },
    })
  })

  it("persists notices, templates, and messages to the database", async () => {
    const notice = await SystemNoticeService.create("admin-1", {
      title: "数据库持久化公告",
      content: "系统公告已落库",
      type: "INFO",
    })

    const template = await SystemNotifyTemplateService.create("admin-1", {
      code: "DB_TEST_TEMPLATE",
      name: "数据库模板",
      channel: "SITE",
      status: "ACTIVE",
    })

    const message = await SystemNotifyMessageService.create("admin-1", {
      templateCode: template.code,
      receiver: "user-1",
      status: "SUCCESS",
    })

    const storedNoticeSetting = await ruoyiPrisma.setting.findUnique({
      where: { key: "system.notice.items" },
    })
    const storedTemplateSetting = await ruoyiPrisma.setting.findUnique({
      where: { key: "system.notify.templates" },
    })
    const storedMessageSetting = await ruoyiPrisma.setting.findUnique({
      where: { key: "system.notify.messages" },
    })

    expect(storedNoticeSetting?.value).toBeTruthy()
    expect(storedTemplateSetting?.value).toBeTruthy()
    expect(storedMessageSetting?.value).toBeTruthy()

    const listedNotices = await SystemNoticeService.list({ page: 1, pageSize: 10 })
    const listedTemplates = await SystemNotifyTemplateService.list({ page: 1, pageSize: 10 })
    const listedMessages = await SystemNotifyMessageService.list({ page: 1, pageSize: 10 })

    expect(listedNotices.items.some((item) => item.id === notice.id)).toBe(true)
    expect(listedTemplates.items.some((item) => item.id === template.id)).toBe(true)
    expect(listedMessages.items.some((item) => item.id === message.id)).toBe(true)
  })
})
