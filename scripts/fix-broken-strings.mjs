/**
 * 修复 PowerShell 编码损坏导致的字符串截断问题
 * 将 `` 替换为合理的占位文本，确保字符串正确闭合
 */
import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const ROOT = join(new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"))
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
      if (content.includes("?")) {
        // Fix patterns like: "some text" or "text"  (broken multibyte at end of string)
        // Pattern: Chinese or ASCII text followed by  before closing quote
        const original = content
        // Replace  with empty (removes broken placeholder)
        content = content.replace(/\?\?/g, "")
        // Also fix single ? that breaks strings (like "审批?" should be "审批")
        // But be careful not to break ternary operators - only fix inside strings
        // Fix: "text?" followed by comma or closing bracket (not ternary)
        content = content.replace(/"([^"]*)\?([,}\]\)])/g, '"$1$2')
        content = content.replace(/'([^']*)\?([,}\]\)])/g, "'$1$2")
        
        if (content !== original) {
          writeFileSync(full, content, "utf-8")
          fixed++
          if (fixed <= 30) console.log(`  Fixed: ${full.replace(ROOT, "src")}`)
        }
      }
    }
  }
}

console.log("=== Fixing broken string literals ===")
walk(ROOT)
console.log(`\nDone. Fixed ${fixed} files.`)
