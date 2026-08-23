const fs = require("node:fs")
const path = require("node:path")

const SOURCE_ROOT = path.resolve(__dirname, "..")

// 忽略与排除清单
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".next-ruoyi",
  ".git",
  "backups",
  "tmp",
  ".data",
  "coverage",
])

const EXCLUDE_FILES = new Set([
  ".DS_Store",
  "npm-debug.log",
  "yarn-error.log",
])

// 保护目标目录下已存在的业务文档与目录
const PROTECTED_TARGET_FILES = new Set([
  "all_task.md",
  "zq-agentall.md",
  "应算通-业务流程与数据流转.md",
  "应算通-平台菜单与网关设计.md",
  "应算通-总结.md",
  "应算通-运营管理功能设计.md",
])

function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue
      copyDirectoryRecursive(srcPath, destPath)
    } else if (entry.isFile()) {
      if (EXCLUDE_FILES.has(entry.name)) continue

      // 保护目标目录已有的特有设计文档
      if (fs.existsSync(destPath) && PROTECTED_TARGET_FILES.has(entry.name)) {
        console.log(`[PRESERVE] Kept existing document: ${entry.name}`)
        continue
      }

      // 特殊处理 package.json: 将项目名替换为目标工程名
      if (entry.name === "package.json") {
        try {
          const pkg = JSON.parse(fs.readFileSync(srcPath, "utf8"))
          pkg.name = path.basename(dest) || "agent-zqall"
          fs.writeFileSync(destPath, JSON.stringify(pkg, null, 2), "utf8")
          console.log(`[CONFIG] Wrote customized package.json (name: "${pkg.name}")`)
          continue
        } catch {}
      }

      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function cloneProject(targetDir) {
  const resolvedTarget = path.resolve(targetDir)
  console.log("================================================================")
  console.log(`[CLONE] Source Base: ${SOURCE_ROOT}`)
  console.log(`[CLONE] Target Project: ${resolvedTarget}`)
  console.log("================================================================")

  if (!fs.existsSync(resolvedTarget)) {
    fs.mkdirSync(resolvedTarget, { recursive: true })
  }

  copyDirectoryRecursive(SOURCE_ROOT, resolvedTarget)

  // 如果目标工程不存在 .env，从 .env.example 复制一份
  const destEnv = path.join(resolvedTarget, ".env")
  const srcEnvExample = path.join(SOURCE_ROOT, ".env.example")
  const srcEnv = path.join(SOURCE_ROOT, ".env")
  if (!fs.existsSync(destEnv)) {
    if (fs.existsSync(srcEnv)) {
      fs.copyFileSync(srcEnv, destEnv)
      console.log("[ENV] Copied .env to target project.")
    } else if (fs.existsSync(srcEnvExample)) {
      fs.copyFileSync(srcEnvExample, destEnv)
      console.log("[ENV] Initialized .env from .env.example.")
    }
  }

  console.log("================================================================")
  console.log("[SUCCESS] Project successfully initialized into:", resolvedTarget)
  console.log("================================================================")
  console.log("\nNext Steps:")
  console.log(`  1. cd /d "${resolvedTarget}"`)
  console.log("  2. npm install")
  console.log("  3. start.bat (or ./start.sh)")
  console.log("================================================================")
}

const targetArg = process.argv.slice(2).find((arg) => !arg.startsWith("--")) || "D:/workspace/cw/agent-zqall"
cloneProject(targetArg)
