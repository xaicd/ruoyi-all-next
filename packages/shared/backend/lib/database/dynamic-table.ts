/**
 * 动态表访问（表驱动 codegen / 未进入静态 Kysely schema 的物理表）
 * 方言差异收敛在此，生成 Repository 只声明表名、列与过滤条件。
 */

import { sql, type RawBuilder } from "kysely"
import { ApiError } from "../../http/api-error"
import { getProtocolFamily } from "./datasource-manager"
import { getKyselyDb } from "./kysely-client"

const IDENTIFIER = /^[a-z][a-z0-9_]{0,63}$/

export type DynamicPersistScope = { tenantId?: string; actorId?: string }
export type DynamicQueryOperator = "=" | "!=" | "LIKE" | "IN" | ">" | ">=" | "<" | "<=" | "BETWEEN"

export function sqlTable(name: string) {
  if (!IDENTIFIER.test(name)) throw new ApiError("CONFLICT", "物理表标识无效")
  return sql.table(name)
}

export function sqlColumn(name: string) {
  if (!IDENTIFIER.test(name)) throw new ApiError("CONFLICT", "字段标识无效")
  return sql.ref(name)
}

export function mapDbRow(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]))
}

export function likePredicate(column: RawBuilder<unknown>, value: unknown): RawBuilder<unknown> {
  const pattern = `%${String(value)}%`
  if (getProtocolFamily() === "mysql") return sql`lower(${column}) like lower(${pattern})`
  return sql`lower(cast(${column} as varchar)) like lower(${pattern})`
}

export function comparePredicate(columnName: string, value: unknown, operator: DynamicQueryOperator): RawBuilder<unknown> | null {
  if (value === undefined || value === "") return null
  const column = sqlColumn(columnName)
  if (operator === "LIKE") return likePredicate(column, value)
  if (operator === "IN") {
    if (!Array.isArray(value) || value.length === 0) return sql`false`
    return sql`${column} in (${sql.join(value.map((item) => sql`${item as string | number | boolean | null}`))})`
  }
  if (operator === "BETWEEN") {
    if (!Array.isArray(value) || value.length !== 2) return sql`false`
    return sql`${column} between ${value[0] as string | number | boolean | null} and ${value[1] as string | number | boolean | null}`
  }
  const scalar = value as string | number | boolean | null
  if (operator === "!=") return sql`${column} <> ${scalar}`
  if (operator === ">") return sql`${column} > ${scalar}`
  if (operator === ">=") return sql`${column} >= ${scalar}`
  if (operator === "<") return sql`${column} < ${scalar}`
  if (operator === "<=") return sql`${column} <= ${scalar}`
  return sql`${column} = ${scalar}`
}

export function matchesMemory(value: unknown, expected: unknown, type: string): boolean {
  if (expected === undefined || expected === "") return true
  if (type === "LIKE") return String(value ?? "").toLowerCase().includes(String(expected).toLowerCase())
  if (type === "IN") return Array.isArray(expected) && expected.includes(value as never)
  const compare = (left: unknown, right: unknown) => {
    if (typeof left === "number" && typeof right === "number") return left - right
    if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right)
    if (typeof left === "string" && typeof right === "string") return left.localeCompare(right)
    return null
  }
  if (type === "BETWEEN") {
    if (!Array.isArray(expected) || expected.length !== 2) return false
    const lower = compare(value, expected[0])
    const upper = compare(value, expected[1])
    return lower !== null && upper !== null && lower >= 0 && upper <= 0
  }
  if (type === "!=") return value !== expected
  const result = compare(value, expected)
  if (type === ">") return result !== null && result > 0
  if (type === ">=") return result !== null && result >= 0
  if (type === "<") return result !== null && result < 0
  if (type === "<=") return result !== null && result <= 0
  return value === expected
}

function sqlValue(value: unknown) {
  return sql`${value as string | number | boolean | Date | null}`
}

export function alwaysTrue(): RawBuilder<unknown> {
  return sql`true`
}

export function eqColumn(column: string, value: unknown): RawBuilder<unknown> {
  return sql`${sqlColumn(column)} = ${value as string | number | boolean | null}`
}

export function joinAnd(predicates: RawBuilder<unknown>[]): RawBuilder<unknown> {
  return sql.join(predicates.length ? predicates : [alwaysTrue()], sql` and `)
}

export async function selectDynamicPage(input: {
  tableName: string
  where: RawBuilder<unknown>
  orderColumn: string
  page: number
  pageSize: number
}): Promise<{ items: Array<Record<string, unknown>>; total: number }> {
  const db = await getKyselyDb()
  const table = sqlTable(input.tableName)
  const totalRow = await sql<{ total: string }>`select count(*) as total from ${table} where ${input.where}`.execute(db)
  const rows = await sql<Record<string, unknown>>`select * from ${table} where ${input.where} order by ${sqlColumn(input.orderColumn)} desc offset ${(input.page - 1) * input.pageSize} limit ${input.pageSize}`.execute(db)
  return { items: rows.rows.map(mapDbRow), total: Number(totalRow.rows[0]?.total ?? 0) }
}

export async function selectDynamicById(tableName: string, id: string, where: RawBuilder<unknown>): Promise<Record<string, unknown> | null> {
  const db = await getKyselyDb()
  const result = await sql<Record<string, unknown>>`select * from ${sqlTable(tableName)} where ${sqlColumn("id")} = ${id} and ${where}`.execute(db)
  return result.rows[0] ? mapDbRow(result.rows[0]) : null
}

export async function existsDynamicRow(tableName: string, where: RawBuilder<unknown>): Promise<boolean> {
  const db = await getKyselyDb()
  const result = await sql<{ found: string }>`select 1 as found from ${sqlTable(tableName)} where ${where} limit 1`.execute(db)
  return Boolean(result.rows[0])
}

export async function insertDynamicRow(tableName: string, values: Record<string, unknown>): Promise<Record<string, unknown>> {
  const db = await getKyselyDb()
  const columns = Object.keys(values)
  const table = sqlTable(tableName)
  const columnList = sql.join(columns.map(sqlColumn))
  const valueList = sql.join(columns.map((column) => sqlValue(values[column])))
  if (getProtocolFamily() === "mysql") {
    await sql`insert into ${table} (${columnList}) values (${valueList})`.execute(db)
    const row = await selectDynamicById(tableName, String(values.id), sql`true`)
    if (!row) throw new ApiError("INTERNAL_ERROR", "写入后读取失败")
    return row
  }
  const result = await sql<Record<string, unknown>>`insert into ${table} (${columnList}) values (${valueList}) returning *`.execute(db)
  if (!result.rows[0]) throw new ApiError("INTERNAL_ERROR", "写入后读取失败")
  return mapDbRow(result.rows[0])
}

/**
 * **原子的列增减（带 guard）** —— 返回值是影响行数，即"成功与否"本身。
 *
 * 为什么必须有这个原语:"先查库存 → 判断够不够 → 再写"在并发下**两个请求会双双通过检查**，
 * 各自扣一次 —— 超卖。只有把条件写进**同一条 UPDATE** 才能保证正确:
 *
 *     UPDATE t SET col = col ± N WHERE <归属条件> AND <guard>
 *
 * 返回 0 行 = 条件不满足（并发下被别人先拿走了），调用方**必须据此报错**，
 * 不能当作成功，也不能回退成"那就无条件写吧"。
 *
 * 与 `updateDynamicRow` 的区别: 那个写的是**字面量**值，表达不了 `col = col - N`。
 */
export async function mutateColumnAtomic(
  tableName: string,
  column: string,
  delta: number,
  where: RawBuilder<unknown>,
): Promise<number> {
  if (!Number.isFinite(delta) || delta === 0) {
    throw new ApiError("VALIDATION_ERROR", `列增减量必须是非零有限数: ${delta}`)
  }
  const db = await getKyselyDb()
  const table = sqlTable(tableName)
  const columnRef = sqlColumn(column)
  const deltaSql = delta > 0 ? sql`+ ${sqlValue(delta)}` : sql`- ${sqlValue(Math.abs(delta))}`
  if (getProtocolFamily() === "mysql") {
    // MySQL 没有 returning，只能读影响行数
    const result = await sql`update ${table} set ${columnRef} = ${columnRef} ${deltaSql} where ${where}`.execute(db)
    return Number(result.numAffectedRows ?? 0)
  }
  // PostgreSQL: 用 returning + 行数。
  // **不能读 numAffectedRows** —— 那是 MySQL 的字段，PG 路径下是 undefined，
  // 会让本函数**永远返回 0**（= 每次都误判为"库存不足"）。这个坑是真实库用例抓到的，
  // 内存回退与类型检查都不会暴露。同文件的 updateDynamicRow 用的就是这个写法。
  const result = await sql<{ id: string }>`update ${table} set ${columnRef} = ${columnRef} ${deltaSql} where ${where} returning id`.execute(db)
  return result.rows.length
}

export async function updateDynamicRow(tableName: string, values: Record<string, unknown>, where: RawBuilder<unknown>): Promise<Record<string, unknown> | null> {
  const db = await getKyselyDb()
  const table = sqlTable(tableName)
  const assignments = sql.join(Object.entries(values).map(([column, value]) => sql`${sqlColumn(column)} = ${sqlValue(value)}`))
  if (getProtocolFamily() === "mysql") {
    const updated = await sql`update ${table} set ${assignments} where ${where}`.execute(db)
    if (!Number(updated.numAffectedRows ?? 0)) return null
    const row = await sql<Record<string, unknown>>`select * from ${table} where ${where}`.execute(db)
    return row.rows[0] ? mapDbRow(row.rows[0]) : null
  }
  const result = await sql<Record<string, unknown>>`update ${table} set ${assignments} where ${where} returning *`.execute(db)
  return result.rows[0] ? mapDbRow(result.rows[0]) : null
}

export async function deleteDynamicRow(tableName: string, where: RawBuilder<unknown>): Promise<boolean> {
  const db = await getKyselyDb()
  const result = await sql`delete from ${sqlTable(tableName)} where ${where}`.execute(db)
  return Number(result.numAffectedRows ?? 0) > 0
}
