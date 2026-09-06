/**
 * 缓存驱动抽象 —— 对齐数据库 datasource-manager 的哲学：
 * 外部依赖(Redis)必须有本地零配置兜底(内存，类似 H2 之于数据库)，且可 env 切换。
 *
 * 默认 memory：进程内，零配置，预览/开发即用。
 * 生产 CACHE_DRIVER=redis + REDIS_URL：切 Redis，业务代码不改。
 *
 * 统一异步接口（Redis 天然异步；memory 也返回 Promise 以保持一致）。
 * 注意：旧的同步 cache-store.ts API 保持不变、向下兼容；本抽象供需要可切换/分布式缓存的新路径使用。
 */

export type CacheDriverName = "memory" | "redis"

export interface CacheDriver {
  readonly name: CacheDriverName
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>
  delete(key: string): Promise<void>
  deletePrefix(prefix: string): Promise<void>
  clear(): Promise<void>
  /** 健康检查（Redis 探活；memory 恒 true） */
  ping(): Promise<boolean>
  dispose(): Promise<void>
}
