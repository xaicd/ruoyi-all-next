/**
 * 多数据库兼容 - 核心类型定义
 *
 * 支持的数据库：
 * Tier-A: PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, TiDB, OceanBase
 * Tier-B: openGauss, GaussDB, KingbaseES
 * Tier-C: 达梦 DM8, 神通, GBase, Oracle（通过专用连接器）
 */

// === 数据库驱动类型 ===
export type DatabaseDriver =
  | "postgresql"
  | "mysql"
  | "mariadb"
  | "sqlserver"
  | "sqlite"
  | "tidb"       // MySQL 兼容
  | "oceanbase"  // MySQL 兼容
  | "opengauss"  // PostgreSQL 兼容
  | "gaussdb"    // PostgreSQL 兼容
  | "kingbase"   // PostgreSQL 兼容
  | "dm"         // 达梦（Tier-C）
  | "oracle"     // Oracle（Tier-C）
  | "memory"     // 内存存储（开发/测试）

// === 兼容等级 ===
export type CompatibilityTier = "A" | "B" | "C"

// === 数据库协议族（决定 SQL 方言） ===
export type ProtocolFamily = "postgresql" | "mysql" | "sqlserver" | "sqlite" | "proprietary"

// === 数据源配置 ===
export type DataSourceConfig = {
  name: string
  driver: DatabaseDriver
  url: string
  tier: CompatibilityTier
  protocolFamily: ProtocolFamily
  poolSize?: number
  timezone?: string
}

// === 通用分页参数 ===
export type PageParams = {
  page: number
  pageSize: number
}

// === 通用分页结果 ===
export type PageResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// === 通用排序 ===
export type SortOrder = "asc" | "desc"
export type OrderBy = {
  field: string
  order: SortOrder
}

// === 通用 Where 条件 ===
export type WhereCondition = {
  field: string
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "notIn" | "isNull" | "isNotNull"
  value?: unknown
}

// === Repository 通用接口（所有域数据访问的基础契约） ===
export interface BaseRepository<T, CreateInput, UpdateInput> {
  findMany(params: {
    where?: WhereCondition[]
    orderBy?: OrderBy[]
    page: PageParams
  }): Promise<PageResult<T>>

  findById(id: string): Promise<T | null>

  create(input: CreateInput): Promise<T>

  update(id: string, input: UpdateInput): Promise<T>

  delete(id: string): Promise<void>

  count(where?: WhereCondition[]): Promise<number>
}
