import { afterEach, describe, expect, it } from "vitest"
import { getCache, getCacheDriverName, resetCache } from "../cache-manager"
import { MemoryCacheDriver } from "../memory-cache-driver"

afterEach(async () => {
  delete process.env.CACHE_DRIVER
  await resetCache()
})

describe("cache manager 驱动选择", () => {
  it("默认 memory（本地零配置，类似 H2）", () => {
    expect(getCacheDriverName()).toBe("memory")
    expect(getCache().name).toBe("memory")
  })

  it("CACHE_DRIVER=redis 时选 redis 驱动（不实际连接）", async () => {
    await resetCache()
    process.env.CACHE_DRIVER = "redis"
    expect(getCacheDriverName()).toBe("redis")
    expect(getCache().name).toBe("redis")
  })

  it("单例：多次 getCache 同一实例", () => {
    expect(getCache()).toBe(getCache())
  })
})

describe("MemoryCacheDriver 行为", () => {
  it("set/get/delete/prefix/ttl", async () => {
    const c = new MemoryCacheDriver()
    await c.set("a:1", { v: 1 }, 60_000)
    await c.set("a:2", { v: 2 }, 60_000)
    await c.set("b:1", { v: 3 }, 60_000)
    expect(await c.get<{ v: number }>("a:1")).toEqual({ v: 1 })

    await c.delete("a:1")
    expect(await c.get("a:1")).toBeNull()

    await c.deletePrefix("a:")
    expect(await c.get("a:2")).toBeNull()
    expect(await c.get<{ v: number }>("b:1")).toEqual({ v: 3 })

    expect(await c.ping()).toBe(true)
  })

  it("TTL 过期返回 null", async () => {
    const c = new MemoryCacheDriver()
    await c.set("k", "v", 1) // 1ms
    await new Promise((r) => setTimeout(r, 5))
    expect(await c.get("k")).toBeNull()
  })
})
