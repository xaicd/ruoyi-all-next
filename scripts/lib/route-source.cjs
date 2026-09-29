/**
 * 解析路由文件的「真实来源」。
 *
 * 背景：路由逻辑可以放在域内（`packages/domains/<domain>/routes/**`），
 * `src/app/.../route.ts` 只留一行 `export * from "@/modules/..."` 作为 Next.js 的挂载点。
 * 此时只看挂载点文件无法判定保护方式/解析方式，会把本该是 withAdminRoute 的操作
 * 降级成 proxy-authenticated —— 保护本身没变，但**可审计性变弱**。
 *
 * 所以凡是「读 route.ts 的内容再判定」的工具，都必须经过本函数跟随 re-export。
 * 这是工具层的一处共用能力，避免每个检查器各写一遍、各自踩坑。
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..", "..")

/**
 * 别名解析必须与 tsconfig 的 paths 保持一致。
 *
 * 各域与 shared 已迁到 packages/ 下（`@/modules/shared/* -> packages/shared/*`、
 * `@/modules/* -> packages/domains/*`），若这里仍按 `@/ -> src/` 解析，
 * 就会跟不到真实来源 —— 实测表现为"路由内容检查全部失败"。
 */
const ALIASES = [
  ["@/modules/shared", path.join(ROOT, "packages", "shared")],
  ["@/modules/", path.join(ROOT, "packages", "domains")],
  ["@/", path.join(ROOT, "src")],
]

function resolveAlias(specifier, fromFile) {
  for (const [prefix, target] of ALIASES) {
    if (specifier.startsWith(prefix)) {
      return path.join(target, specifier.slice(prefix.length))
    }
  }
  return path.resolve(path.dirname(fromFile), specifier)
}

function resolveRouteSource(file, depth = 0) {
  const source = fs.readFileSync(file, "utf8")
  if (depth >= 5) return source // 防御成环

  const match = source.match(/export\s+\*\s+from\s+["']([^"']+)["']/)
  if (!match) return source

  const specifier = match[1]
  const base = resolveAlias(specifier, file)
  if (!base) return source

  for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate)) return resolveRouteSource(candidate, depth + 1)
  }
  return source
}

module.exports = { resolveRouteSource, ROOT }
