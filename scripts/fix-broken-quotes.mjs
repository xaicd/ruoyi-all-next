import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const ROOT = "d:\\workspace\\zhuangyuan\\ruoyi\\ruoyi-all-next\\src"
let fixed = 0

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next-ruoyi") continue
      walk(full)
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      let content = readFileSync(full, "utf-8")
      const original = content

      // Fix: "text) => should be "text")
      content = content.replace(/\?\?\)/g, '")')
      // Fix: "text" => should be "text"
      content = content.replace(/\?\?"/g, '"')
      // Fix: 'text' => should be 'text'
      content = content.replace(/\?\?'/g, "'")
      // Fix: `text` => should be `text`
      content = content.replace(/\?\?`/g, "`")
      // Fix: text, => text",  (inside string before comma)
      content = content.replace(/"([^"]*)\?\?,/g, '"$1",')
      // Fix: text} => text"}
      content = content.replace(/"([^"]*)\?\?}/g, '"$1"}')

      if (content !== original) {
        writeFileSync(full, content, "utf-8")
        fixed++
        if (fixed <= 30) console.log(`  Fixed: ${full.replace(ROOT, "src")}`)
      }
    }
  }
}

console.log("=== Fixing broken quote patterns ===")
walk(ROOT)
console.log(`\nDone. Fixed ${fixed} files.`)
