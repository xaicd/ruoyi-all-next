import { describe, expect, it } from "vitest"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const {
  parseArgv,
  resolveHatchPlan,
  shouldSkipRelPath,
  pruneCatalog,
  pruneRpcActions,
  buildHatchManifest,
  PLATFORM_COMPANIONS,
} = require("../hatch-profile.cjs")

const catalog = {
  layers: {
    platform: { domains: ["system", "infra"] },
    business: { domains: ["online", "ai", "aigw", "mall", "crm", "pay"] },
  },
  domains: [
    { name: "system" },
    { name: "infra" },
    { name: "online" },
    { name: "ai" },
    { name: "aigw" },
    { name: "mall" },
    { name: "crm" },
    { name: "pay" },
  ],
}

describe("hatch-profile", () => {
  it("parses profile and bundle flags", () => {
    const parsed = parseArgv(["node", "clone", "D:/tmp/app", "--profile", "vertical", "--bundle", "mall,crm"])
    expect(parsed.target).toBe("D:/tmp/app")
    expect(parsed.profile).toBe("vertical")
    expect(parsed.bundle).toEqual(["mall", "crm"])
  })

  it("promotes --bundle on standard to vertical", () => {
    const parsed = parseArgv(["node", "clone", "./out", "--bundle=mall"])
    expect(parsed.profile).toBe("vertical")
    expect(parsed.bundle).toEqual(["mall"])
  })

  it("minimal keeps platform companions and drops mall", () => {
    const plan = resolveHatchPlan(catalog, { profile: "minimal" })
    expect(plan.includeClients).toBe(false)
    expect(plan.domains).toEqual(["system", "infra", ...PLATFORM_COMPANIONS])
    expect(plan.excludedDomains).toEqual(["mall", "crm", "pay"])
    expect(shouldSkipRelPath("src/modules/mall", plan)).toBe(true)
    expect(shouldSkipRelPath("src/modules/system", plan)).toBe(false)
    expect(shouldSkipRelPath("clients/h5/src/modules/wms/api.ts", plan)).toBe(true)
  })

  it("vertical requires bundle and always keeps companions", () => {
    expect(() => resolveHatchPlan(catalog, { profile: "vertical" })).toThrow(/--bundle/)
    const plan = resolveHatchPlan(catalog, { profile: "vertical", bundle: ["mall"] })
    expect(plan.domains).toContain("mall")
    expect(plan.domains).toContain("online")
    expect(plan.domains).not.toContain("pay")
    expect(shouldSkipRelPath("src/app/api/v1/admin/pay/orders/route.ts", plan)).toBe(true)
    expect(shouldSkipRelPath("src/app/(admin-pages)/admin/mall/page.tsx", plan)).toBe(false)
  })

  it("prunes catalog and rpc-actions to the selected domains", () => {
    const plan = resolveHatchPlan(catalog, { profile: "minimal" })
    const nextCatalog = pruneCatalog(catalog, plan)
    expect(nextCatalog.domains.map((item) => item.name)).toEqual(plan.domains)
    expect(nextCatalog.layers.business.domains).toEqual(["online", "ai", "aigw"])
    const rpc = pruneRpcActions({ domains: { system: {}, pay: {}, mall: {} } }, plan)
    expect(rpc.domains).toEqual({ system: {} })
    expect(buildHatchManifest(plan).pruned).toBe(true)
  })

  it("rejects unknown bundle domains", () => {
    expect(() => resolveHatchPlan(catalog, { profile: "vertical", bundle: ["foo"] })).toThrow(/未知域/)
  })
})
