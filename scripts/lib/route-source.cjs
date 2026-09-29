/**
 * 解析路由文件的「真实来源」。
 *
 * 背景：路由逻辑可以放在域内（`src/modules/<domain>/routes/**`），
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

function resolveRouteSource(file, depth = 0) {
  const source = fs.readFileSync(file, "utf8")
  if (depth >= 5) return source // 防御成环

  const match = source.match(/export\s+\*\s+from\s+["']([^"']+)["']/)
  if (!match) return source

  const specifier = match[1]
  const base = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : path.resolve(path.dirname(file), specifier)

  for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate)) return resolveRouteSource(candidate, depth + 1)
  }
  return source
}

module.exports = { resolveRouteSource, ROOT }
