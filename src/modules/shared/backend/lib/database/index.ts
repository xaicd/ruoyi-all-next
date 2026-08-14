/**
 * 数据库基础设施统一入口
 */

export type { DB } from "./schema"
export type {
  DatabaseDriver,
  CompatibilityTier,
  ProtocolFamily,
  DataSourceConfig,
  PageParams,
  PageResult,
  OrderBy,
  SortOrder,
  WhereCondition,
  BaseRepository,
} from "./types"

export {
  getDataSourceConfig,
  assertProductionDataSourceConfiguration,
  isMemoryMode,
  getProtocolFamily,
  getCompatibilityTier,
  resetDataSourceConfig,
} from "./datasource-manager"

export {
  getKyselyDb,
  hasRealDatabase,
  destroyKyselyDb,
} from "./kysely-client"
