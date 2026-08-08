/**
 * Kysely 多数据库客户端工厂
 *
 * 支持的驱动族：
 * - PostgreSQL 族（含 openGauss/KingbaseES）→ PostgresDialect
 * - MySQL 族（含 TiDB/OceanBase/MariaDB）→ MysqlDialect
 * - Memory（开发模式）→ DummyDriver（查询不执行，走内存 Repository）
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

function createDummyDialect() {
  return {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db: any) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  }
}

// === 驱动族映射 ===
const DRIVER_FAMILY: Record<DatabaseDriver, "pg" | "mysql" | "dummy"> = {
  postgresql: "pg",
  mysql: "mysql",
  mariadb: "mysql",
  tidb: "mysql",
  oceanbase: "mysql",
  opengauss: "pg",
  gaussdb: "pg",
  kingbase: "pg",
  sqlserver: "dummy",  // TODO: 添加 MSSQL dialect
  sqlite: "dummy",
  dm: "dummy",
  oracle: "dummy",
  memory: "dummy",
}

// === 全局单例 ===
let _kyselyInstance: Kysely<DB> | null = null

/**
 * 获取 Kysely 数据库实例（单例）
 *
 * 内存模式下使用 DummyDriver（查询不执行），
 * 业务数据通过 Repository 的内存实现提供。
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
