/**
 * Renders the reviewed module-pack templates locally. It never writes into src.
 * Usage: node scripts/render-module-pack.cjs <spec.json> [--out tmp/module-pack] [--dry-run]
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PACK_ROOT = path.join(ROOT, "codegen", "module-pack")
const TEMPLATE_ROOT = path.join(PACK_ROOT, "templates")
const args = process.argv.slice(2)
const specArg = args.find((arg) => !arg.startsWith("--"))
const outIndex = args.indexOf("--out")
const outputArg = outIndex >= 0 ? args[outIndex + 1] : undefined
const dryRun = args.includes("--dry-run")
if (!specArg) fail("Usage: node scripts/render-module-pack.cjs <spec.json> [--out tmp/module-pack] [--dry-run]")
if (outIndex >= 0 && !outputArg) fail("--out requires a directory value.")

let spec
try { spec = JSON.parse(fs.readFileSync(path.resolve(ROOT, specArg), "utf8")) } catch { fail("Cannot read a valid JSON spec.") }
validateSpec(spec)
const outputRoot = path.resolve(ROOT, outputArg || spec.outputRoot || path.join("tmp", `codegen-${spec.featureListPascal}`))
if (!isWithin(ROOT, outputRoot)) fail("Output directory must remain inside the workspace.")
if (fs.existsSync(outputRoot) && !dryRun) fail("Output directory already exists; choose an empty new directory. Existing output is never overwritten.")

const context = { ...spec, generatedAt: new Date().toISOString() }
const files = collectTemplates(TEMPLATE_ROOT)
  .filter((file) => file.endsWith(".tpl"))
  .map((template) => ({ template, relative: renderPath(path.relative(TEMPLATE_ROOT, template).replace(/\\/g, "/").replace(/\.tpl$/, ""), context) }))
  .filter(({ relative }) => relative.startsWith("src/") || relative === "module.manifest.json" || relative.startsWith("codegen-output-snippets/"))

const sourceOutputs = files.filter(({ relative }) => relative.startsWith("src/")).map(({ relative }) => ({ path: relative, type: outputType(relative) }))
const manifest = { contractVersion: "1.0.0", generator: "ruoyi-all-next-module-pack", template: "CRUD", outputMode: "reviewable-zip-only", outputs: sourceOutputs }
files.push({ template: null, relative: "codegen-manifest.json", generated: `${JSON.stringify(manifest, null, 2)}\n` })

for (const file of files) {
  if (!isSafeOutputPath(file.relative)) fail(`Template produced unsafe output path: ${file.relative}`)
  const destination = path.resolve(outputRoot, ...file.relative.split("/"))
  if (!isWithin(outputRoot, destination)) fail(`Template path escapes output root: ${file.relative}`)
  if (dryRun) { console.log(`WOULD RENDER: ${file.relative}`); continue }
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  const content = file.generated ?? render(fs.readFileSync(file.template, "utf8"), context)
  fs.writeFileSync(destination, content, "utf8")
  console.log(`RENDERED: ${file.relative}`)
}
console.log(dryRun ? "Dry run complete; no files were written." : `Rendered review-only module pack to ${path.relative(ROOT, outputRoot)}.`)

function validateSpec(value) {
  const identifiers = ["moduleKebab", "modulePascal", "moduleCamel", "featureListKebab", "featureListPascal", "featureCamel"]
  for (const key of identifiers) if (typeof value[key] !== "string" || !/^[A-Za-z][A-Za-z0-9-]*$/.test(value[key])) fail(`${key} must be an identifier.`)
  for (const key of ["moduleLabel", "featureListLabel"]) if (typeof value[key] !== "string" || !value[key].trim()) fail(`${key} must be non-empty.`)
  if (typeof value.permissionPrefix !== "string" || !/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(value.permissionPrefix)) fail("permissionPrefix must be resource:action-prefix.")
}
function collectTemplates(directory) { const entries = fs.readdirSync(directory, { withFileTypes: true }); return entries.flatMap((entry) => { const full = path.join(directory, entry.name); return entry.isDirectory() ? collectTemplates(full) : [full] }) }
function render(value, context) { return value.replace(/{{([A-Za-z][A-Za-z0-9]*)}}/g, (_, key) => templateValue(key, context)) }
function renderPath(value, context) {
  let rendered = render(value, context)
  for (const [key, templateValue] of Object.entries(context)) rendered = rendered.split(`__${key}__`).join(String(templateValue))
  return rendered
}
function templateValue(key, context) { if (!(key in context)) fail(`Missing template value: ${key}`); return String(context[key]) }
function outputType(relative) { if (relative.includes("/app/api/")) return "route"; if (relative.includes("/frontend/api/")) return "api"; if (relative.includes("/components/")) return "component"; if (relative.includes("/validators/")) return "validator"; if (relative.includes("/services/")) return relative.includes("__tests__") ? "test" : "service"; if (relative.includes("/types/")) return "type"; if (relative.includes("/constants/")) return "permission"; if (relative.includes("/app/api/")) return "route"; return "page" }
function isSafeOutputPath(relative) { return relative.startsWith("src/") ? !relative.includes("..") && /\.(ts|tsx)$/.test(relative) : relative === "codegen-manifest.json" || relative.startsWith("codegen-output-snippets/") || relative === "module.manifest.json" }
function isWithin(root, candidate) { return candidate === root || candidate.startsWith(`${root}${path.sep}`) }
function fail(message) { console.error(`Module-pack render failed: ${message}`); process.exit(1) }
