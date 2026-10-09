#!/usr/bin/env node
/**
 * 历史别名转发器 (Deprecated Shim -> scripts/spec-ops.ts)
 * 推荐直接使用: npx tsx scripts/spec-ops.ts build ... 或 npm run spec:build -- ...
 */
const { spawnSync } = require("node:child_process")
const path = require("node:path")

const args = process.argv.slice(2)
const result = spawnSync("npx", ["tsx", path.join(__dirname, "spec-ops.ts"), "build", ...args], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
})
process.exit(result.status ?? 0)
