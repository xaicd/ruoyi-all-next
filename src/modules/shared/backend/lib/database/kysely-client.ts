/**
 * Kysely 多数据库客户端工厂
 *
 * 根据 DataSource 配置自动选择方言：
 * - PostgreSQL 族（含 openGauss/KingbaseES）→ PostgresDialect
 * - MySQL 族（含 TiDB/OceanBase/MariaDB）→ MysqlDialect
 * - SQLite → SqliteDialect
 * - SQL Server → MssqlDialect
 * - Memory（开发模式）→ 内存 SQLite
 *
 * 国产 Tier-C 数据库（达梦/神通/GBase）通过专用 Dialect 适配器扩展
 */

import { Kysely, DummyDriver, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely"
import { getDataSourceConfig, isMemoryMode } from "./datasource-manager"
import type { DatabaseDriver } from "./types"
import type { DB } from "./schema"

// === Dialect 工厂 ===

async function createPostgresDialect(url: string) {
  const { PostgresDialect } = await import("kysely")
  const pg = await import("pg")
  return new PostgresDialect({
    pool: new pg.default.Pool({ connectionString: url }),
  })
}

async function createMysqlDialect(url: string) {
  const { MysqlDialect } = await import("kysely")
  const mysql = await import("mysql2")
  return new MysqlDialect({
    pool: mysql.default.createPool(url),
  })
}

async function createSqliteDialect() {
  const { SqliteDialect } = await import("kysely")
  const BetterSqlite3 = await import("better-sqlite3")
  return new SqliteDialect({
    database: new BetterSqlite3.default(":memory:"),
  })
}

function createDummyDialect() {
  // 用于无真实 DB 的开发模式，搭配内存 Repository
  return {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db: any) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  }
}

// === 驱动族映射 ===
const DRIVER_FAMILY: Record<DatabaseDriver, "pg" | "mysql" | "sqlite" | "mssql" | "dummy"> = {
  postgresql: "pg",
  mysql: "mysql",
  mariadb: "mysql",
  tidb: "mysql",
  oceanbase: "mysql",
  opengauss: "pg",
  gaussdb: "pg",
  kingbase: "pg",
  sqlserver: "mssql",
  sqlite: "sqlite",
  dm: "dummy",     // Tier-C: 需专用连接器
  oracle: "dummy", // Tier-C: 需专用连接器
  memory: "dummy",
}

// === 全局单例 ===
let _kyselyInstance: Kysely<DB> | null = null

/**
 * 获取 Kysely 数据库实例（单例）
 * 开发模式下如果没有真实 DB，使用 DummyDriver（查询不会执行）
 * 业务层应通过 Repository 访问数据，不直接调用此实例
 */
export async function getKyselyDb(): Promise<Kysely<DB>> {
  if (_kyselyInstance) return _kyselyInstance

  const config = getDataSourceConfig()
  const family = DRIVER_FAMILY[config.driver] ?? "dummy"

  let dialect: any

  switch (family) {
    case "pg":
      dialect = await createPostgresDialect(config.url)
      break
    case "mysql":
      dialect = await createMysqlDialect(config.url)
      break
    case "sqlite":
      dialect = await createSqliteDialect()
      break
    case "mssql":
      // TODO: 添加 MSSQL dialect
      dialect = createDummyDialect()
      break
    default:
      dialect = createDummyDialect()
  }

  _kyselyInstance = new Kysely<DB>({ dialect })
  return _kyselyInstance
}

/**
 * 判断当前是否有真实数据库连接可用
 */
export function hasRealDatabase(): boolean {
  const config = getDataSourceConfig()
  const family = DRIVER_FAMILY[config.driver] ?? "dummy"
  return family !== "dummy" && !isMemoryMode()
}

/** 销毁连接（用于 shutdown） */
export async function destroyKyselyDb(): Promise<void> {
  if (_kyselyInstance) {
    await _kyselyInstance.destroy()
    _kyselyInstance = null
  }
}
