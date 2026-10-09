/**
 * 声明式分库分表引擎 (Declarative Sharding & Table Partitioning Engine)
 *
 * 核心功能：
 * 1. 声明式分片规则：哈希取模 (hash_mod)、时间范围 (time_range)、租户分片 (tenant)、自定义策略
 * 2. 智能路由解析：条件带分片键精准单表命中；不带分片键触发全片广播
 * 3. 跨分片聚合归并 (Scatter-Gather)：并发跨表查询、内存多维归并排序与分页切片
 */

import type { ShardingRule, ShardingQueryResult, OrderBy } from "./types"

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export class ShardingEngine {
  private rules = new Map<string, ShardingRule>()

  /** 注册分片规则 */
  registerRule(rule: ShardingRule): void {
    this.rules.set(rule.logicalTable, rule)
  }

  /** 获取指定逻辑表的分片规则 */
  getRule(logicalTable: string): ShardingRule | undefined {
    return this.rules.get(logicalTable)
  }

  /** 是否为分片表 */
  isShardingTable(logicalTable: string): boolean {
    return this.rules.has(logicalTable)
  }

  /** 根据分片键值计算具体物理表名 */
  resolvePhysicalTable(logicalTable: string, shardingValue: any): string {
    const rule = this.rules.get(logicalTable)
    if (!rule) return logicalTable
    return rule.resolveTable(shardingValue)
  }

  /** 解析所有物理表名 */
  resolveAllPhysicalTables(logicalTable: string): string[] {
    const rule = this.rules.get(logicalTable)
    if (!rule) return [logicalTable]
    return rule.resolveAllTables()
  }

  /** 根据查询条件推导目标物理表清单（单表路由 vs 全表广播） */
  routeTablesForQuery(
    logicalTable: string,
    conditions: Array<{ field: string; value?: unknown }>
  ): string[] {
    const rule = this.rules.get(logicalTable)
    if (!rule) return [logicalTable]

    const matchCond = conditions.find((c) => c.field === rule.shardingKey)
    if (matchCond && matchCond.value !== undefined && matchCond.value !== null) {
      return [rule.resolveTable(matchCond.value)]
    }

    return rule.resolveAllTables()
  }

  /**
   * 跨分片广播执行与归并聚合 (Scatter-Gather)
   */
  async executeScatterGather<T>(params: {
    logicalTable: string
    queryFn: (physicalTable: string) => Promise<T[]>
    orderBy?: OrderBy[]
    limit?: number
    offset?: number
  }): Promise<ShardingQueryResult<T>> {
    const tables = this.resolveAllPhysicalTables(params.logicalTable)
    
    // 并发散弹式查询所有物理分片
    const nestedResults = await Promise.all(tables.map((tbl) => params.queryFn(tbl)))
    let merged = nestedResults.flat()
    const total = merged.length

    // 内存多列归并排序
    if (params.orderBy && params.orderBy.length > 0) {
      merged.sort((a: any, b: any) => {
        for (const { field, order } of params.orderBy!) {
          const valA = a[field]
          const valB = b[field]
          if (valA === valB) continue
          const factor = order === "desc" ? -1 : 1
          if (valA > valB) return 1 * factor
          if (valA < valB) return -1 * factor
        }
        return 0
      })
    }

    // 分页切片
    const offset = params.offset ?? 0
    const limit = params.limit ?? merged.length
    const paged = merged.slice(offset, offset + limit)

    return { items: paged, total }
  }

  /** 重置所有规则（仅用于测试） */
  reset(): void {
    this.rules.clear()
  }
}

// === 常用分片规则工厂函数 ===

/** 创建哈希取模分片规则 */
export function createHashModShardingRule(options: {
  logicalTable: string
  shardingKey: string
  tableCount: number
}): ShardingRule {
  const { logicalTable, shardingKey, tableCount } = options
  const actualTables = Array.from({ length: tableCount }, (_, i) => `${logicalTable}_${i}`)

  return {
    logicalTable,
    shardingKey,
    strategy: "hash_mod",
    actualTables,
    resolveTable: (val: any) => {
      const numVal = typeof val === "number" ? Math.abs(val) : simpleHash(String(val))
      const idx = numVal % tableCount
      return `${logicalTable}_${idx}`
    },
    resolveAllTables: () => [...actualTables],
  }
}

/** 创建时间范围按月分片规则 */
export function createTimeMonthlyShardingRule(options: {
  logicalTable: string
  shardingKey: string
  months: string[] // 如 ['202601', '202602', '202603']
}): ShardingRule {
  const { logicalTable, shardingKey, months } = options
  const actualTables = months.map((m) => `${logicalTable}_${m}`)

  return {
    logicalTable,
    shardingKey,
    strategy: "time_range",
    actualTables,
    resolveTable: (val: any) => {
      let monthStr = ""
      if (val instanceof Date) {
        const y = val.getFullYear()
        const m = String(val.getMonth() + 1).padStart(2, "0")
        monthStr = `${y}${m}`
      } else {
        const s = String(val).replace(/[-/ :]/g, "")
        monthStr = s.substring(0, 6)
      }
      return `${logicalTable}_${monthStr}`
    },
    resolveAllTables: () => [...actualTables],
  }
}

// 导出单例与类（遵循 PascalCase + camelCase 规范）
export const shardingEngine = new ShardingEngine()
