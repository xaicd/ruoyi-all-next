/**
 * 全量修复旧 route 为新规范格式
 *
 * 旧格式（一个 route.ts 里用 ?id= 做详情查询）：
 *   GET  ?id=xxx → get(id)
 *   GET  → page(input)
 *   POST → create(body)
 *   PUT  → update(body)
 *   DELETE ?id=xxx → delete(id)
 *
 * 新规范：
 *   resource/route.ts     → GET(列表) + POST(创建)
 *   resource/[id]/route.ts → GET(详情) + PUT(更新) + DELETE(删除) + PATCH(部分更新)
 *
 * 用法: node scripts/fix-routes-to-standard.cjs
 */

const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const API_DIR = path.join(ROOT, "src", "app", "api", "v1", "admin")

// 已手动整改的目录（跳过）
const SKIP_DIRS = new Set([
  "system/auth",
  "system/users",
  "system/roles",
  "system/depts",
  "system/menus",
  "system/posts",
  "system/dicts",
  "system/tenants",
  "system/tenant-packages",
  "infra/codegen",
  "infra/configs",
  "infra/files",
  "infra/jobs",
  "pay/orders",
  "pay/refunds",
  "crm/customers",
])

// Service 名称映射（目录名 → Service 类名 + import 路径）
function inferServiceInfo(domain, dirName) {
  // 特殊映射
  const specialMap = {
    "system/online-users": { cls: "SystemOnlineUserService", path: "@/modules/system/backend/services/online-user.service" },
    "system/login-logs": { cls: "LoginLogService", path: "@/modules/system/backend/services/login-log.service" },
    "system/operate-logs": { cls: "OperateLogService", path: "@/modules/system/backend/services/operate-log.service" },
    "system/notices": { cls: "NoticeService", path: "@/modules/system/backend/services/notice.service" },
    "system/permissions": { cls: "PermissionService", path: "@/modules/system/backend/services/permission.service" },
    "system/oauth2client": { cls: "OAuth2ClientService", path: "@/modules/system/backend/services/oauth2client.service" },
    "system/oauth2token": { cls: "OAuth2TokenService", path: "@/modules/system/backend/services/oauth2token.service" },
    "system/oauth2user": { cls: "OAuth2TokenService", path: "@/modules/system/backend/services/oauth2token.service" },
    "system/oauth2open": { cls: "OAuth2ClientService", path: "@/modules/system/backend/services/oauth2client.service" },
    "system/oauth2-clients": { cls: "OAuth2ClientService", path: "@/modules/system/backend/services/oauth2client.service" },
    "system/oauth2-tokens": { cls: "OAuth2TokenService", path: "@/modules/system/backend/services/oauth2token.service" },
    "system/social-client": { cls: "SocialClientService", path: "@/modules/system/backend/services/social-client.service" },
    "system/social-user": { cls: "SocialUserService", path: "@/modules/system/backend/services/social-user.service" },
    "system/social-users": { cls: "SocialUserService", path: "@/modules/system/backend/services/social-user.service" },
    "system/sms-channel": { cls: "SmsChannelService", path: "@/modules/system/backend/services/sms-channel.service" },
    "system/sms-channels": { cls: "SmsChannelService", path: "@/modules/system/backend/services/sms-channel.service" },
    "system/sms-log": { cls: "SmsLogService", path: "@/modules/system/backend/services/sms-log.service" },
    "system/sms-logs": { cls: "SmsLogService", path: "@/modules/system/backend/services/sms-log.service" },
    "system/sms-template": { cls: "SmsTemplateService", path: "@/modules/system/backend/services/sms-template.service" },
    "system/sms-callback": { cls: "SmsLogService", path: "@/modules/system/backend/services/sms-log.service" },
    "system/mail-account": { cls: "MailAccountService", path: "@/modules/system/backend/services/mail-account.service" },
    "system/mail-accounts": { cls: "MailAccountService", path: "@/modules/system/backend/services/mail-account.service" },
    "system/mail-log": { cls: "MailLogService", path: "@/modules/system/backend/services/mail-log.service" },
    "system/mail-logs": { cls: "MailLogService", path: "@/modules/system/backend/services/mail-log.service" },
    "system/mail-template": { cls: "MailTemplateService", path: "@/modules/system/backend/services/mail-template.service" },
    "system/notify-templates": { cls: "NotifyTemplateService", path: "@/modules/system/backend/services/notify-template.service" },
    "system/notify-messages": { cls: "NotifyMessageService", path: "@/modules/system/backend/services/notify-message.service" },
    "system/user-profile": { cls: "UserProfileService", path: "@/modules/system/backend/services/user-profile.service" },
    "system/area": { cls: "AreaService", path: "@/modules/system/backend/services/area.service" },
    "system/ip": { cls: "IpAreaService", path: "@/modules/system/backend/services/ip-area.service" },
    "system/ip-areas": { cls: "IpAreaService", path: "@/modules/system/backend/services/ip-area.service" },
    "system/dict-data": { cls: "SystemDictService", path: "@/modules/system/backend/services/dict.service" },
    "system/dict-type": { cls: "SystemDictService", path: "@/modules/system/backend/services/dict.service" },
    "system/social": { cls: "SocialClientService", path: "@/modules/system/backend/services/social-client.service" },
    "system/sms": { cls: "SmsChannelService", path: "@/modules/system/backend/services/sms-channel.service" },
    "system/mail": { cls: "MailAccountService", path: "@/modules/system/backend/services/mail-account.service" },
    "system/notify": { cls: "NotifyTemplateService", path: "@/modules/system/backend/services/notify-template.service" },
    "system/oauth2": { cls: "OAuth2ClientService", path: "@/modules/system/backend/services/oauth2client.service" },
    "infra/api-access-log": { cls: "ApiAccessLogService", path: "@/modules/infra/backend/services/api-access-log.service" },
    "infra/api-error-logs": { cls: "ApiErrorLogService", path: "@/modules/infra/backend/services/api-error-log.service" },
    "infra/api-logs": { cls: "ApiAccessLogService", path: "@/modules/infra/backend/services/api-access-log.service" },
    "infra/db-configs": { cls: "DbConfigService", path: "@/modules/infra/backend/services/db-config.service" },
    "infra/redis": { cls: "RedisService", path: "@/modules/infra/backend/services/redis.service" },
    "infra/data-source-config": { cls: "DbConfigService", path: "@/modules/infra/backend/services/db-config.service" },
    "infra/file-configs": { cls: "DbConfigService", path: "@/modules/infra/backend/services/db-config.service" },
    "infra/job": { cls: "InfraJobService", path: "@/modules/infra/backend/services/job.service" },
    "infra/job-center": { cls: "InfraJobService", path: "@/modules/infra/backend/services/job.service" },
    "infra/job-logs": { cls: "ApiAccessLogService", path: "@/modules/infra/backend/services/api-access-log.service" },
    "infra/swagger": { cls: "DbConfigService", path: "@/modules/infra/backend/services/db-config.service" },
  }

  const key = `${domain}/${dirName}`
  if (specialMap[key]) return specialMap[key]

  // 通用推导
  const camelName = dirName.split("-").map((s, i) => i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1)).join("")
  return {
    cls: `${camelName}Service`,
    path: `@/modules/${domain}/backend/services/${dirName}.service`,
  }
}

function generateRouteContent(serviceCls, servicePath) {
  return `import { NextResponse } from "next/server"
import { ${serviceCls} } from "${servicePath}"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const input = {
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 20),
      keyword: searchParams.get("keyword") || undefined,
    }
    const data = await ${serviceCls}.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ${serviceCls}.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}
`
}

function generateIdRouteContent(serviceCls, servicePath) {
  return `import { NextResponse } from "next/server"
import { ${serviceCls} } from "${servicePath}"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const data = await ${serviceCls}.get(id)
    if (!data) return NextResponse.json({ success: false, error: "不存在" }, { status: 404 })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const data = await ${serviceCls}.update({ ...body, id })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const data = await ${serviceCls}.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
`
}

function processDir(domainDir, domain) {
  const entries = fs.readdirSync(domainDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const dirName = entry.name
    const key = `${domain}/${dirName}`

    // 跳过已手动整改的
    if (SKIP_DIRS.has(key)) continue
    // 跳过 [id] 目录
    if (dirName.startsWith("[")) continue

    const routeFile = path.join(domainDir, dirName, "route.ts")
    if (!fs.existsSync(routeFile)) continue

    // 读取 route 内容检查是否为旧格式
    const content = fs.readFileSync(routeFile, "utf-8")
    if (content.includes("context: RouteContext") || content.includes("await context.params")) {
      // 已经是新格式的 [id] route
      continue
    }

    const serviceInfo = inferServiceInfo(domain, dirName)

    // 重写 route.ts
    const newContent = generateRouteContent(serviceInfo.cls, serviceInfo.path)
    fs.writeFileSync(routeFile, newContent)
    console.log(`[FIXED] ${key}/route.ts → ${serviceInfo.cls}`)

    // 创建 [id]/route.ts
    const idDir = path.join(domainDir, dirName, "[id]")
    if (!fs.existsSync(idDir)) {
      fs.mkdirSync(idDir, { recursive: true })
    }
    const idRouteFile = path.join(idDir, "route.ts")
    if (!fs.existsSync(idRouteFile)) {
      fs.writeFileSync(idRouteFile, generateIdRouteContent(serviceInfo.cls, serviceInfo.path))
      console.log(`[CREATED] ${key}/[id]/route.ts`)
    }
  }
}

// === Main ===
function main() {
  const domains = ["system", "infra", "pay", "mall", "crm", "erp", "bpm", "wms", "mes", "ai", "iot", "im", "mp", "member", "report"]

  for (const domain of domains) {
    const domainDir = path.join(API_DIR, domain)
    if (!fs.existsSync(domainDir)) continue
    console.log(`\n=== Processing ${domain} ===`)
    processDir(domainDir, domain)
  }

  console.log("\n✅ 全量 route 修复完成")
}

main()
