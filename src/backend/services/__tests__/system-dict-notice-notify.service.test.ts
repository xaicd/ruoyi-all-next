import { describe, expect, it } from "vitest"
import { SystemDictService } from "../system-dict.service"
import { SystemNoticeService } from "../system-notice.service"
import { SystemNotifyTemplateService } from "../system-notify-template.service"
import { SystemNotifyMessageService } from "../system-notify-message.service"
import { SystemLoginLogService } from "../system-login-log.service"
import { SystemOperateLogService } from "../system-operate-log.service"

describe("System dict/notice/notify services", () => {
  it("lists dicts, notices and notify resources", async () => {
    const dicts = await SystemDictService.list({ page: 1, pageSize: 20, keyword: "" })
    const notices = await SystemNoticeService.list({ page: 1, pageSize: 20, keyword: "" })
    const templates = await SystemNotifyTemplateService.list({ page: 1, pageSize: 20, keyword: "" })
    const messages = await SystemNotifyMessageService.list({ page: 1, pageSize: 20, keyword: "" })

    expect(dicts.total).toBeGreaterThan(0)
    expect(notices.total).toBeGreaterThan(0)
    expect(templates.total).toBeGreaterThan(0)
    expect(messages.total).toBeGreaterThan(0)
  })

  it("creates dict item and notice", async () => {
    const createdDict = await SystemDictService.create("admin-1", {
      dictType: "order_status",
      label: "已完成",
      value: "COMPLETED",
      status: "ACTIVE",
    })

    const createdNotice = await SystemNoticeService.create("admin-1", {
      title: "测试通知",
      content: "这是一次最小闭环测试通知。",
      type: "INFO",
    })

    expect(createdDict.id).toBeTruthy()
    expect(createdNotice.id).toBeTruthy()
  })

  it("creates notify template and notify message", async () => {
    const createdTemplate = await SystemNotifyTemplateService.create("admin-1", {
      code: "ORDER_CANCELLED",
      name: "订单取消提醒",
      channel: "SITE",
      status: "ACTIVE",
    })

    const createdMessage = await SystemNotifyMessageService.create("admin-1", {
      templateCode: "ORDER_CANCELLED",
      receiver: "u-001",
      status: "SUCCESS",
    })

    expect(createdTemplate.id).toBeTruthy()
    expect(createdMessage.id).toBeTruthy()
  })

  it("filters and exports login/operate logs", async () => {
    const loginFiltered = await SystemLoginLogService.list({ page: 1, pageSize: 20, keyword: "", result: "SUCCESS" })
    const loginCsv = await SystemLoginLogService.exportCsv({ page: 1, pageSize: 20, keyword: "", result: "SUCCESS" })

    const operateFiltered = await SystemOperateLogService.list({
      page: 1,
      pageSize: 20,
      keyword: "",
      module: "system.user",
    })
    const operateCsv = await SystemOperateLogService.exportCsv({
      page: 1,
      pageSize: 20,
      keyword: "",
      module: "system.user",
    })

    expect(loginFiltered.items.every((item) => item.result === "SUCCESS")).toBe(true)
    expect(loginCsv.content).toContain("id,username,ip,result,reason,createdAt")
    expect(operateFiltered.items.every((item) => item.module.includes("system.user"))).toBe(true)
    expect(operateCsv.content).toContain("id,module,action,operator,createdAt")
  })
})
