/**
 * 修复 PowerShell Set-Content 写入的文件编码问题
 * 将 UTF-16 LE (带 BOM) 文件转为 UTF-8 无 BOM
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs"
import { join } from "path"

const ROOT = new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")

let fixed = 0
let total = 0

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next-ruoyi") continue
      walk(full)
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      total++
      const buf = readFileSync(full)
      // Detect UTF-16 LE BOM: FF FE
      if (buf[0] === 0xFF && buf[1] === 0xFE) {
        const content = buf.toString("utf16le").replace(/^\uFEFF/, "")
        writeFileSync(full, content, "utf-8")
        fixed++
        if (fixed <= 20) console.log(`  Fixed: ${full.replace(ROOT, "src")}`)
      }
      // Detect UTF-8 BOM: EF BB BF
      else if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        const content = buf.toString("utf-8").replace(/^\uFEFF/, "")
        writeFileSync(full, content, "utf-8")
        fixed++
        if (fixed <= 20) console.log(`  Fixed: ${full.replace(ROOT, "src")}`)
      }
    }
  }
}

console.log("=== Fixing file encodings ===")
walk(ROOT)
console.log(`\nDone. Fixed ${fixed} / ${total} files.`)
