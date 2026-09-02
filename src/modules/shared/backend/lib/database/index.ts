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

export {
  sqlTable,
  sqlColumn,
  mapDbRow,
  likePredicate,
  comparePredicate,
  matchesMemory,
  alwaysTrue,
  eqColumn,
  joinAnd,
  selectDynamicPage,
  selectDynamicById,
  existsDynamicRow,
  insertDynamicRow,
  updateDynamicRow,
  deleteDynamicRow,
} from "./dynamic-table"
export type { DynamicPersistScope, DynamicQueryOperator } from "./dynamic-table"

export {
  QueryWrapper,
  BaseMapper,
  BaseService
} from "./base-mapper"
export type { QueryCondition, OrderItem, QueryOperator } from "./base-mapper"

