import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const ROOT = join(new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"))
let fixed = 0

function isValidUtf8(buf) {
  let i = 0
  while (i < buf.length) {
    if (buf[i] <= 0x7F) { i++; continue }
    let len = 0
    if ((buf[i] & 0xE0) === 0xC0) len = 2
    else if ((buf[i] & 0xF0) === 0xE0) len = 3
    else if ((buf[i] & 0xF8) === 0xF0) len = 4
    else return false
    if (i + len > buf.length) return false
    for (let j = 1; j < len; j++) {
      if ((buf[i + j] & 0xC0) !== 0x80) return false
    }
    i += len
  }
  return true
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next-ruoyi") continue
      walk(full)
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const buf = readFileSync(full)
      if (!isValidUtf8(buf)) {
        // Read as latin1 (preserves all bytes), then re-encode
        // Replace invalid sequences: read as utf8 with replacement
        const text = buf.toString("utf-8")
        // The replacement character U+FFFD will be inserted for bad bytes
        // Replace U+FFFD with a safe placeholder
        const cleaned = text.replace(/\uFFFD/g, "?")
        writeFileSync(full, cleaned, "utf-8")
        fixed++
        console.log(`  Fixed: ${full.replace(ROOT, "src")}`)
      }
    }
  }
}

console.log("=== Fixing bad UTF-8 files ===")
walk(ROOT)
console.log(`\nDone. Fixed ${fixed} files.`)
