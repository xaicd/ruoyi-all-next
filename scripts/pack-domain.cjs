const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")
const { ROOT, listDomains, getDomain } = require("./lib/domain-catalog.cjs")

function parseArgs(argv) {
  const args = {
    domain: "",
    list: false,
    all: false,
    materialize: false,
    dryRun: false,
    dev: false,
    build: false,
    out: "",
  }
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (token === "--list") args.list = true
    else if (token === "--all") args.all = true
    else if (token === "--materialize") args.materialize = true
    else if (token === "--dry-run") args.dryRun = true
    else if (token === "--dev") args.dev = true
    else if (token === "--build") args.build = true
    else if (token === "--out") args.out = argv[++index]
    else if (!token.startsWith("-") && !args.domain) args.domain = token
    else fail(`unknown argument: ${token}`)
  }
  return args
}

function fail(message) {
  throw new Error(`[domain-pack] ${message}`)
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true })
  fs.cpSync(from, to, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(from, source).replace(/\\/g, "/")
      if (!relative) return true
      return !relative.split("/").some((segment) => segment === "node_modules" || segment === ".next-ruoyi" || segment === "__tests__")
    },
  })
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return false
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.statSync(from).isDirectory()) copyDir(from, to)
  else fs.copyFileSync(from, to)
  return true
}

function buildPlan(domain) {
  const apiRouteDirs = domain.publicPrefixes.map((prefix) => prefix.replace(/^\/api/, "src/app/api"))
  const modules = Array.from(new Set([domain.name, ...domain.dependsOnModules]))
  const files = [
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.js",
    "tailwind.config.js",
    ".npmrc",
    "next-env.d.ts",
    "src/app/layout.tsx",
    "src/app/globals.css",
  ]
  const dirs = [
    "prisma",
    "public",
    "src/app/healthz",
    "src/app/readyz",
    "src/app/api/internal",
    ...modules.map((name) => `src/modules/${name}`),
    ...apiRouteDirs,
  ]
  return { domain: domain.name, defaultPort: domain.defaultPort, upstreamEnv: domain.upstreamEnv, files, dirs, apiRouteDirs, modules }
}

function materialize(plan, outDir) {
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
  const copied = []
  const missing = []

  for (const relative of plan.files) {
    const ok = copyIfExists(path.join(ROOT, relative), path.join(outDir, relative))
    if (ok) copied.push(relative)
    else missing.push(relative)
  }
  for (const relative of plan.dirs) {
    const ok = copyIfExists(path.join(ROOT, relative), path.join(outDir, relative))
    if (ok) copied.push(`${relative}/`)
    else missing.push(relative)
  }

  fs.writeFileSync(
    path.join(outDir, "src", "app", "page.tsx"),
    `export default function DomainRuntimePage() {\n  return <main>ruoyi domain runtime: ${plan.domain}</main>\n}\n`,
  )
  copied.push("src/app/page.tsx")

  const packageJsonPath = path.join(outDir, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    pkg.name = `ruoyi-domain-${plan.domain}`
    pkg.private = true
    pkg.scripts = {
      ...pkg.scripts,
      dev: `next dev -p ${plan.defaultPort}`,
      start: "node .next-ruoyi/standalone/server.js",
    }
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`)
  }

  fs.writeFileSync(
    path.join(outDir, ".env.domain"),
    `RUOYI_PACK_DOMAIN=${plan.domain}\nPORT=${plan.defaultPort}\n`,
  )
  fs.writeFileSync(
    path.join(outDir, "domain-pack.json"),
    `${JSON.stringify({ ...plan, copied, missing: missing.filter((item) => item !== "next-env.d.ts") }, null, 2)}\n`,
  )

  const rootModules = path.join(ROOT, "node_modules")
  const packModules = path.join(outDir, "node_modules")
  if (fs.existsSync(rootModules) && !fs.existsSync(packModules)) {
    fs.symlinkSync(rootModules, packModules, process.platform === "win32" ? "junction" : "dir")
  }
  fs.mkdirSync(path.join(outDir, "public"), { recursive: true })

  return { copied, missing: missing.filter((item) => item !== "next-env.d.ts") }
}

function runNext(plan, outDir, mode) {
  const args = mode === "dev" ? ["next", "dev", "-p", String(plan.defaultPort)] : ["next", "build"]
  const result = spawnSync("npx", args, {
    cwd: outDir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      RUOYI_PACK_DOMAIN: plan.domain,
      PORT: String(plan.defaultPort),
    },
  })
  if (result.status !== 0) fail(`${mode} failed for domain ${plan.domain}`)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.list) {
    console.log("runtime\tdomain\tport\tstage\tkind\tinvoke\tupstreamEnv")
    console.log("all-in-one\tall-next\t3100\tA\tmonolith\tsdk\t(none)")
    for (const domain of listDomains()) {
      console.log(`split\t${domain.name}\t${domain.defaultPort}\t${domain.stage}\t${domain.kind}\trpc-when-remote\t${domain.upstreamEnv}`)
    }
    return
  }
  if (args.all || args.domain === "all" || args.domain === "all-next") {
    console.log(JSON.stringify({
      runtime: "all-in-one",
      process: 1,
      invoke: "sdk",
      port: 3100,
      pack: "full Next.js app (Dockerfile)",
      dev: "npm run dev",
      start: "npm run build && npm run start",
      compose: "npm run runtime:all",
    }, null, 2))
    return
  }
  if (!args.domain) fail("usage: node scripts/pack-domain.cjs <domain|--all> [--dry-run|--materialize|--dev|--build]")

  const domain = getDomain(args.domain)
  const plan = buildPlan(domain)
  const outDir = args.out ? path.resolve(args.out) : path.join(ROOT, "dist", "domain-packs", domain.name)

  if (args.dryRun || (!args.materialize && !args.dev && !args.build)) {
    console.log(JSON.stringify({ outDir: path.relative(ROOT, outDir).replace(/\\/g, "/"), ...plan }, null, 2))
    return
  }

  const result = materialize(plan, outDir)
  console.log(`[domain-pack] materialized ${domain.name} -> ${outDir}`)
  console.log(`[domain-pack] copied ${result.copied.length} entries`)
  if (result.missing.length > 0) console.log(`[domain-pack] missing optional paths: ${result.missing.join(", ")}`)

  if (args.dev) runNext(plan, outDir, "dev")
  if (args.build) runNext(plan, outDir, "build")
}

main()
