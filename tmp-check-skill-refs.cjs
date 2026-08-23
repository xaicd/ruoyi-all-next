const fs = require("fs")
const path = require("path")
const dir = path.join(__dirname, "docs/skills/ruoyi-all-next")
const root = __dirname
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
const refs = new Set()
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), "utf8")
  for (const m of t.matchAll(/`([^`]+)`/g)) refs.add(m[1])
}
for (const r of [...refs].sort()) {
  if (!/^(docs|src|deploy|clients|public|AGENTS|\.kiro)\b/.test(r)) continue
  if (r.includes("<") || r.includes("{")) continue
  const p = path.join(root, r)
  if (!fs.existsSync(p)) console.log("MISSING", r)
}
