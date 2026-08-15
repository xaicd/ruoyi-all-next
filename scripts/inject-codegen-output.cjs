/**
 * Manifest-driven local injector for reviewed codegen ZIPs.
 * Usage: node scripts/inject-codegen-output.cjs <extracted-directory> [--dry-run]
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const args = process.argv.slice(2)
const sourceArg = args.find((arg) => !arg.startsWith("--"))
const dryRun = args.includes("--dry-run")

if (!sourceArg) fail("Usage: node scripts/inject-codegen-output.cjs <extracted-directory> [--dry-run]")
const sourceDir = path.resolve(ROOT, sourceArg)
const manifestPath = path.join(sourceDir, "codegen-manifest.json")
if (!fs.existsSync(manifestPath)) fail("Missing codegen-manifest.json; only reviewed manifest-based codegen output can be injected.")

let manifest
try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) } catch { fail("codegen-manifest.json is not valid JSON.") }
if (manifest?.contractVersion !== "1.0.0" || !Array.isArray(manifest.outputs)) fail("Unsupported codegen manifest contract.")

const planned = []
for (const entry of manifest.outputs) {
  if (!entry || typeof entry.path !== "string") fail("Manifest contains an invalid output entry.")
  const relative = entry.path.replace(/\\/g, "/")
  if (!relative.startsWith("src/") || relative.includes("..") || path.posix.isAbsolute(relative) || !/\.(ts|tsx)$/.test(relative)) fail(`Rejected non-source or unsafe output path: ${entry.path}`)
  const source = path.resolve(sourceDir, ...relative.split("/"))
  const target = path.resolve(ROOT, ...relative.split("/"))
  if (!isWithin(sourceDir, source) || !isWithin(ROOT, target)) fail(`Rejected path escaping its root: ${entry.path}`)
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) fail(`Manifest file is missing: ${entry.path}`)
  const content = fs.readFileSync(source, "utf8")
  validateContent(relative, content)
  planned.push({ relative, source, target, content })
}

const duplicate = planned.find((item, index) => planned.findIndex((other) => other.relative === item.relative) !== index)
if (duplicate) fail(`Manifest contains duplicate output path: ${duplicate.relative}`)
const conflicts = planned.filter((item) => fs.existsSync(item.target))
if (conflicts.length) fail(`Injection aborted; existing files would be overwritten:\n${conflicts.map((item) => `  - ${item.relative}`).join("\n")}`)

console.log(`${dryRun ? "DRY RUN: " : ""}Validated ${planned.length} files from ${path.relative(ROOT, sourceDir)}`)
for (const item of planned) console.log(`  ${dryRun ? "WOULD COPY" : "COPY"}: ${item.relative}`)
if (dryRun) process.exit(0)

for (const item of planned) {
  fs.mkdirSync(path.dirname(item.target), { recursive: true })
  fs.writeFileSync(item.target, item.content, "utf8")
}
console.log(`Injected ${planned.length} reviewed files. Register permissions and menus explicitly before exposing routes.`)

function validateContent(relative, content) {
  if (content.includes("/api/admin/") || content.includes("/(admin)/")) fail(`Rejected legacy route convention in ${relative}`)
  if (/export\s+async\s+function\s+(GET|POST|PUT|DELETE)/.test(content) && !content.includes("withAdminRoute")) fail(`Rejected unprotected API route in ${relative}`)
}
function isWithin(root, candidate) { return candidate === root || candidate.startsWith(`${root}${path.sep}`) }
function fail(message) { console.error(`Codegen injection failed: ${message}`); process.exit(1) }
