import { readdirSync, readFileSync } from "fs"
import { join } from "path"

const ROOT = join(new URL("../src", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"))
const badFiles = []

function isValidUtf8(buf) {
  let i = 0
  while (i < buf.length) {
    if (buf[i] <= 0x7F) { i++; continue }
    let len = 0
    if ((buf[i] & 0xE0) === 0xC0) len = 2
    else if ((buf[i] & 0xF0) === 0xE0) len = 3
    else if ((buf[i] & 0xF8) === 0xF0) len = 4
    else return { valid: false, pos: i }
    if (i + len > buf.length) return { valid: false, pos: i }
    for (let j = 1; j < len; j++) {
      if ((buf[i + j] & 0xC0) !== 0x80) return { valid: false, pos: i }
    }
    i += len
  }
  return { valid: true, pos: -1 }
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
      const result = isValidUtf8(buf)
      if (!result.valid) {
        const ctx = buf.slice(Math.max(0, result.pos - 10), result.pos + 10)
        badFiles.push({ file: full.replace(ROOT, "src"), pos: result.pos, ctx: ctx.toString("hex") })
      }
    }
  }
}

walk(ROOT)
console.log(`Bad UTF-8 files: ${badFiles.length}`)
badFiles.slice(0, 30).forEach(f => console.log(`  ${f.file} @ byte ${f.pos}`))
