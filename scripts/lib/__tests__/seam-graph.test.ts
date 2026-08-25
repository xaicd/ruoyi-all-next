import { describe, expect, it } from "vitest"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { loadCatalog } = require("../domain-catalog.cjs")
const { loadRpcActions } = require("../rpc-contracts.cjs")
const { buildSeamGraph, SEAM_GRAPH_REL } = require("../seam-graph.cjs")

describe("seam-graph", () => {
  it("uses catalog domain names in catalog order and keeps the pay triangle", () => {
    const catalog = loadCatalog()
    const rpc = loadRpcActions()
    const graph = buildSeamGraph({ catalog, rpcActions: rpc })
    expect(graph.kind).toBe("capability-seam-graph")
    expect(graph.generated).toBe(true)
    expect(graph.domains.map((item) => item.name)).toEqual(catalog.domains.map((item) => item.name))
    expect(graph.domains.every((item) => item.rolesComplete)).toBe(true)

    const pay = graph.domains.find((item) => item.name === "pay")
    expect(pay).toBeTruthy()
    expect(pay.definition.facades.some((file) => file.endsWith("pay.facade.ts"))).toBe(true)
    expect(pay.provider.servicesDir).toBe("src/modules/pay/backend/services")
    expect(pay.provider.methods).toEqual(rpc.domains.pay.actions.map((item) => item.method))
    expect(pay.consumer.adminApi).toBe("src/app/api/v1/admin/pay")
    expect(SEAM_GRAPH_REL).toBe("src/modules/shared/contract/seam-graph.json")
  })

  it("does not invent domains that are absent from catalog", () => {
    const catalog = {
      domains: [{ name: "system", kind: "platform", stage: "A" }],
    }
    const graph = buildSeamGraph({
      catalog,
      rpcActions: { domains: { system: { actions: [{ method: "ping" }] } } },
    })
    expect(graph.domains.map((item) => item.name)).toEqual(["system"])
  })
})
