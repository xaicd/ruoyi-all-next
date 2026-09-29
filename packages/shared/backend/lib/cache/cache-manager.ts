/**
 * 缓存管理器 —— 按 env 选驱动，对齐 DB 的 datasource-manager 哲学：
 *   CACHE_DRIVER = memory(默认，本地零配置) | redis
 *   redis 时读 REDIS_URL / CACHE_REDIS_URL（缺省 redis://127.0.0.1:6379）
 * 未配置时一律 memory：预览/开发零外部依赖即用；生产切 redis 业务代码不改。
 */
import type { CacheDriver, CacheDriverName } from "./cache-driver"
import { MemoryCacheDriver } from "./memory-cache-driver"
import { RedisCacheDriver } from "./redis-cache-driver"

let _instance: CacheDriver | null = null

export function getCacheDriverName(): CacheDriverName {
  const raw = (process.env.CACHE_DRIVER || "").toLowerCase()
  return raw === "redis" ? "redis" : "memory"
}

/** 获取当前缓存驱动（单例）。默认 memory（本地零配置）。 */
export function getCache(): CacheDriver {
  if (_instance) return _instance
  const name = getCacheDriverName()
  if (name === "redis") {
    const url = process.env.CACHE_REDIS_URL || process.env.REDIS_URL || "redis://127.0.0.1:6379"
    _instance = new RedisCacheDriver(url)
  } else {
    _instance = new MemoryCacheDriver()
  }
  return _instance
}

/** 测试/切换用：重置单例（下次 getCache 按当前 env 重建） */
export async function resetCache(): Promise<void> {
  if (_instance) await _instance.dispose().catch(() => {})
  _instance = null
}
