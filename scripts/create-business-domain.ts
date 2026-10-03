/**
 * 新建业务域 → 第一方插件（一条命令走完）。
 *
 * 这是 `new-business-plugin` 技能的可执行版本：把此前**已逐个实测**的步骤串起来，
 * 让"对话里说要做什么业务"到"插件跑起来"之间没有需要人记的手工步骤。
 *
 * 它做什么（每一步都幂等，可重复运行）:
 *   1. 校验表元数据（`scripts/data/<域>-tables.ts`）—— 表定义的**唯一真源**
 *   2. 生成建表迁移（`generate-table-migration.ts`）
 *   3. 按表跑 codegen，产出全栈代码（contract/backend/frontend/路由/迁移）
 *   4. 注册为第一方插件（`migrate-domain-to-plugin.cjs`，含新域自动登记）
 *   5. 重生成契约与清单（**顺序固定**: contracts -> seams -> manifests -> admin routes）
 *   6. 门禁自检（`npm run check`）
 *
 * 它**不做**（需要人或 CI 决定）:
 *   - 不写表元数据 —— 业务字段的类型/可空/默认值必须由人定（这是产品决策）
 *   - 不执行迁移到具体库（`prisma migrate deploy`）—— 目标库由部署决定
 *   - 不提交、不推送
 *
 * 用法:
 *   npx tsx scripts/create-business-domain.ts <域> [--export SHOP_TABLES] [--tables scripts/data/shop-tables.ts] [--dry-run]
 */
import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

import { CodegenEngineService } from "../packages/domains/infra/backend/services/codegen-engine.service"
import type { CodegenConfig } from "../packages/domains/infra/backend/services/codegen-templates"

const ROOT = path.resolve(__dirname, "..")
const argv = process.argv.slice(2)
const arg = (flag: string) => {
  const index = argv.indexOf(flag)
  return index >= 0 ? argv[index + 1] : undefined
}

const domain = argv.find((item) => !item.startsWith("--") && argv[argv.indexOf(item) - 1]?.startsWith("--") !== true)
const dryRun = argv.includes("--dry-run")

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

function step(n: number, message: string) {
  console.log(`\n[${n}/6] ${message}`)
}

function run(command: string, args: string[]) {
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit" })
}

function main() {
  if (!domain || domain.startsWith("--")) {
    fail("用法: npx tsx scripts/create-business-domain.ts <域> [--tables <元数据文件>] [--export <导出名>] [--dry-run]")
  }

  const tablesFile = arg("--tables") ?? `scripts/data/${domain}-tables.ts`
  const exportName = arg("--export") ?? `${domain.replace(/[^a-z0-9]/gi, "_").toUpperCase()}_TABLES`
  const tablesAbs = path.join(ROOT, tablesFile)

  step(1, `校验表元数据 ${tablesFile}`)
  if (!fs.existsSync(tablesAbs)) {
    fail(
      `表元数据不存在: ${tablesFile}\n` +
        `  本仓以**低代码元数据**为表定义唯一真源（AGENTS §9.5）。\n` +
        `  请先写这份文件: 导出 \`${exportName}: CodegenConfig[]\`，每列带 type/tsType/nullable/comment。\n` +
        `  元数据决定字段类型与约束，属**产品决策** —— 工具不代写。`,
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tables = (require(tablesAbs) as Record<string, CodegenConfig[]>)[exportName]
  if (!Array.isArray(tables) || tables.length === 0) fail(`${tablesFile} 未导出非空数组 \`${exportName}\``)
  console.log(`  ✓ ${tables.length} 张表`)

  if (dryRun) {
    console.log("\n(dry-run: 仅校验元数据，未执行后续步骤)")
    for (const config of tables) console.log(`  · ${config.table.name} -> ${config.className}`)
    return
  }

  step(2, "生成建表迁移")
  run("npx", ["tsx", "scripts/generate-table-migration.ts", "--tables", tablesFile, "--export", exportName, "--name", `add_${domain}_tables`, "--write"])

  step(3, "按表生成全栈代码")
  let written = 0
  for (const config of tables) {
    const outputs = CodegenEngineService.generateCodes(config, { includeClients: false })
    for (const output of outputs) {
      const full = path.resolve(ROOT, output.path)
      fs.mkdirSync(path.dirname(full), { recursive: true })
      fs.writeFileSync(full, output.content)
      written++
    }
    console.log(`  ✓ ${config.className} -> ${outputs.length} 个文件`)
  }
  console.log(`  合计 ${written} 个文件`)

  step(4, "注册为第一方插件")
  run("node", ["scripts/migrate-domain-to-plugin.cjs", domain, "--write"])

  step(5, "重生成契约与清单（顺序固定）")
  // contracts 会重写 module.manifest.json，必须跑在 manifests **之前** —— 反了会一直报漂移。
  run("pnpm", ["run", "domain:contracts"])
  run("pnpm", ["run", "domain:seams"])
  run("pnpm", ["run", "domain:manifests"])
  run("pnpm", ["run", "admin:routes:manifest"])

  step(6, "门禁自检")
  console.log("  下一步请手动执行（工具不替你决定部署与提交）:")
  console.log(`    pnpm install                 # 新插件进了工作区`)
  console.log(`    pnpm run check               # 门禁（含表定义覆盖）`)
  console.log(`    pnpm run build               # 编译`)
  console.log(`    pnpm run domain:pack ${domain}   # 打包`)
  console.log(`    npx prisma migrate deploy    # 建表到目标库（库由部署决定）`)
  console.log(`    pnpm run dev                 # 运行；首次需 POST /api/v1/admin/plugins 登记插件`)
  console.log(`\n✓ ${domain} 已生成并注册。接口面是插件挂载点 /api/v1/plugins/ruoyi.${domain}/api/**`)
}

main()
