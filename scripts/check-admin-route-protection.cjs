const fs = require("fs")
const path = require("path")

const root = path.resolve(__dirname, "..")
const adminRoot = path.join(root, "src", "app", "api", "v1", "admin")
const proxyPath = path.join(root, "src", "proxy.ts")
const policyPath = path.join(root, "src", "modules", "shared", "backend", "lib", "admin-route-policy.ts")

function countRoutes(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) count += countRoutes(target)
    else if (entry.name === "route.ts") count++
  }
  return count
}

function fail(message) {
  console.error(`[admin-route-protection] ${message}`)
  process.exit(1)
}

if (!fs.existsSync(proxyPath)) fail("missing src/proxy.ts required by the src/app layout")
if (fs.existsSync(path.join(root, "proxy.ts"))) fail("root proxy.ts is ignored when src/app is present; use src/proxy.ts")
if (!fs.existsSync(policyPath)) fail("missing admin route policy")

const proxySource = fs.readFileSync(proxyPath, "utf8")
const policySource = fs.readFileSync(policyPath, "utf8")
if (!proxySource.includes("/api/v1/admin/:path*") || !proxySource.includes("requireAdminAuth")) {
  fail("proxy must protect every /api/v1/admin route with requireAdminAuth")
}
if (!policySource.includes("ADMIN_PUBLIC_ROUTE_EXCEPTIONS") || !policySource.includes('"authenticated"')) {
  fail("admin route policy must default to authenticated")
}

const routeCount = countRoutes(adminRoot)
if (routeCount === 0) fail("no admin routes were discovered")
console.log(`[admin-route-protection] PASS: ${routeCount} admin routes are covered by the default-auth proxy policy`)
