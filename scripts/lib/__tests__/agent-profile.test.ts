import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const { PLATFORM_COMPANIONS } = require("../hatch-profile.cjs")
const { SEAM_GRAPH_REL } = require("../seam-graph.cjs")

const ROOT = path.resolve(__dirname, "../../..")

describe("agent-profile workspace bundle", () => {
  const profile = JSON.parse(
    readFileSync(path.join(ROOT, "src/modules/shared/contract/agent-profile.json"), "utf8"),
  )

  it("declares workspace-bundle and refuses to host the agent loop", () => {
    expect(profile.kind).toBe("workspace-bundle")
    expect(profile.not).toEqual(expect.arrayContaining(["agent-runtime", "cordis-host", "llm-loop"]))
    expect(profile.bundles.business.domains).toBeUndefined()
    expect(profile.bundles.business.source).toMatch(/domain-catalog\.json/)
    expect(profile.profiles.minimal.companions).toEqual([...PLATFORM_COMPANIONS])
    expect(profile.seamGraph.path).toBe(SEAM_GRAPH_REL)
    expect(profile.trace.sprintProd).toBe("docs/features/sprint-prod/")
    expect(profile.trace.writer).toBe("scripts/write-harness-trace.cjs")
  })
})
