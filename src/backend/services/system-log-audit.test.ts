import { beforeEach, describe, expect, it } from "vitest"
import { clearDomainLogBuffer, getDomainAuditBuffer, getDomainEventBuffer } from "../lib/domain-log"
import { SystemOnlineUserService } from "./system-online-user.service"
import { SystemLoginLogService } from "./system-login-log.service"
import { SystemOperateLogService } from "./system-operate-log.service"
import { SystemUserService } from "./system-user.service"
import { SystemRoleService } from "./system-role.service"
import { SystemMenuService } from "./system-menu.service"
import { SystemDeptService } from "./system-dept.service"
import { SystemPostService } from "./system-post.service"
import { SystemPermissionService } from "./system-permission.service"
import { SystemAuthService } from "./system-auth.service"
import { SystemCaptchaService } from "./system-captcha.service"
import { SystemOauth2Service } from "./system-oauth2.service"
import { SystemTenantService } from "./system-tenant.service"
import { SystemTenantPackageService } from "./system-tenant-package.service"
import { SystemDictService } from "./system-dict.service"
import { SystemNoticeService } from "./system-notice.service"
import { SystemNotifyTemplateService } from "./system-notify-template.service"
import { SystemNotifyMessageService } from "./system-notify-message.service"
import { SystemSmsService } from "./system-sms.service"
import { SystemMailService } from "./system-mail.service"
import { SystemSocialService } from "./system-social.service"
import { SystemIpAreaService } from "./system-ip-area.service"

describe("system domain logs", () => {
  beforeEach(() => {
    clearDomainLogBuffer()
  })

  it("writes list and operation events", async () => {
    await SystemOnlineUserService.list({ page: 1, pageSize: 20, keyword: "" })
    await SystemLoginLogService.list({ page: 1, pageSize: 10, keyword: "superadmin" })
    await SystemLoginLogService.exportCsv({ page: 1, pageSize: 10, keyword: "", result: "SUCCESS" })
    await SystemOperateLogService.list({ page: 1, pageSize: 10, keyword: "system" })
    await SystemOperateLogService.exportCsv({ page: 1, pageSize: 10, keyword: "", module: "system" })
    await SystemUserService.list({ page: 1, pageSize: 20, keyword: "admin" })
    await SystemRoleService.list({ page: 1, pageSize: 20, keyword: "operator" })
    await SystemMenuService.list({ page: 1, pageSize: 20, keyword: "system" })
    await SystemDeptService.list({ page: 1, pageSize: 20, keyword: "运营" })
    await SystemPostService.list({ page: 1, pageSize: 20, keyword: "管理员" })
    await SystemAuthService.getPermissionInfo("u-001")
    const captcha = await SystemCaptchaService.generate()
    const captchaCode = Buffer.from(captcha.imageBase64, "base64").toString("utf-8").replace("CAPTCHA:", "")
    await SystemCaptchaService.verify({ captchaId: captcha.captchaId, code: captchaCode })
    await SystemOauth2Service.listClients({ page: 1, pageSize: 20, keyword: "admin" })
    await SystemOauth2Service.listTokens({ page: 1, pageSize: 20, keyword: "u-001" })
    await SystemTenantService.list({ page: 1, pageSize: 20, keyword: "山东" })
    await SystemTenantPackageService.list({ page: 1, pageSize: 20, keyword: "标准" })
    await SystemDictService.list({ page: 1, pageSize: 20, keyword: "启用" })
    await SystemNoticeService.list({ page: 1, pageSize: 20, keyword: "升级" })
    await SystemNotifyTemplateService.list({ page: 1, pageSize: 20, keyword: "ORDER" })
    await SystemNotifyMessageService.list({ page: 1, pageSize: 20, keyword: "u-001" })
    await SystemSmsService.listChannels({ page: 1, pageSize: 20, keyword: "阿里" })
    await SystemSmsService.listLogs({ page: 1, pageSize: 20, keyword: "138" })
    await SystemMailService.listAccounts({ page: 1, pageSize: 20, keyword: "notify" })
    await SystemMailService.listLogs({ page: 1, pageSize: 20, keyword: "mail" })
    await SystemSocialService.listUsers({ page: 1, pageSize: 20, keyword: "WECHAT" })
    await SystemIpAreaService.listAreas({ page: 1, pageSize: 20, keyword: "山东" })
    const oauth2Token = await SystemOauth2Service.openToken({
      clientId: "admin-web",
      clientSecret: "admin-web-secret",
      grantType: "password",
      username: "superadmin",
      password: "admin123",
    })
    await SystemOauth2Service.getUserInfo({ accessToken: oauth2Token.accessToken })

    const events = getDomainEventBuffer().map((item) => item.name)
    expect(events).toContain("system.online-user.list")
    expect(events).toContain("system.login-log.list")
    expect(events).toContain("system.login-log.export")
    expect(events).toContain("system.operate-log.list")
    expect(events).toContain("system.operate-log.export")
    expect(events).toContain("system.user.list")
    expect(events).toContain("system.role.list")
    expect(events).toContain("system.menu.list")
    expect(events).toContain("system.dept.list")
    expect(events).toContain("system.post.list")
    expect(events).toContain("system.auth.permission-info")
    expect(events).toContain("system.captcha.generate")
    expect(events).toContain("system.captcha.verify")
    expect(events).toContain("system.oauth2.client.list")
    expect(events).toContain("system.oauth2.token.list")
    expect(events).toContain("system.tenant.list")
    expect(events).toContain("system.tenant-package.list")
    expect(events).toContain("system.dict.list")
    expect(events).toContain("system.notice.list")
    expect(events).toContain("system.notify-template.list")
    expect(events).toContain("system.notify-message.list")
    expect(events).toContain("system.sms.channel.list")
    expect(events).toContain("system.sms.log.list")
    expect(events).toContain("system.mail.account.list")
    expect(events).toContain("system.mail.log.list")
    expect(events).toContain("system.social.user.list")
    expect(events).toContain("system.ip-area.list")
    expect(events).toContain("system.oauth2.open.token")
    expect(events).toContain("system.oauth2.user.get")
  })

  it("writes force logout audit", async () => {
    await SystemOnlineUserService.forceLogout("admin-1", { sessionId: "session-1" })
    await SystemPermissionService.assignUserRole("admin-1", {
      userId: "u-002",
      roleIds: ["r-001", "r-002"],
    })
    await SystemPermissionService.assignRoleMenu("admin-1", {
      roleId: "r-002",
      menuIds: ["m-002", "m-003"],
    })
    await SystemTenantService.updateStatus("admin-1", {
      tenantId: "t-001",
      status: "DISABLED",
    })
    await SystemTenantService.assignPackage("admin-1", {
      tenantId: "t-001",
      packageId: "tp-002",
    })
    await SystemDictService.create("admin-1", {
      dictType: "order_status",
      label: "待核销",
      value: "PENDING_USE",
      status: "ACTIVE",
    })
    await SystemNoticeService.create("admin-1", {
      title: "系统维护提醒",
      content: "凌晨两点维护窗口，请提前保存数据。",
      type: "WARN",
    })
    await SystemNotifyTemplateService.create("admin-1", {
      code: "MERCHANT_AUDIT",
      name: "商户审核通知",
      channel: "SITE",
      status: "ACTIVE",
    })
    await SystemNotifyMessageService.create("admin-1", {
      templateCode: "MERCHANT_AUDIT",
      receiver: "u-002",
      status: "SUCCESS",
    })
    await SystemSmsService.createChannel("admin-1", {
      name: "短信供应商A",
      signName: "系统提醒",
      status: "ACTIVE",
    })
    await SystemMailService.createAccount("admin-1", {
      email: "alert@wenlv.local",
      host: "smtp.alert.local",
      status: "ACTIVE",
    })
    await SystemSocialService.createUser("admin-1", {
      provider: "WECHAT",
      nickname: "运营号",
      externalId: "wx_ops_001",
      status: "ACTIVE",
    })
    await SystemAuthService.login({ username: "superadmin", password: "admin123" })
    await SystemOauth2Service.openToken({
      clientId: "admin-web",
      clientSecret: "admin-web-secret",
      grantType: "password",
      username: "superadmin",
      password: "admin123",
    })
    const captcha = await SystemCaptchaService.generate()
    const captchaCode = Buffer.from(captcha.imageBase64, "base64").toString("utf-8").replace("CAPTCHA:", "")
    await SystemCaptchaService.verify({ captchaId: captcha.captchaId, code: captchaCode })

    const audits = getDomainAuditBuffer().map((item) => item.action)
    expect(audits).toContain("system.online-user.force-logout")
    expect(audits).toContain("system.permission.assign-user-role")
    expect(audits).toContain("system.permission.assign-role-menu")
    expect(audits).toContain("system.tenant.update-status")
    expect(audits).toContain("system.tenant.assign-package")
    expect(audits).toContain("system.dict.create")
    expect(audits).toContain("system.notice.create")
    expect(audits).toContain("system.notify-template.create")
    expect(audits).toContain("system.notify-message.create")
    expect(audits).toContain("system.sms.channel.create")
    expect(audits).toContain("system.mail.account.create")
    expect(audits).toContain("system.social.user.create")
    expect(audits).toContain("system.auth.login.success")
    expect(audits).toContain("system.oauth2.open.token.issue")
    expect(audits).toContain("system.captcha.verify.success")
  })
})
