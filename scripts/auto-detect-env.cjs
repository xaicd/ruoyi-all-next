const fs = require("node:fs")
const path = require("node:path")

function autoDetectAndSyncEnv() {
  const rootDir = process.cwd()
  const dirName = path.basename(rootDir)
  
  // 从目录名推导数据库名 (如 agent-zqall -> agent_zqall, ruoyi-all-next -> ruoyi_next)
  let derivedDbName = dirName.toLowerCase().replace(/[^a-z0-9_]/g, "_")
  if (derivedDbName === "ruoyi_all_next") {
    derivedDbName = "ruoyi_next" // 兼容 ruoyi 默认库名
  }

  const envPath = path.join(rootDir, ".env")
  const envExamplePath = path.join(rootDir, ".env.example")
  const pkgPath = path.join(rootDir, "package.json")

  let envContent = ""
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8")
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, "utf8")
  } else {
    envContent = `DATABASE_URL="postgresql://postgres:postgres@localhost:5433/${derivedDbName}?schema=public"\nPORT=3100\n`
  }

  // 1. 如果没有 DATABASE_URL，注入推导出的数据库名
  if (!envContent.includes("DATABASE_URL=")) {
    envContent += `\nDATABASE_URL="postgresql://postgres:postgres@localhost:5433/${derivedDbName}?schema=public"\n`
  }

  // 2. 解析当前配置的数据库名
  const dbMatch = envContent.match(/DATABASE_URL=["']?postgresql:\/\/[^/]+\/([^?#"']+)/)
  const currentDb = dbMatch ? dbMatch[1] : derivedDbName

  // 3. 读取当前端口
  const portMatch = envContent.match(/^PORT=(\d+)/m)
  let currentPort = portMatch ? portMatch[1] : "3100"

  // 4. 同步 package.json 中的工程名
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
      if (pkg.name !== dirName && dirName !== "ruoyi-all-next") {
        pkg.name = dirName
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8")
      }
    } catch {}
  }

  // 写回 .env
  fs.writeFileSync(envPath, envContent, "utf8")

  console.log("----------------------------------------------------------------")
  console.log(`  📁 工程目录:  ${dirName}`)
  console.log(`  🗄️  数据库名:  ${currentDb} (自动匹配隔离)`)
  console.log(`  🌐 服务端口:  ${currentPort} (http://localhost:${currentPort})`)
  console.log("----------------------------------------------------------------")
}

autoDetectAndSyncEnv()
