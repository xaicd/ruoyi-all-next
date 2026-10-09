/**
 * Skills single source of truth and integrity validator.
 *
 *   .agents/skills/<name>/SKILL.md    authoritative source (hand-edited, declared by agent-profile.json npc.skillsDir)
 *   .agents/skills/README.md          skill registry & matrix
 *
 * Duplicate directories (e.g. docs/skills/ mirror) are strictly forbidden
 * to eliminate drift, cognitive pollution, and maintenance overhead.
 */

const fs = require("fs")
const path = require("path")
const { ROOT } = require("./lib/domain-catalog.cjs")

const SOURCE_DIR = ".agents/skills"
const README_REL = `${SOURCE_DIR}/README.md`
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
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(sourceRoot, entry.name, SKILL_FILE)))
    .map((entry) => entry.name)
    .sort()
}

function validateSkill(name) {
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

function checkNoDuplicateSkillsDir() {
  const duplicateDirs = [
    abs("docs/skills"),
    abs("docs/spec/skills"),
    abs("packages/shared/skills"),
  ]

  for (const dir of duplicateDirs) {
    if (fs.existsSync(dir)) {
      if (checkOnly) {
        fail(`duplicate/mirror skills directory detected at "${path.relative(ROOT, dir)}"! .agents/skills is the sole source of truth. Remove duplicate directories.`)
      } else {
        console.log(`[skills] Purging forbidden duplicate skills directory: ${path.relative(ROOT, dir)}`)
        fs.rmSync(dir, { recursive: true, force: true })
      }
    }
  }
}

function main() {
  // 1. 确保没有重复的 skills 目录
  checkNoDuplicateSkillsDir()

  // 2. 校验所有技能的结构与 Frontmatter
  const names = listSkillNames()
  if (names.length === 0) fail(`no skills found in ${SOURCE_DIR}`)

  for (const name of names) {
    validateSkill(name)
  }

  // 3. 校验 README.md 登记完整性
  const readmeFull = abs(README_REL)
  if (!fs.existsSync(readmeFull)) fail(`missing ${README_REL}`)
  const readme = fs.readFileSync(readmeFull, "utf8")
  const unregistered = names.filter((name) => !readme.includes(name))

  if (unregistered.length > 0) {
    if (checkOnly) {
      fail(`${README_REL} does not reference skills: ${unregistered.join(", ")}`)
    } else {
      console.log(`[skills] WARN: ${README_REL} does not reference: ${unregistered.join(", ")}`)
    }
  }

  console.log(`[skills] PASS: ${names.length} skills verified in ${SOURCE_DIR} (single source of truth, 0 duplicate dirs)`)
}

main()
