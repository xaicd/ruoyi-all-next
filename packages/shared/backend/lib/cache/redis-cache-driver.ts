/**
 * Redis 缓存驱动 —— 生产/分布式。懒加载 ioredis（不装则不引入依赖）。
 * 仅当 CACHE_DRIVER=redis 时被选用；值以 JSON 序列化存储，前缀删除用 SCAN（非阻塞）。
 */
import type { CacheDriver } from "./cache-driver"

export class RedisCacheDriver implements CacheDriver {
  readonly name = "redis" as const
  private client: any = null
  private ready: Promise<any> | null = null

  constructor(private readonly url: string) {}

  private async conn(): Promise<any> {
    if (this.client) return this.client
    if (!this.ready) {
      this.ready = (async () => {
        // 懒加载：未安装 ioredis 时给出清晰报错，不影响 memory 默认路径
        let IORedis: any
        try {
          // ioredis 为可选依赖：仅 CACHE_DRIVER=redis 时才需要安装；未装时不影响 memory 默认路径。
          // @ts-ignore optional peer dependency, resolved at runtime only
          IORedis = (await import("ioredis")).default
        } catch {
          throw new Error("CACHE_DRIVER=redis 需要安装依赖 ioredis（npm i ioredis）")
        }
        this.client = new IORedis(this.url, { lazyConnect: false, maxRetriesPerRequest: 2 })
        return this.client
      })()
    }
    return this.ready
  }

  async get<T>(key: string): Promise<T | null> {
    const c = await this.conn()
    const raw = await c.get(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  }

  async set<T>(key: string, value: T, ttlMs = 60_000): Promise<void> {
    const c = await this.conn()
    const raw = JSON.stringify(value)
    if (ttlMs > 0) await c.set(key, raw, "PX", ttlMs)
    else await c.set(key, raw)
  }

  async delete(key: string): Promise<void> {
    const c = await this.conn()
    await c.del(key)
  }

  async deletePrefix(prefix: string): Promise<void> {
    const c = await this.conn()
    let cursor = "0"
    do {
      const [next, keys] = await c.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 200)
      cursor = next
      if (keys.length) await c.del(...keys)
    } while (cursor !== "0")
  }

  async clear(): Promise<void> {
    // 不做 FLUSHALL（危险）；生产环境清缓存请按前缀。此处 no-op + 提示。
    // 如需全清可显式调用 deletePrefix 指定业务前缀。
  }

  async ping(): Promise<boolean> {
    try {
      const c = await this.conn()
      return (await c.ping()) === "PONG"
    } catch {
      return false
    }
  }

  async dispose(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit()
      } catch {
        /* ignore */
      }
      this.client = null
      this.ready = null
    }
  }
}
