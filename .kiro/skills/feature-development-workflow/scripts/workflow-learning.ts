import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type LearningType = "correction" | "failure" | "discovery" | "preference"
type LearningEntry = {
  id: string
  createdAt: string
  type: LearningType
  pattern: string
  scope: string
  summary: string
  prevention: string
  evidence?: string
  sensitivity: "normal" | "sensitive"
}

type ParsedArgs = {
  command: "record" | "review" | "status"
  options: Map<string, string>
}

type PatternSummary = {
  pattern: string
  entries: LearningEntry[]
  latest: LearningEntry
}

const ROOT = process.cwd()
const LEARNING_DIR = path.join(
  ROOT,
  ".kiro",
  "skills",
  "feature-development-workflow",
  "learning",
)
const ENTRIES_FILE = path.join(LEARNING_DIR, "entries.jsonl")
const ACTIVE_FILE = path.join(LEARNING_DIR, "active-rules.md")
const CANDIDATES_FILE = path.join(LEARNING_DIR, "promotion-candidates.md")
const PROMOTION_THRESHOLD = 3
const DEFAULT_ACTIVE_DAYS = 45
const ALLOWED_TYPES = new Set<LearningType>([
  "correction",
  "failure",
  "discovery",
  "preference",
])
const SENSITIVE_CONTENT = /\b(password|passwd|secret|token|authorization|cookie|api[ _-]?key|phone|mobile|idcard|bank[ _-]?card)\b/i

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "status", ...rest] = argv
  if (command !== "record" && command !== "review" && command !== "status") {
    throw new Error("命令仅支持 record、review 或 status")
  }

  const options = new Map<string, string>()
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index]
    if (!token.startsWith("--")) {
      throw new Error(`无法识别参数: ${token}`)
    }

    const value = rest[index + 1]
    if (!value || value.startsWith("--")) {
      throw new Error(`参数 ${token} 缺少值`)
    }

    options.set(token.slice(2), value)
    index += 1
  }

  return { command, options }
}

function getRequired(options: Map<string, string>, name: string): string {
  const value = options.get(name)?.trim()
  if (!value) {
    throw new Error(`缺少必填参数 --${name}`)
  }
  return value
}

function sanitizeText(value: string, field: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (!normalized) {
    throw new Error(`${field} 不能为空`)
  }
  if (normalized.length > maxLength) {
    throw new Error(`${field} 不能超过 ${maxLength} 个字符`)
  }
  if (SENSITIVE_CONTENT.test(normalized)) {
    throw new Error(`${field} 疑似包含敏感信息，请使用脱敏后的业务描述`)
  }
  return normalized
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 365) {
    throw new Error("--active-days 必须是 1 到 365 的整数")
  }
  return parsed
}

function isLearningEntry(value: unknown): value is LearningEntry {
  if (!value || typeof value !== "object") return false
  const entry = value as Partial<LearningEntry>
  return (
    typeof entry.id === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.pattern === "string" &&
    typeof entry.scope === "string" &&
    typeof entry.summary === "string" &&
    typeof entry.prevention === "string" &&
    typeof entry.type === "string" &&
    ALLOWED_TYPES.has(entry.type as LearningType) &&
    (entry.sensitivity === "normal" || entry.sensitivity === "sensitive")
  )
}

async function ensureLearningDirectory(): Promise<void> {
  await mkdir(LEARNING_DIR, { recursive: true })
}

async function readEntries(): Promise<LearningEntry[]> {
  try {
    const raw = await readFile(ENTRIES_FILE, "utf-8")
    const entries: LearningEntry[] = []

    for (const [index, line] of raw.split(/\r?\n/).entries()) {
      if (!line.trim()) continue
      let parsed: unknown
      try {
        parsed = JSON.parse(line)
      } catch {
        throw new Error(`学习记录第 ${index + 1} 行不是合法 JSON，已停止以保护历史记录`)
      }
      if (!isLearningEntry(parsed)) {
        throw new Error(`学习记录第 ${index + 1} 行字段不完整，已停止以保护历史记录`)
      }
      entries.push(parsed)
    }

    return entries.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes("ENOENT")) return []
    throw error
  }
}

function summarize(entries: LearningEntry[]): PatternSummary[] {
  const grouped = new Map<string, LearningEntry[]>()
  for (const entry of entries) {
    const group = grouped.get(entry.pattern) ?? []
    group.push(entry)
    grouped.set(entry.pattern, group)
  }

  return [...grouped.entries()]
    .map(([pattern, group]) => ({
      pattern,
      entries: group,
      latest: group.reduce((latest, entry) =>
        entry.createdAt > latest.createdAt ? entry : latest,
      ),
    }))
    .sort((a, b) => b.latest.createdAt.localeCompare(a.latest.createdAt))
}

function markdownEscape(value: string): string {
  return value.replaceAll("|", "\\|")
}

function renderActiveRules(candidates: PatternSummary[], activeDays: number): string {
  const now = Date.now()
  const cutoff = now - activeDays * 24 * 60 * 60 * 1000
  const active = candidates.filter(
    (candidate) =>
      candidate.latest.sensitivity === "normal" &&
      Date.parse(candidate.latest.createdAt) >= cutoff,
  )

  const lines = [
    "# 功能开发工作流：活跃经验",
    "",
    "> 此文件由 `npm run workflow:learning:review` 自动生成。只保留近期开过验证的可复用经验；它不是永久规范，也不替代 AGENTS.md、审批、资金、权限或安全门禁。",
    "> 读取时只将其作为当前功能/调试任务的补充检查项；若与项目强制规则冲突，以项目强制规则为准。",
    "",
  ]

  if (active.length === 0) {
    lines.push("- 当前没有满足自动激活条件的经验。")
  } else {
    for (const candidate of active) {
      const scopes = [...new Set(candidate.entries.map((entry) => entry.scope))].slice(-3)
      lines.push(
        `- **${candidate.pattern}**（${candidate.entries.length} 次证据，最近 ${candidate.latest.createdAt.slice(0, 10)}；范围：${scopes.join("、")}）：${candidate.latest.prevention}`,
      )
    }
  }

  return `${lines.join("\n")}\n`
}

function renderCandidates(candidates: PatternSummary[], activeDays: number): string {
  const now = Date.now()
  const cutoff = now - activeDays * 24 * 60 * 60 * 1000
  const rows = candidates.map((candidate) => {
    const status =
      candidate.latest.sensitivity === "sensitive"
        ? "需人工审查"
        : Date.parse(candidate.latest.createdAt) < cutoff
          ? "已降级（过期）"
          : "已激活"
    const scopes = [...new Set(candidate.entries.map((entry) => entry.scope))].join("、")
    return `| ${markdownEscape(candidate.pattern)} | ${candidate.entries.length} | ${status} | ${candidate.latest.createdAt.slice(0, 10)} | ${markdownEscape(scopes)} | ${markdownEscape(candidate.latest.prevention)} |`
  })

  return [
    "# 功能开发工作流：规则晋升候选",
    "",
    "> 本文件由 `npm run workflow:learning:review` 自动生成，阈值为同一模式累计 3 条结构化证据。自动生成的活跃经验可随时间降级；此文件**不会**自动修改 `SKILL.md`、项目安全规则、权限或审批规则。",
    "> 要将候选变为永久 Skill，请由项目负责人明确批准，再以小范围、可审查的变更更新对应文档，并保留验证证据。敏感主题（资金、权限、PII、安全、生产数据）始终只可人工审查。",
    "",
    "| 模式 | 证据数 | 状态 | 最近证据 | 覆盖范围 | 建议预防动作 |",
    "| --- | ---: | --- | --- | --- | --- |",
    ...(rows.length > 0 ? rows : ["| 暂无 | 0 | - | - | - | - |"]),
    "",
  ].join("\n")
}

async function review(options: Map<string, string>, quiet = false): Promise<void> {
  await ensureLearningDirectory()
  const activeDays = parsePositiveInt(options.get("active-days"), DEFAULT_ACTIVE_DAYS)
  const entries = await readEntries()
  const candidates = summarize(entries).filter(
    (candidate) => candidate.entries.length >= PROMOTION_THRESHOLD,
  )

  await writeFile(ACTIVE_FILE, renderActiveRules(candidates, activeDays), "utf-8")
  await writeFile(CANDIDATES_FILE, renderCandidates(candidates, activeDays), "utf-8")

  if (!quiet) {
    process.stdout.write(
      `已复核 ${entries.length} 条学习记录；${candidates.length} 项达到 ${PROMOTION_THRESHOLD} 条证据阈值。\n`,
    )
  }
}

async function record(options: Map<string, string>): Promise<void> {
  const type = getRequired(options, "type")
  if (!ALLOWED_TYPES.has(type as LearningType)) {
    throw new Error("--type 仅支持 correction、failure、discovery 或 preference")
  }

  const pattern = getRequired(options, "pattern")
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pattern)) {
    throw new Error("--pattern 必须是 kebab-case，用于汇总同类经验")
  }

  const sensitivity = options.get("sensitivity") ?? "normal"
  if (sensitivity !== "normal" && sensitivity !== "sensitive") {
    throw new Error("--sensitivity 仅支持 normal 或 sensitive")
  }

  const now = new Date()
  const entry: LearningEntry = {
    id: `learning-${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    type: type as LearningType,
    pattern,
    scope: sanitizeText(getRequired(options, "scope"), "scope", 100),
    summary: sanitizeText(getRequired(options, "summary"), "summary", 240),
    prevention: sanitizeText(getRequired(options, "prevention"), "prevention", 240),
    evidence: options.has("evidence")
      ? sanitizeText(getRequired(options, "evidence"), "evidence", 180)
      : undefined,
    sensitivity,
  }

  await ensureLearningDirectory()
  await appendFile(ENTRIES_FILE, `${JSON.stringify(entry)}\n`, "utf-8")
  await review(options, true)
  process.stdout.write(`已记录学习条目 ${entry.id}，并刷新活跃经验与晋升候选。\n`)
}

async function status(options: Map<string, string>): Promise<void> {
  const entries = await readEntries()
  const candidates = summarize(entries).filter(
    (candidate) => candidate.entries.length >= PROMOTION_THRESHOLD,
  )
  const typeCounts = [...ALLOWED_TYPES].map(
    (type) => `${type}: ${entries.filter((entry) => entry.type === type).length}`,
  )
  const activeDays = parsePositiveInt(options.get("active-days"), DEFAULT_ACTIVE_DAYS)

  process.stdout.write([
    `学习记录总数: ${entries.length}`,
    `晋升候选数: ${candidates.length}`,
    `活跃窗口: ${activeDays} 天`,
    `按类型: ${typeCounts.join("; ")}`,
    `记录路径: ${path.relative(ROOT, ENTRIES_FILE)}`,
  ].join("\n") + "\n")
}

async function main(): Promise<void> {
  const { command, options } = parseArgs(process.argv.slice(2))
  if (command === "record") {
    await record(options)
    return
  }
  if (command === "review") {
    await review(options, options.get("quiet") === "true")
    return
  }
  await status(options)
}

main().catch((error) => {
  process.stderr.write(`工作流学习工具失败: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
