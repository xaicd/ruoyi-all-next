/**
 * 代码生成器：从源仓库（ruoyi-vue-pro + yudao-ui-admin-vue3）扫描 Controller/Views
 * 自动生成 ruoyi-all-next 的模块骨架：
 *   - Service (CRUD + Mock data)
 *   - Validator (Zod schema)
 *   - API Route (Next.js route.ts)
 *   - Page (React page component)
 *   - App route entry (page.tsx re-export)
 *
 * 用法: npx tsx scripts/codegen-from-source.ts [--domain system] [--dry-run]
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

// ============ Config ============

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, "..")
const SOURCE_BACKEND = path.resolve(ROOT, "../ruoyi-vue-pro")
const SOURCE_FRONTEND = path.resolve(ROOT, "../yudao-ui-admin-vue3")
const TARGET_MODULES = path.resolve(ROOT, "src/modules")
const TARGET_APP_API = path.resolve(ROOT, "src/app/api/admin")
const TARGET_APP_PAGES = path.resolve(ROOT, "src/app/(admin)/admin")

const DOMAINS = [
  "system", "infra", "bpm", "pay", "report", "mp",
  "mall", "member", "crm", "erp", "wms", "mes", "ai", "iot", "im",
]

// ============ Scanner ============

interface ControllerInfo {
  domain: string
  name: string           // e.g. "UserController"
  entityName: string     // e.g. "User"
  apiPrefix: string      // e.g. "/system/user"
  methods: MethodInfo[]
  filePath: string
}

interface MethodInfo {
  httpMethod: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  operationName: string
  summary: string
  permission?: string
}

interface ViewInfo {
  domain: string
  subModule: string      // e.g. "user", "role"
  files: string[]
  hasForm: boolean
  hasDetail: boolean
  hasIndex: boolean
}

function scanControllers(domain: string): ControllerInfo[] {
  const modulePath = path.join(SOURCE_BACKEND, `yudao-module-${domain}`)
  if (!fs.existsSync(modulePath)) return []

  const controllers: ControllerInfo[] = []

  // Find all Controller.java files recursively
  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else if (entry.name.endsWith("Controller.java") && !fullPath.includes("\\app\\")) {
        const content = fs.readFileSync(fullPath, "utf-8")
        const info = parseController(domain, content, fullPath)
        if (info) controllers.push(info)
      }
    }
  }

  walkDir(modulePath)
  return controllers
}

function parseController(domain: string, content: string, filePath: string): ControllerInfo | null {
  // Extract class name
  const classMatch = content.match(/public class (\w+Controller)/)
  if (!classMatch) return null

  const name = classMatch[1]
  const entityName = name.replace("Controller", "")

  // Extract RequestMapping prefix
  const mappingMatch = content.match(/@RequestMapping\("([^"]+)"\)/)
  const apiPrefix = mappingMatch ? mappingMatch[1] : `/${domain}/${entityName.toLowerCase()}`

  // Extract methods
  const methods: MethodInfo[] = []

  const methodRegex = /@(GetMapping|PostMapping|PutMapping|DeleteMapping)\((?:"([^"]*)"|\{[^}]*\}|[^)]*)\)[^}]*?@Operation\(summary\s*=\s*"([^"]+)"\).*?(?:@PreAuthorize\("@ss\.hasPermission\('([^']+)'\)"\))?.*?public\s+\S+\s+(\w+)\(/gs
  let match: RegExpExecArray | null
  while ((match = methodRegex.exec(content)) !== null) {
    const httpMapping = match[1]
    const methodPath = match[2] || ""
    const summary = match[3]
    const permission = match[4]
    const operationName = match[5]

    const httpMethodMap: Record<string, "GET" | "POST" | "PUT" | "DELETE"> = {
      GetMapping: "GET",
      PostMapping: "POST",
      PutMapping: "PUT",
      DeleteMapping: "DELETE",
    }

    methods.push({
      httpMethod: httpMethodMap[httpMapping] || "GET",
      path: methodPath,
      operationName,
      summary,
      permission,
    })
  }

  // Fallback: simpler regex for methods without @Operation
  if (methods.length === 0) {
    const simpleRegex = /@(GetMapping|PostMapping|PutMapping|DeleteMapping)\((?:[^)]*)\)[\s\S]*?public\s+\S+(?:<[^>]+>)?\s+(\w+)\(/g
    while ((match = simpleRegex.exec(content)) !== null) {
      const httpMapping = match[1]
      const operationName = match[2]
      const httpMethodMap: Record<string, "GET" | "POST" | "PUT" | "DELETE"> = {
        GetMapping: "GET", PostMapping: "POST", PutMapping: "PUT", DeleteMapping: "DELETE",
      }
      methods.push({
        httpMethod: httpMethodMap[httpMapping] || "GET",
        path: "",
        operationName,
        summary: operationName,
      })
    }
  }

  return { domain, name, entityName, apiPrefix, methods, filePath }
}

function scanViews(domain: string): ViewInfo[] {
  const viewsPath = path.join(SOURCE_FRONTEND, "src/views", domain)
  if (!fs.existsSync(viewsPath)) return []

  const views: ViewInfo[] = []
  const entries = fs.readdirSync(viewsPath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const subDir = path.join(viewsPath, entry.name)
    const files = collectFiles(subDir)

    views.push({
      domain,
      subModule: entry.name,
      files,
      hasForm: files.some((f) => f.toLowerCase().includes("form")),
      hasDetail: files.some((f) => f.toLowerCase().includes("detail")),
      hasIndex: files.some((f) => f.includes("index.vue")),
    })
  }

  return views
}

function collectFiles(dir: string): string[] {
  const results: string[] = []
  function walk(d: string) {
    const entries = fs.readdirSync(d, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(d, entry.name)
      if (entry.isDirectory()) walk(full)
      else results.push(entry.name)
    }
  }
  walk(dir)
  return results
}

// ============ Code Generator ============

function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function toPascal(str: string): string {
  return str.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())
}

function toCamel(str: string): string {
  const p = toPascal(str)
  return p[0].toLowerCase() + p.slice(1)
}

function generateModuleFiles(controller: ControllerInfo, view: ViewInfo | undefined, isDryRun: boolean) {
  const domain = controller.domain
  const entity = controller.entityName
  const kebab = toKebab(entity)
  const pascal = toPascal(kebab)
  const camel = toCamel(kebab)

  // Paths
  const serviceDir = path.join(TARGET_MODULES, domain, "backend/services")
  const validatorDir = path.join(TARGET_MODULES, domain, "backend/validators")
  const pageDir = path.join(TARGET_MODULES, domain, "frontend/pages")
  const routeDir = path.join(TARGET_APP_API, domain, kebab)
  const appPageDir = path.join(TARGET_APP_PAGES, domain, kebab)

  // Skip if service already exists
  const serviceFile = path.join(serviceDir, `${kebab}.service.ts`)
  if (fs.existsSync(serviceFile)) {
    return { skipped: true, entity: kebab }
  }

  // --- Generate Service ---
  const hasCreate = controller.methods.some((m) => m.httpMethod === "POST" && (m.operationName.includes("create") || m.operationName.includes("Create")))
  const hasUpdate = controller.methods.some((m) => m.httpMethod === "PUT" && (m.operationName.includes("update") || m.operationName.includes("Update")))
  const hasDelete = controller.methods.some((m) => m.httpMethod === "DELETE")
  const hasPage = controller.methods.some((m) => m.operationName.includes("page") || m.operationName.includes("Page") || m.operationName.includes("list") || m.operationName.includes("List"))
  const hasGet = controller.methods.some((m) => m.operationName.includes("get") || m.operationName.includes("Get"))
  const hasExport = controller.methods.some((m) => m.operationName.includes("export") || m.operationName.includes("Export"))

  const serviceContent = `import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ${pascal}Item = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ${pascal}CreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ${pascal}UpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ${pascal}PageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ${pascal}Item[] = [
  { id: "${kebab}-001", name: "${pascal} 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "${kebab}-002", name: "${pascal} 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ${pascal}Service {
${hasPage ? `  /** 分页查询 */
  static async page(input: ${pascal}PageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("${domain}.${camel}.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
` : ""}${hasGet ? `  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("${pascal}不存在")
    domainLog.event("${domain}.${camel}.get", { id })
    return item
  }
` : ""}${hasCreate ? `  /** 创建 */
  static async create(input: ${pascal}CreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = \`${kebab}-\${++nextId}\`
    const item: ${pascal}Item = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("${domain}.${camel}.create", { id })
    domainLog.audit("${domain}.${camel}.create", { targetType: "${domain.toUpperCase()}_${entity.toUpperCase()}", targetId: id })
    return { id }
  }
` : ""}${hasUpdate ? `  /** 更新 */
  static async update(input: ${pascal}UpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("${pascal}不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("${domain}.${camel}.update", { id: input.id })
    domainLog.audit("${domain}.${camel}.update", { targetType: "${domain.toUpperCase()}_${entity.toUpperCase()}", targetId: input.id })
    return true
  }
` : ""}${hasDelete ? `  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("${pascal}不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("${domain}.${camel}.delete", { id })
    domainLog.audit("${domain}.${camel}.delete", { targetType: "${domain.toUpperCase()}_${entity.toUpperCase()}", targetId: id })
    return true
  }
` : ""}}
`

  // --- Generate Route ---
  const routeContent = `import { NextResponse } from "next/server"
import { ${pascal}Service } from "@/modules/${domain}/backend/services/${kebab}.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (id) {
      const data = await ${pascal}Service.get(id)
      return NextResponse.json({ success: true, data })
    }
    const input = {
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 20),
      keyword: searchParams.get("keyword") || undefined,
    }
    const data = await ${pascal}Service.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ${pascal}Service.create(body)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = await ${pascal}Service.update(body)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "更新失败" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "id 不能为空" }, { status: 400 })
    const data = await ${pascal}Service.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "删除失败" }, { status: 400 })
  }
}
`

  // --- Generate Page ---
  const pageContent = `"use client"

import { AdminListPageTemplate } from "@/modules/shared/frontend/templates/admin-list-page.template"

export default function ${pascal}Page() {
  return <AdminListPageTemplate title="${pascal}管理" endpoint="/api/admin/${domain}/${kebab}" />
}
`

  // --- Generate App Page Entry ---
  const appPageContent = `import ${pascal}Page from "@/modules/${domain}/frontend/pages/${kebab}.page"

export default ${pascal}Page
`

  if (isDryRun) {
    console.log(`    [DRY] Would create: ${serviceFile}`)
    return { skipped: false, entity: kebab, dryRun: true }
  }

  // Write files
  fs.mkdirSync(serviceDir, { recursive: true })
  fs.writeFileSync(serviceFile, serviceContent)

  fs.mkdirSync(routeDir, { recursive: true })
  fs.writeFileSync(path.join(routeDir, "route.ts"), routeContent)

  fs.mkdirSync(pageDir, { recursive: true })
  fs.writeFileSync(path.join(pageDir, `${kebab}.page.tsx`), pageContent)

  fs.mkdirSync(appPageDir, { recursive: true })
  fs.writeFileSync(path.join(appPageDir, "page.tsx"), appPageContent)

  return { skipped: false, entity: kebab }
}

function generateDomain(domain: string, isDryRun: boolean) {
  const controllers = scanControllers(domain)
  const views = scanViews(domain)

  let generated = 0
  let skipped = 0

  for (const controller of controllers) {
    // Match view by entity name
    const entityKebab = toKebab(controller.entityName)
    const view = views.find((v) => v.subModule === entityKebab || v.subModule === controller.entityName.toLowerCase())

    const result = generateModuleFiles(controller, view, isDryRun)
    if (result.skipped) skipped++
    else generated++
  }

  return { generated, skipped, total: controllers.length }
}

// ============ Report Generator ============

function generateDomainReport(domain: string) {
  const controllers = scanControllers(domain)
  const views = scanViews(domain)

  return {
    domain,
    controllers: controllers.map((c) => ({
      name: c.name,
      entityName: c.entityName,
      apiPrefix: c.apiPrefix,
      methodCount: c.methods.length,
      methods: c.methods.map((m) => `${m.httpMethod} ${m.path || "/"} - ${m.summary}`),
    })),
    views: views.map((v) => ({
      subModule: v.subModule,
      fileCount: v.files.length,
      hasForm: v.hasForm,
      hasDetail: v.hasDetail,
    })),
    summary: {
      controllerCount: controllers.length,
      totalMethods: controllers.reduce((sum, c) => sum + c.methods.length, 0),
      viewCount: views.length,
      totalViewFiles: views.reduce((sum, v) => sum + v.files.length, 0),
    },
  }
}

// ============ Main ============

function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes("--dry-run")
  const shouldGenerate = args.includes("--generate")
  const domainArg = args.find((a) => !a.startsWith("--"))

  const targetDomains = domainArg ? [domainArg] : DOMAINS

  if (shouldGenerate) {
    console.log("=== ruoyi-all-next 代码生成 ===\n")
    console.log(isDryRun ? "(DRY RUN 模式，不会写入文件)\n" : "")

    let totalGenerated = 0
    let totalSkipped = 0

    for (const domain of targetDomains) {
      const result = generateDomain(domain, isDryRun)
      console.log(`  ${domain}: generated=${result.generated}, skipped=${result.skipped}, total=${result.total}`)
      totalGenerated += result.generated
      totalSkipped += result.skipped
    }

    console.log(`\n=== 生成完毕 ===`)
    console.log(`  新生成: ${totalGenerated}`)
    console.log(`  已跳过(已存在): ${totalSkipped}`)
    return
  }

  console.log("=== ruoyi-all-next 源仓库能力扫描 ===\n")

  const report: Record<string, any> = {}

  for (const domain of targetDomains) {
    const domainReport = generateDomainReport(domain)
    report[domain] = domainReport

    console.log(`\n## ${domain}`)
    console.log(`  Controllers: ${domainReport.summary.controllerCount}`)
    console.log(`  Total API methods: ${domainReport.summary.totalMethods}`)
    console.log(`  View sub-modules: ${domainReport.summary.viewCount}`)
    console.log(`  Total view files: ${domainReport.summary.totalViewFiles}`)

    if (domainReport.controllers.length > 0) {
      console.log(`  Controllers:`)
      for (const c of domainReport.controllers) {
        console.log(`    - ${c.name} (${c.methodCount} methods) ${c.apiPrefix}`)
      }
    }

    if (domainReport.views.length > 0) {
      console.log(`  Views:`)
      for (const v of domainReport.views) {
        const flags = [v.hasForm ? "Form" : "", v.hasDetail ? "Detail" : ""].filter(Boolean).join("+")
        console.log(`    - ${v.subModule} (${v.fileCount} files) ${flags ? `[${flags}]` : ""}`)
      }
    }
  }

  // Write report
  const outPath = path.join(ROOT, "docs/architecture/artifacts/source-capability-scan.json")
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`\n\n✅ Report written to: ${outPath}`)

  // Summary
  const totalControllers = Object.values(report).reduce((s: number, r: any) => s + r.summary.controllerCount, 0)
  const totalMethods = Object.values(report).reduce((s: number, r: any) => s + r.summary.totalMethods, 0)
  const totalViews = Object.values(report).reduce((s: number, r: any) => s + r.summary.viewCount, 0)

  console.log(`\n=== 总计 ===`)
  console.log(`  域: ${targetDomains.length}`)
  console.log(`  Controllers: ${totalControllers}`)
  console.log(`  API methods: ${totalMethods}`)
  console.log(`  View modules: ${totalViews}`)
}

main()
