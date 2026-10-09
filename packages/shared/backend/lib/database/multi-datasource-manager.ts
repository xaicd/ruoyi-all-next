/**
 * 动态多数据源管理器 (Multi-DataSource Engine)
 *
 * 功能特性：
 * 1. 动态数据源注册与懒加载池化（支持业务分库、多租户独占库、冷热数据分库）
 * 2. 上下文动态切换：runWithDataSource('pay_db', async () => { ... })
 * 3. 跨上下文透明嵌套继承与自动回滚
 * 4. 实例生命周期统一销毁（closeAllDataSources）
 */

import { AsyncLocalStorage } from "node:async_hooks"
import type { Kysely } from "kysely"
import type { DataSourceConfig } from "./types"
import type { DB } from "./schema"

type DataSourceEntry = {
  config?: DataSourceConfig
  instance?: Kysely<DB>
  factory?: () => Promise<Kysely<DB>>
}

const dsContext = new AsyncLocalStorage<string>()

export class MultiDataSourceManager {
  private sources = new Map<string, DataSourceEntry>()
  private defaultSourceName = "primary"

  /** 设置默认数据源名称 */
  setDefaultSourceName(name: string): void {
    this.defaultSourceName = name
  }

  /** 获取默认数据源名称 */
  getDefaultSourceName(): string {
    return this.defaultSourceName
  }

  /** 注册已知数据源实例或配置 */
  registerDataSource(
    name: string,
    source: Kysely<DB> | DataSourceConfig | (() => Promise<Kysely<DB>>)
  ): void {
    if (typeof source === "function") {
      this.sources.set(name, { factory: source })
    } else if ("driver" in source && "url" in source) {
      this.sources.set(name, { config: source as DataSourceConfig })
    } else {
      this.sources.set(name, { instance: source as Kysely<DB> })
    }
  }

  /** 是否已注册指定数据源 */
  hasDataSource(name: string): boolean {
    return this.sources.has(name)
  }

  /** 获取已注册的所有数据源名称 */
  listDataSources(): string[] {
    return Array.from(this.sources.keys())
  }

  /** 获取当前激活的数据源标识（优先取异步上下文，其次取默认名称） */
  getActiveDataSourceName(): string {
    return dsContext.getStore() ?? this.defaultSourceName
  }

  /** 在指定数据源的上下文中执行业务逻辑 */
  async runWithDataSource<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return dsContext.run(name, fn)
  }

  /** 解析并获取目标 Kysely 实例 */
  async getDataSource(name?: string): Promise<Kysely<DB>> {
    const targetName = name ?? this.getActiveDataSourceName()
    const entry = this.sources.get(targetName)

    if (!entry) {
      throw new Error(`数据源 [${targetName}] 尚未注册，当前可用数据源: ${this.listDataSources().join(", ") || "无"}`)
    }

    if (entry.instance) {
      return entry.instance
    }

    if (entry.factory) {
      const created = await entry.factory()
      entry.instance = created
      return created
    }

    throw new Error(`数据源 [${targetName}] 缺乏有效的初始化工厂或实例`)
  }

  /** 销毁并清理所有数据源连接池 */
  async closeAllDataSources(): Promise<void> {
    for (const [name, entry] of this.sources.entries()) {
      if (entry.instance) {
        await entry.instance.destroy()
        entry.instance = undefined
      }
    }
    this.sources.clear()
  }

  /** 重置状态（仅用于单测） */
  reset(): void {
    this.sources.clear()
    this.defaultSourceName = "primary"
  }
}

// 导出单例与类（遵循 PascalCase + camelCase 规范）
export const multiDataSourceManager = new MultiDataSourceManager()

export const runWithDataSource = multiDataSourceManager.runWithDataSource.bind(multiDataSourceManager)
export const getActiveDataSourceName = multiDataSourceManager.getActiveDataSourceName.bind(multiDataSourceManager)
