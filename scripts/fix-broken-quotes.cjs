const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..", "src")
let fixed = 0

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next-ruoyi") continue
      walk(full)
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      let content = fs.readFileSync(full, "utf-8")
      const original = content

      // The PowerShell replace removed all ?? (nullish coalescing operators)
      // They became double-spaces. Restore them:
      
      // Pattern: expression)  value => expression) ?? value
      // e.g. get("page")  1) => get("page") ?? 1)
      content = content.replace(/\)\s{2}(\d+)\)/g, ") ?? $1)")
      
      // e.g. get("keyword")  undefined => get("keyword") ?? undefined
      content = content.replace(/\)\s{2}undefined/g, ") ?? undefined")
      
      // e.g. error?.message  "text" => error?.message ?? "text"
      content = content.replace(/\.message\s{2}"/g, '.message ?? "')
      
      // e.g. error?.message  'text' => error?.message ?? 'text'
      content = content.replace(/\.message\s{2}'/g, ".message ?? '")

      // e.g. input.note  null => input.note ?? null
      content = content.replace(/(\w)\s{2}null/g, "$1 ?? null")

      // e.g. value  "" => value ?? ""
      content = content.replace(/(\w)\s{2}""/g, '$1 ?? ""')

      if (content !== original) {
        fs.writeFileSync(full, content, "utf-8")
        fixed++
      }
    }
  }
}

console.log("=== Fixing destroyed nullish coalescing operators ===")
walk(ROOT)
console.log("Done. Fixed " + fixed + " files.")
