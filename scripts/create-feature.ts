#!/usr/bin/env npx tsx
/**
 * 历史别名转发器 (Deprecated Shim -> scripts/spec-ops.ts)
 * 推荐直接使用: npx tsx scripts/spec-ops.ts new ... 或 npm run spec:new -- ...
 */
import { spawnSync } from "node:child_process"
import path from "node:path"

const args = process.argv.slice(2)
const result = spawnSync("npx", ["tsx", path.join(__dirname, "spec-ops.ts"), "new", ...args], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
})
process.exit(result.status ?? 0)
