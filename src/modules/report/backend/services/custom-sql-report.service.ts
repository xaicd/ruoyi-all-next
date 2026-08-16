import { createHash } from "node:crypto"
import { Client as PgClient } from "pg"
import mysql from "mysql2/promise"
import { Parser } from "node-sql-parser"
import { DataSourceConfigRepository } from "@/modules/infra/backend/repositories/data-source-config.repository"
import type { ExecuteCustomSqlReportInput } from "@/modules/report/backend/validators/custom-sql-report.validator"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { cryptoEngine } from "@/modules/shared/backend/lib/crypto-engine"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

const PG_DRIVERS = new Set(["postgresql", "opengauss", "gaussdb", "kingbase"])
const MYSQL_DRIVERS = new Set(["mysql", "mariadb", "tidb", "oceanbase"])
const QUERY_TIMEOUT_MS = 5_000
const parser = new Parser()

type SqlParameter = string | number | boolean | null
type ParsedSql = { sql: string; values: SqlParameter[] }
type QueryResult = { columns: string[]; rows: Array<Record<string, unknown>>; truncated: boolean; durationMs: number; maxRows: number }

function validationError(message: string): never {
  throw new ApiError("VALIDATION_ERROR", message)
}

type SelectAst = {
  type?: string
  with?: Array<{ stmt?: { type?: string; ast?: { type?: string } } }> | null
  into?: { type?: string; position?: string | null } | null
  lock?: unknown
}

/** Validate the submitted statement before connection credentials are decrypted. */
export function validateReadOnlySql(sql: string, driver: string): void {
  if (/--|\/\*|\*\//.test(sql)) validationError("SQL 不允许包含注释")
  if (/;/.test(sql)) validationError("仅允许执行一条 SQL，且不能使用分号")
  try {
    const ast = parser.astify(sql, { database: PG_DRIVERS.has(driver) ? "Postgresql" : "MySQL" }) as SelectAst | SelectAst[]
    if (Array.isArray(ast)) validationError("仅允许执行一条 SQL")
    if (ast.type !== "select") validationError("仅允许执行只读 SELECT 查询")
    if (ast.into?.type === "into" || ast.lock) validationError("不允许 SELECT INTO 或锁定查询")
    for (const cte of ast.with ?? []) {
      const cteType = cte.stmt?.type ?? cte.stmt?.ast?.type
      if (cteType !== "select") validationError("CTE 仅允许包含 SELECT 查询")
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    validationError("SQL 语法无效或不属于允许的只读查询")
  }
}

/** Compile only explicit :name placeholders; quoted text is never rewritten. */
export function compileNamedParameters(sql: string, parameters: Record<string, SqlParameter>, postgres: boolean): ParsedSql {
  const values: SqlParameter[] = []
  const used = new Set<string>()
  let output = ""
  let index = 0
  let quote: "'" | '"' | "`" | null = null

  while (index < sql.length) {
    const character = sql[index]
    if (quote) {
      output += character
      if (character === quote) {
        if (quote === "'" && sql[index + 1] === "'") { output += sql[index + 1]; index += 2; continue }
        quote = null
      }
      index += 1
      continue
    }
    if (character === "'" || character === '"' || character === "`") { quote = character; output += character; index += 1; continue }
    if (character === ":" && (sql[index - 1] === ":" || sql[index + 1] === ":")) { output += character; index += 1; continue }
    if (character === ":" && /[A-Za-z_]/.test(sql[index + 1] ?? "")) {
      const match = sql.slice(index + 1).match(/^[A-Za-z_][A-Za-z0-9_]*/)
      const name = match?.[0]
      if (!name || !Object.prototype.hasOwnProperty.call(parameters, name)) validationError(`缺少参数：${name ?? "未知"}`)
      values.push(parameters[name])
      used.add(name)
      output += postgres ? `$${values.length}` : "?"
      index += name.length + 1
      continue
    }
    output += character
    index += 1
  }

  for (const name of Object.keys(parameters)) if (!used.has(name)) validationError(`未使用的参数：${name}`)
  return { sql: output, values }
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === "bigint") return value.toString()
  if (Buffer.isBuffer(value)) return `[binary ${value.length} bytes]`
  return value
}

function normalizeRows(rows: Array<Record<string, unknown>>, maxRows: number) {
  const limited = rows.slice(0, maxRows)
  const columns = Array.from(new Set(limited.flatMap((row) => Object.keys(row))))
  return { columns, rows: limited.map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeValue(value)]))), truncated: rows.length > maxRows }
}

function addRowLimit(sql: string, maxRows: number, postgres: boolean): string {
  // Fetch one extra row so the UI can reliably report truncation. The parser has
  // already enforced a single read-only statement; wrapping preserves its result.
  return postgres
    ? `SELECT * FROM (${sql}) AS "_auto_report" LIMIT ${maxRows + 1}`
    : `SELECT * FROM (${sql}) AS _auto_report LIMIT ${maxRows + 1}`
}

async function runPostgres(config: { url: string; username: string; password: string }, query: ParsedSql, maxRows: number) {
  const url = new URL(config.url)
  const client = new PgClient({ host: url.hostname, port: url.port ? Number(url.port) : 5432, database: decodeURIComponent(url.pathname.replace(/^\//, "")) || undefined, user: config.username, password: config.password, connectionTimeoutMillis: QUERY_TIMEOUT_MS, query_timeout: QUERY_TIMEOUT_MS })
  try {
    await client.connect()
    await client.query("BEGIN READ ONLY")
    await client.query(`SET LOCAL statement_timeout = '${QUERY_TIMEOUT_MS}ms'`)
    const result = await client.query(addRowLimit(query.sql, maxRows, true), query.values)
    await client.query("ROLLBACK")
    return normalizeRows(result.rows as Array<Record<string, unknown>>, maxRows)
  } finally { await client.end().catch(() => undefined) }
}

async function runMysql(config: { url: string; username: string; password: string }, query: ParsedSql, maxRows: number) {
  const connection = await mysql.createConnection({ uri: config.url, user: config.username, password: config.password, connectTimeout: QUERY_TIMEOUT_MS, multipleStatements: false })
  try {
    await connection.query("SET SESSION TRANSACTION READ ONLY")
    await connection.beginTransaction()
    const [rows] = await connection.query({ sql: addRowLimit(query.sql, maxRows, false), values: query.values, timeout: QUERY_TIMEOUT_MS })
    await connection.rollback()
    if (!Array.isArray(rows)) return { columns: [], rows: [], truncated: false }
    return normalizeRows(rows as Array<Record<string, unknown>>, maxRows)
  } finally { await connection.end().catch(() => undefined) }
}

export class CustomSqlReportService {
  static async dataSources(tenantId: string) {
    const page = await DataSourceConfigRepository.findPage({ tenantId, page: 1, pageSize: 100 })
    return page.items.filter((item) => PG_DRIVERS.has(item.driver) || MYSQL_DRIVERS.has(item.driver)).map(({ id, name, driver }) => ({ id, name, driver }))
  }

  static async execute(tenantId: string, input: ExecuteCustomSqlReportInput): Promise<QueryResult> {
    const source = await DataSourceConfigRepository.findById(tenantId, input.dataSourceId)
    if (!source) throw new ApiError("NOT_FOUND", "数据源不存在或已删除")
    if (!PG_DRIVERS.has(source.driver) && !MYSQL_DRIVERS.has(source.driver)) validationError("该数据源类型暂不支持报表查询")
    validateReadOnlySql(input.sql, source.driver)
    const query = compileNamedParameters(input.sql, input.parameters, PG_DRIVERS.has(source.driver))
    const startedAt = performance.now()
    try {
      const output = PG_DRIVERS.has(source.driver)
        ? await runPostgres({ url: source.url, username: source.username, password: cryptoEngine.decrypt(source.encryptedPassword) }, query, input.maxRows)
        : await runMysql({ url: source.url, username: source.username, password: cryptoEngine.decrypt(source.encryptedPassword) }, query, input.maxRows)
      const result = { ...output, durationMs: Math.round(performance.now() - startedAt), maxRows: input.maxRows }
      domainLog.event("report.custom-sql.execute", { dataSourceId: source.id, driver: source.driver, rowCount: result.rows.length, truncated: result.truncated, durationMs: result.durationMs, sqlDigest: createHash("sha256").update(input.sql).digest("hex") })
      domainLog.audit("report.custom-sql.execute", { targetType: "INFRA_DATA_SOURCE_CONFIG", targetId: source.id, parameterCount: Object.keys(input.parameters).length, rowCount: result.rows.length, truncated: result.truncated, durationMs: result.durationMs })
      return result
    } catch (error) {
      if (error instanceof ApiError) throw error
      domainLog.audit("report.custom-sql.execute.failed", { targetType: "INFRA_DATA_SOURCE_CONFIG", targetId: source.id, parameterCount: Object.keys(input.parameters).length })
      throw new ApiError("DEPENDENCY_UNAVAILABLE", "数据源查询失败，请检查连接、只读权限或 SQL")
    }
  }
}
