/**
 * 只重生成**测试**产物（codegen 的 `type: "test"`）。
 *
 * 为什么单独有这么一个工具：codegen 产物里的测试是**生成物**，
 * 模板一改它们就过时了。但 `scripts/scaffold-*.ts` 会把全部产物（service /
 * repository / page / validator …）一起重写 —— 那些文件可能已被人工改过，
 * 重跑脚手架等于把它们冲掉。所以测试需要一条**只碰测试**的窄路径。
 *
 * 典型场景：模板原先不填必填字段，生成的测试**只在内存模式下能过**
 * （内存回退不校验约束），连真实库就 `null value in column "..." violates
 * not-null constraint`。修好模板后，用本工具把已生成的测试补齐。
 *
 * 用法：
 *   tsx scripts/regenerate-domain-tests.ts --tables scripts/data/wms-tables.ts --export WMS_TABLES
 *   tsx scripts/regenerate-domain-tests.ts ... --write   # 默认 dry-run，只报告会改哪些文件
 */
import fs from "node:fs"
import path from "node:path"

import { generateTest } from "../packages/domains/infra/backend/services/codegen-templates/test.template"
import type { CodegenConfig } from "../packages/domains/infra/backend/services/codegen-templates"

const ROOT = path.resolve(__dirname, "..")

function main() {
  const argv = process.argv.slice(2)
  const arg = (flag: string, fallback?: string) => {
    const index = argv.indexOf(flag)
    return index >= 0 ? argv[index + 1] : fallback
  }
  const tablesModule = arg("--tables")
  const exportName = arg("--export", "default")
  const write = argv.includes("--write")
  if (!tablesModule) {
    console.error("用法: --tables <模块> [--export <导出名>] [--write]")
    process.exit(2)
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const loaded = require(path.resolve(ROOT, tablesModule)) as Record<string, CodegenConfig[]>
  const tables = loaded[exportName]
  if (!Array.isArray(tables) || tables.length === 0) {
    console.error(`[regen-tests] 导出 "${exportName}" 不是非空数组`)
    process.exit(2)
  }

  let changed = 0
  let same = 0
  for (const config of tables) {
    const output = generateTest(config)
    const full = path.resolve(ROOT, output.path)
    const current = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null
    if (current === output.content) {
      same++
      continue
    }
    changed++
    if (write) {
      fs.mkdirSync(path.dirname(full), { recursive: true })
      fs.writeFileSync(full, output.content)
    }
    console.log(`  ${current === null ? "新增" : "更新"} ${output.path}`)
  }
  console.log(
    `[regen-tests] ${tables.length} 张表: ${changed} 个需更新, ${same} 个已是最新${write ? "" : "（dry-run，加 --write 落盘）"}`,
  )
}

main()
