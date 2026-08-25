const fs = require("fs")
const path = require("path")
const { ROOT, loadCatalog } = require("./lib/domain-catalog.cjs")
const { PLATFORM_COMPANIONS } = require("./lib/hatch-profile.cjs")
const { SEAM_GRAPH_REL, assertSeamGraphMatches } = require("./lib/seam-graph.cjs")

function fail(message) {
  throw new Error(`[harness-bundle] ${message}`)
}

const AGENT_PROFILE_REL = "src/modules/shared/contract/agent-profile.json"
const profilePath = path.join(ROOT, ...AGENT_PROFILE_REL.split("/"))
if (!fs.existsSync(profilePath)) fail(`missing ${AGENT_PROFILE_REL}`)

const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"))
if (profile.kind !== "workspace-bundle") fail("agent-profile.json kind must be workspace-bundle")
if (profile.role !== "business-project-template") fail("agent-profile.json role must be business-project-template")
if (!Array.isArray(profile.not) || !profile.not.includes("agent-runtime") || !profile.not.includes("cordis-host")) {
  fail("agent-profile.json must declare it is not an agent-runtime or cordis-host")
}

const requiredSections = [
  { name: "identity", path: ".agents/context/IDENTITY.md" },
  { name: "soul", path: ".agents/context/SOUL.md" },
  { name: "seams", path: AGENT_PROFILE_REL },
  { name: "seam-graph", path: SEAM_GRAPH_REL },
  { name: "catalog", path: "src/modules/shared/backend/constants/domain-catalog.json" },
]
for (const section of requiredSections) {
  const declared = (profile.promptAssembly?.sections || []).find((item) => item.name === section.name)
  if (!declared) fail(`promptAssembly missing section ${section.name}`)
  const target = path.join(ROOT, ...section.path.split("/"))
  if (!fs.existsSync(target)) fail(`prompt section ${section.name} missing file ${section.path}`)
}

if (!fs.existsSync(path.join(ROOT, ".agents/context/ASSEMBLY.md"))) fail("missing .agents/context/ASSEMBLY.md")
if (!fs.existsSync(path.join(ROOT, ".agents/skills/agent-harness/SKILL.md"))) fail("missing agent-harness skill")
if (!fs.existsSync(path.join(ROOT, "docs/skills/ruoyi-all-next/agent-harness.SKILL.md"))) {
  fail("missing docs/skills/ruoyi-all-next/agent-harness.SKILL.md")
}

const agentsMd = fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf8")
if (!agentsMd.includes("agent-harness")) fail("AGENTS.md must register agent-harness")
if (!agentsMd.includes("Workspace Bundle")) fail("AGENTS.md §18 must declare Workspace Bundle")

if (Array.isArray(profile.bundles?.business?.domains)) {
  fail("agent-profile bundles.business must not duplicate domain names; catalog is the source of truth")
}
if (!String(profile.bundles?.business?.source || "").includes("domain-catalog.json")) {
  fail("agent-profile bundles.business.source must point at domain-catalog.json")
}

const companions = profile.profiles?.minimal?.companions || []
if (companions.join(",") !== PLATFORM_COMPANIONS.join(",")) {
  fail(`minimal companions must be ${PLATFORM_COMPANIONS.join(",")} (menu catalog + codegen facades)`)
}

if (profile.seamGraph?.path !== SEAM_GRAPH_REL) {
  fail(`agent-profile.seamGraph.path must be ${SEAM_GRAPH_REL}`)
}

const catalog = loadCatalog()
const graph = assertSeamGraphMatches({ catalog })
const catalogNames = catalog.domains.map((item) => item.name)
const graphNames = graph.domains.map((item) => item.name)
if (catalogNames.join(",") !== graphNames.join(",")) {
  fail("seam-graph domain names drifted from domain-catalog.json")
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
for (const [name, spec] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
  if (String(name).toLowerCase().includes("cordis") || String(spec).toLowerCase().includes("cordis")) {
    fail("package.json must not depend on Cordis")
  }
}

if (!fs.existsSync(path.join(ROOT, "docs/features/sprint-prod"))) {
  fail("missing docs/features/sprint-prod append-only trace directory")
}

const hatchPath = path.join(ROOT, "scripts/lib/hatch-profile.cjs")
if (!fs.existsSync(hatchPath)) fail("missing scripts/lib/hatch-profile.cjs")
const hatchSource = fs.readFileSync(hatchPath, "utf8")
if (!hatchSource.includes("minimal") || !hatchSource.includes("--bundle")) {
  fail("hatch-profile must support --profile/--bundle")
}

const cloneSource = fs.readFileSync(path.join(ROOT, "scripts/clone-project-base.cjs"), "utf8")
if (!cloneSource.includes("resolveHatchPlan") || !cloneSource.includes("hatch-manifest.json")) {
  fail("clone-project-base.cjs must apply hatch profile patches")
}

if (!profile.trace?.sprintProd || !profile.trace?.gateArtifact || !profile.trace?.writer) {
  fail("agent-profile.trace must declare sprintProd, gateArtifact, and writer")
}
const writerRel = profile.trace.writer
if (!fs.existsSync(path.join(ROOT, ...writerRel.split("/")))) fail(`missing trace writer ${writerRel}`)

const CRUSH_SKILL_NAMES = new Set(["git-flow", "code-review", "build-project", "run-preview", "test-validate", "deploy-artifact"])
const layers = profile.npc?.layers
if (!layers || !layers.L0 || !layers.L4) fail("agent-profile.npc.layers must declare at least L0 and L4")
const skillsDir = profile.npc?.skillsDir || ".agents/skills"
const seenSkills = new Set()
for (const [layer, spec] of Object.entries(layers)) {
  if (!spec || !Array.isArray(spec.skills) || spec.skills.length === 0) {
    fail(`npc.layers.${layer} must list base skills`)
  }
  for (const skill of spec.skills) {
    const name = String(skill || "").trim()
    if (!name) fail(`npc.layers.${layer} has an empty skill name`)
    if (CRUSH_SKILL_NAMES.has(name) || name.toLowerCase().includes("crush")) {
      fail(`npc.layers.${layer} must not use Crush skill name ${name}`)
    }
    const skillFile = path.join(ROOT, skillsDir, name, "SKILL.md")
    if (!fs.existsSync(skillFile)) fail(`npc.layers.${layer} skill missing: ${skillsDir}/${name}/SKILL.md`)
    seenSkills.add(name)
  }
}

console.log(`[harness-bundle] PASS: workspace-bundle, ${graph.domains.length} seams, hatch P1, ${seenSkills.size} layer skills`)
