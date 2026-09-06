/**
 * 内存缓存驱动 —— 本地零配置(类似 H2)，预览/开发默认。进程内 Map + TTL 惰性清理。
 */
import type { CacheDriver } from "./cache-driver"

type Item = { value: unknown; expiresAt: number }

export class MemoryCacheDriver implements CacheDriver {
  readonly name = "memory" as const
  private store = new Map<string, Item>()

  private sweep(now: number) {
    for (const [k, it] of this.store.entries()) {
      if (it.expiresAt <= now) this.store.delete(k)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const now = Date.now()
    const it = this.store.get(key)
    if (!it) return null
    if (it.expiresAt <= now) {
      this.store.delete(key)
      return null
    }
    return it.value as T
  }

  async set<T>(key: string, value: T, ttlMs = 60_000): Promise<void> {
    const now = Date.now()
    this.sweep(now)
    this.store.set(key, { value, expiresAt: now + ttlMs })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async deletePrefix(prefix: string): Promise<void> {
    for (const k of this.store.keys()) {
      if (k.startsWith(prefix)) this.store.delete(k)
    }
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  async ping(): Promise<boolean> {
    return true
  }

  async dispose(): Promise<void> {
    this.store.clear()
  }
}
