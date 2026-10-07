/**
 * Skills single source of truth.
 *
 *   .agents/skills/<name>/SKILL.md              source (hand-edited, declared by agent-profile.json npc.skillsDir)
 *   docs/skills/ruoyi-all-next/<name>.SKILL.md  generated mirror (byte-identical, do not hand-edit)
 *
 * The docs/skills mirror previously drifted: 4 bodies were stale shorter copies
 * and `new-feature` was missing entirely. Run `npm run skills:sync` after editing
 * a skill; `npm run check` fails on drift.
 */

const fs = require("fs")
const path = require("path")
const { ROOT } = require("./lib/domain-catalog.cjs")

/**
 * 定位技能镜像目录 `docs/skills/<项目名>/`。
 *
 * **不要写死项目名** —— 孵化（project:create）只重写内容、不改目录名，
 * 写死会让孵化出的工程一上来就因"技能目录缺失"而门禁失败（实测）。
 * 解析顺序: 先按 package.json 的 name，退化为 docs/skills 下唯一存在的目录。
 */
function resolveSkillsMirrorDir(root) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
    const byName = path.join("docs", "skills", String(pkg.name || "").replace(/^@[^/]+\//, ""))
    if (fs.existsSync(path.join(root, byName))) return byName
  } catch {
    // 读不到 package.json 就退化到扫描
  }
  const base = path.join(root, "docs", "skills")
  if (!fs.existsSync(base)) return "docs/skills"
  const dirs = fs.readdirSync(base, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  return dirs.length === 1 ? path.join("docs", "skills", dirs[0]) : "docs/skills"
}

const SOURCE_DIR = ".agents/skills"
const MIRROR_DIR = resolveSkillsMirrorDir(path.resolve(__dirname, ".."))
const README_REL = `${MIRROR_DIR}/README.md`
const SKILL_FILE = "SKILL.md"

const checkOnly = process.argv.includes("--check")

function fail(message) {
  throw new Error(`[skills] ${message}`)
}

function abs(rel) {
  return path.join(ROOT, ...rel.split("/"))
}

function listSkillNames() {
  const sourceRoot = abs(SOURCE_DIR)
  if (!fs.existsSync(sourceRoot)) fail(`missing ${SOURCE_DIR} (declared as agent-profile.json npc.skillsDir)`)
  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function readSkill(name) {
  const rel = `${SOURCE_DIR}/${name}/${SKILL_FILE}`
  const full = abs(rel)
  if (!fs.existsSync(full)) fail(`${rel} is missing`)

  const body = fs.readFileSync(full, "utf8")
  if (!body.startsWith("---\n")) fail(`${rel} must start with YAML frontmatter`)
  const end = body.indexOf("\n---", 4)
  if (end === -1) fail(`${rel} has unterminated YAML frontmatter`)

  const frontmatter = body.slice(4, end)
  for (const field of ["name", "description"]) {
    if (!new RegExp(`^${field}:\\s*\\S`, "m").test(frontmatter)) {
      fail(`${rel} frontmatter must declare a non-empty "${field}"`)
    }
  }
  return body
}

function mirrorRel(name) {
  return `${MIRROR_DIR}/${name}.SKILL.md`
}

function main() {
  const names = listSkillNames()
  if (names.length === 0) fail(`no skills found in ${SOURCE_DIR}`)

  const drifted = []
  const written = []

  for (const name of names) {
    const body = readSkill(name)
    const rel = mirrorRel(name)
    const full = abs(rel)
    const current = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null

    if (current === body) continue

    if (checkOnly) {
      drifted.push(current === null ? `${rel} (missing)` : `${rel} (stale)`)
      continue
    }

    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, body)
    written.push(rel)
  }

  const known = new Set(names)
  const orphaned = fs
    .readdirSync(abs(MIRROR_DIR))
    .filter((entry) => entry.endsWith(".SKILL.md"))
    .map((entry) => entry.slice(0, -".SKILL.md".length))
    .filter((name) => !known.has(name))
    .sort()

  if (orphaned.length > 0) {
    drifted.push(...orphaned.map((name) => `${mirrorRel(name)} (no source skill)`))
  }
  // 写模式下**删掉孤儿镜像** —— 此前只报告不删除，导致源技能被移除后
  // 镜像一直留着，check 永远红（实测: 撤掉 5 个技能后镜像仍 30 个）。
  const removed = []
  if (!checkOnly) {
    for (const name of orphaned) {
      const full = abs(mirrorRel(name))
      if (fs.existsSync(full)) { fs.rmSync(full); removed.push(mirrorRel(name)) }
    }
  }

  const readmeFull = abs(README_REL)
  if (!fs.existsSync(readmeFull)) fail(`missing ${README_REL}`)
  const readme = fs.readFileSync(readmeFull, "utf8")
  const unregistered = names.filter((name) => !readme.includes(name))

  if (checkOnly) {
    const problems = [...drifted]
    if (unregistered.length > 0) {
      problems.push(`${README_REL} does not reference: ${unregistered.join(", ")}`)
    }
    if (problems.length > 0) {
      fail(`drift detected, run "npm run skills:sync":\n  - ${problems.join("\n  - ")}`)
    }
    console.log(`[skills] PASS: ${names.length} skills mirrored from .agents/skills`)
    return
  }

  if (unregistered.length > 0) {
    console.log(`[skills] WARN: ${README_REL} does not reference: ${unregistered.join(", ")}`)
  }
  for (const rel of removed) console.log(`  - removed ${rel}`)
  console.log(`[skills] synced ${written.length} mirror(s) from .agents/skills (${names.length} total)${removed.length ? `, removed ${removed.length} orphan(s)` : ""}`)
  for (const rel of written) console.log(`  - ${rel}`)
}

main()
