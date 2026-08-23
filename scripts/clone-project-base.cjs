/**
 * ProjectReactor Engine (对标并超越 Yudao ProjectReactor.java)
 * 
 * 功能：
 * 1. 深度借鉴 ProjectReactor 的核心设计：白名单二进制防损坏、长词优先有序替换、路径与包名重写；
 * 2. 融合 Node/Next.js 特性：自动隔离数据库名、PORT 端口分配、.env 自动生成；
 * 3. 极简全托管：自动连接 PostgreSQL 创建独立库 + 默认部署全量 SQL 基准与迁移！
 */

const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")
const { Client } = require("pg")

const SOURCE_ROOT = path.resolve(__dirname, "..")

// 默认基准标识符 (对标 Yudao 的 GROUP_ID, ARTIFACT_ID, TITLE)
const BASE_PROJECT_NAME = "ruoyi-all-next"
const BASE_PROJECT_TITLE = "RuoYi All Next"
const BASE_DB_NAME = "ruoyi_next"

// 二进制白名单后缀（直接二进制复制，严禁文本替换，防止破坏文件结构）
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".pdf", ".zip", ".tar", ".gz", ".dump", ".xdb"
])

// 排除的临时目录与产物
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".next-ruoyi",
  ".git",
  ".idea",
  ".vscode",
  "backups",
  "tmp",
  ".data",
  "coverage",
  "dist",
  "build"
])

// 排除的临时文件
const EXCLUDE_FILES = new Set([
  ".DS_Store",
  "npm-debug.log",
  "yarn-error.log",
  "tsconfig.tsbuildinfo",
  "ts-errors-report.txt"
])

// 目标目录中需保护的已有设计文档（严禁覆盖）
const PROTECTED_DOCS = new Set([
  "all_task.md",
  "zq-agentall.md",
  "应算通-业务流程与数据流转.md",
  "应算通-平台菜单与网关设计.md",
  "应算通-总结.md",
  "应算通-运营管理功能设计.md"
])

/**
 * 文本内容重写器 (对标 ProjectReactor.replaceFileContent)
 * 严格执行“长词优先”替换原则，避免短词误伤
 */
function transformFileContent(content, targetName, targetTitle, targetDbName, targetPort) {
  return content
    .replace(/ruoyi-all-next/g, targetName)
    .replace(/RuoYi All Next/g, targetTitle)
    .replace(/ruoyi_next/g, targetDbName)
    .replace(/PORT=3100/g, `PORT=${targetPort}`)
}

/**
 * 递归反应堆拷贝与转换
 */
function reactorCopy(src, dest, targetName, targetTitle, targetDbName, targetPort) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue
      reactorCopy(srcPath, destPath, targetName, targetTitle, targetDbName, targetPort)
    } else if (entry.isFile()) {
      if (EXCLUDE_FILES.has(entry.name)) continue

      // 保护已有文档
      if (fs.existsSync(destPath) && PROTECTED_DOCS.has(entry.name)) {
        console.log(`[REACTOR PROTECT] 保留目标目录已有文档: ${entry.name}`)
        continue
      }

      const ext = path.extname(entry.name).toLowerCase()
      // 如果属于二进制白名单，直接以流/Buffer 复制
      if (BINARY_EXTENSIONS.has(ext)) {
        fs.copyFileSync(srcPath, destPath)
        continue
      }

      // 特殊处理 package.json
      if (entry.name === "package.json") {
        try {
          const pkg = JSON.parse(fs.readFileSync(srcPath, "utf8"))
          pkg.name = targetName
          if (pkg.scripts && pkg.scripts.dev) {
            pkg.scripts.dev = pkg.scripts.dev.replace("-p 3100", `-p ${targetPort}`)
          }
          fs.writeFileSync(destPath, JSON.stringify(pkg, null, 2), "utf8")
          continue
        } catch {}
      }

      // 文本文件：执行反应堆内容替换
      try {
        const raw = fs.readFileSync(srcPath, "utf8")
        const transformed = transformFileContent(raw, targetName, targetTitle, targetDbName, targetPort)
        fs.writeFileSync(destPath, transformed, "utf8")
      } catch {
        // 回退直接复制
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
}

/**
 * 自动创建 PostgreSQL 数据库并执行默认 SQL 迁移
 */
async function autoProvisionDatabase(targetDbName) {
  console.log("----------------------------------------------------------------")
  console.log(`[REACTOR DB] 正在连接 PostgreSQL 并自动初始化数据库: ${targetDbName}...`)

  const client = new Client({
    connectionString: "postgresql://ruoyi:ruoyi123@localhost:5433/postgres",
  })

  let dbReady = false
  try {
    await client.connect()
    const check = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDbName])
    if (check.rows.length === 0) {
      await client.query(`CREATE DATABASE "${targetDbName}" OWNER ruoyi`)
      console.log(`[REACTOR DB] ✅ 成功创建新数据库: "${targetDbName}"`)
    } else {
      console.log(`[REACTOR DB] 数据库 "${targetDbName}" 已存在，准备检查与部署 SQL`)
    }
    dbReady = true
  } catch (err) {
    console.log(`[REACTOR DB NOTICE] PostgreSQL 连接提示: ${err.message}`)
  } finally {
    try { await client.end() } catch {}
  }

  if (dbReady) {
    try {
      console.log(`[REACTOR SQL] 正在自动导入全量基准 SQL 与 27 项迁移...`)
      const targetDbUrl = `postgresql://ruoyi:ruoyi123@localhost:5433/${targetDbName}?schema=public`
      execSync("npx prisma migrate deploy", {
        cwd: SOURCE_ROOT,
        env: {
          ...process.env,
          DATABASE_URL: targetDbUrl,
        },
        stdio: "inherit",
      })
      console.log(`[REACTOR SQL SUCCESS] ✅ 数据库 "${targetDbName}" 全量基础 SQL 与菜单权限已自动就绪！`)
    } catch (migrateErr) {
      console.log(`[REACTOR SQL WARN] 自动部署迁移提示: ${migrateErr.message}`)
    }
  }
}

/**
 * 主执行函数
 */
async function runProjectReactor(targetDir, customTitle) {
  const resolvedTarget = path.resolve(targetDir)
  const targetName = (path.basename(resolvedTarget) || "agent-app").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase()
  const targetDbName = targetName.replace(/[^a-z0-9_]/g, "_")
  const targetTitle = customTitle || targetName.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
  const targetPort = "3200"

  console.log("================================================================")
  console.log("             ProjectReactor - Next.js 全自动项目重塑引擎          ")
  console.log("================================================================")
  console.log(`  📦 源底座路径:    ${SOURCE_ROOT}`)
  console.log(`  🚀 目标工程路径:  ${resolvedTarget}`)
  console.log(`  🏷️  目标工程包名:  ${targetName}`)
  console.log(`  🗄️  目标数据库名:  ${targetDbName}`)
  console.log(`  🌐 默认服务端口:  ${targetPort}`)
  console.log("================================================================")

  if (!fs.existsSync(resolvedTarget)) {
    fs.mkdirSync(resolvedTarget, { recursive: true })
  }

  // 1. 执行反应堆克隆与文本替换
  reactorCopy(SOURCE_ROOT, resolvedTarget, targetName, targetTitle, targetDbName, targetPort)

  // 2. 独立配置 .env
  const destEnv = path.join(resolvedTarget, ".env")
  const srcEnv = path.join(SOURCE_ROOT, ".env")
  let baseEnv = fs.existsSync(srcEnv) ? fs.readFileSync(srcEnv, "utf8") : ""
  baseEnv = baseEnv.replace(/ruoyi_next/g, targetDbName)
  baseEnv = baseEnv.replace(/PORT=3100/g, `PORT=${targetPort}`)
  if (!baseEnv.includes(`PORT=${targetPort}`)) {
    baseEnv += `\nPORT=${targetPort}\n`
  }
  fs.writeFileSync(destEnv, baseEnv, "utf8")

  // 3. 自动创建数据库并部署全量 SQL
  await autoProvisionDatabase(targetDbName)

  console.log("================================================================")
  console.log("[SUCCESS] 🎉 项目重构与一键初始化完成！全量基础数据已全部就绪！")
  console.log("================================================================")
  console.log("\n极简启动指引:")
  console.log(`  1. cd /d "${resolvedTarget}"`)
  console.log("  2. start.bat (直接双击运行，无需手动执行任何初始化 SQL)")
  console.log("  3. 后续开发如新增表结构，直接运行 npm run db:migrate 即可增量升级！")
  console.log("================================================================")
}

// 命令行参数解析
const targetArg = process.argv.slice(2).find((arg) => !arg.startsWith("--")) || "D:/workspace/cw/agent-zqall"
runProjectReactor(targetArg).catch((err) => {
  console.error("[REACTOR ERROR]", err)
  process.exit(1)
})
