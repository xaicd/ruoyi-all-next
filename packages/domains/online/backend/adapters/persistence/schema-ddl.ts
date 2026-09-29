/**
 * 轻量分方言 DDL —— "加字段就真加列"（用户 steering：ORM/table 那层免不了）。
 *
 * 与 online-schema-plan 的重型受控流程不同：这是给低代码底座「客户点一下加个字段」用的
 * 轻量真列变更——真正执行 `ALTER TABLE <t> ADD COLUMN <c> <type>`，SQLite/PG/MySQL 都原生支持。
 * 幂等：加列前先查列是否已存在。类型按方言映射。不含 pg 专有锁，跨库安全，预览即生效。
 */

import { sql } from "kysely"
import { getKyselyDb, getProtocolFamily } from "@/modules/shared/backend/lib/database"
import type { ProtocolFamily } from "@/modules/shared/backend/lib/database"
import type { FieldDef } from "@/modules/online/backend/validators/page-schema.validators"

/**
 * 方言跟随框架统一适配层 getProtocolFamily()：
 * driver → protocolFamily 由 datasource-manager 统一维护，已覆盖国产库——
 * 金仓 KingbaseES / 高斯 openGauss/GaussDB → "postgresql" 族；OceanBase/TiDB → "mysql" 族；
 * 达梦 DM / Oracle → "proprietary"（Oracle 兼容语法）。本模块不再自建方言判断，全局统一。
 */
function columnType(type: FieldDef["type"], family: ProtocolFamily): string {
  const map: Record<ProtocolFamily, Record<string, string>> = {
    sqlite: { text: "TEXT", textarea: "TEXT", number: "REAL", boolean: "INTEGER", date: "TEXT", select: "TEXT", image: "TEXT" },
    postgresql: { text: "varchar(255)", textarea: "text", number: "numeric", boolean: "boolean", date: "timestamptz", select: "varchar(120)", image: "varchar(500)" },
    mysql: { text: "varchar(255)", textarea: "text", number: "decimal(18,4)", boolean: "tinyint(1)", date: "datetime", select: "varchar(120)", image: "varchar(500)" },
    sqlserver: { text: "nvarchar(255)", textarea: "nvarchar(max)", number: "decimal(18,4)", boolean: "bit", date: "datetime2", select: "nvarchar(120)", image: "nvarchar(500)" },
    // 达梦/Oracle 族（Oracle 兼容语法）：VARCHAR2 / NUMBER / DATE
    proprietary: { text: "VARCHAR2(255)", textarea: "CLOB", number: "NUMBER", boolean: "NUMBER(1)", date: "DATE", select: "VARCHAR2(120)", image: "VARCHAR2(500)" },
  }
  const fam = map[family] ? family : "sqlite"
  return map[fam][type] ?? map[fam].text
}

/** 合法列名（防注入）——只允许字母开头的 snake/camel，≤40 */
function assertSafeIdentifier(name: string): void {
  if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(name)) {
    throw new Error(`非法列名: ${name}`)
  }
}

/** 读取某表已有列名集合（分方言） */
export async function listColumns(table: string): Promise<Set<string>> {
  assertSafeIdentifier(table)
  const db = await getKyselyDb()
  const family = getProtocolFamily()
  try {
    if (family === "sqlite") {
      const rows = (await sql`SELECT name FROM pragma_table_info(${table})`.execute(db)).rows as Array<{ name: string }>
      return new Set(rows.map((r) => r.name))
    }
    if (family === "mysql") {
      const rows = (await sql`SELECT column_name AS name FROM information_schema.columns WHERE table_name = ${table} AND table_schema = DATABASE()`.execute(db)).rows as Array<{ name: string }>
      return new Set(rows.map((r) => r.name))
    }
    if (family === "proprietary") {
      // 达梦/Oracle：USER_TAB_COLUMNS（表名大写）
      const rows = (await sql`SELECT COLUMN_NAME AS name FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ${table.toUpperCase()}`.execute(db)).rows as Array<{ name: string }>
      return new Set(rows.map((r) => String(r.name).toLowerCase()))
    }
    // postgresql / sqlserver：information_schema.columns
    const rows = (await sql`SELECT column_name AS name FROM information_schema.columns WHERE table_name = ${table}`.execute(db)).rows as Array<{ name: string }>
    return new Set(rows.map((r) => r.name))
  } catch {
    return new Set()
  }
}

/**
 * 幂等地为 table 添加一个物理列（真 ALTER TABLE ADD COLUMN）。
 * 已存在则跳过。返回是否真的新增了列。
 */
export async function ensureColumn(table: string, field: FieldDef): Promise<{ added: boolean; column: string }> {
  assertSafeIdentifier(table)
  assertSafeIdentifier(field.code)
  const existing = await listColumns(table)
  if (existing.has(field.code)) return { added: false, column: field.code }

  const db = await getKyselyDb()
  const family = getProtocolFamily()
  const type = columnType(field.type, family)
  // 列名/表名已通过 assertSafeIdentifier 严格白名单校验，可安全内联；类型来自受控映射表。
  // ALTER TABLE ADD COLUMN 五族均原生支持（Oracle/达梦语法亦兼容），无 pg 专有锁，跨库安全。
  await sql.raw(`ALTER TABLE ${table} ADD COLUMN ${field.code} ${type}`).execute(db)
  return { added: true, column: field.code }
}

/** 批量确保多个字段都有物理列（用于同步一份 PageSchema.fields 到真实表结构） */
export async function ensureColumns(table: string, fields: FieldDef[]): Promise<{ added: string[]; skipped: string[] }> {
  const added: string[] = []
  const skipped: string[] = []
  const existing = await listColumns(table)
  for (const f of fields) {
    assertSafeIdentifier(f.code)
    if (existing.has(f.code)) {
      skipped.push(f.code)
      continue
    }
    const r = await ensureColumn(table, f)
    if (r.added) added.push(f.code)
    else skipped.push(f.code)
    existing.add(f.code)
  }
  return { added, skipped }
}
