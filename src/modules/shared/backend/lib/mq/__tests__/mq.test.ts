import { afterEach, describe, expect, it } from "vitest"
import { getMq, getMqDriverName, resetMq } from "../mq-manager"
import { MemoryMqDriver } from "../memory-mq-driver"

afterEach(async () => {
  delete process.env.MQ_DRIVER
  await resetMq()
})

describe("mq manager 驱动选择", () => {
  it("默认 memory（进程内零配置）", () => {
    expect(getMqDriverName()).toBe("memory")
    expect(getMq().name).toBe("memory")
  })

  it("MQ_DRIVER=redis 时选 redis 驱动（不实际连接）", async () => {
    await resetMq()
    process.env.MQ_DRIVER = "redis"
    expect(getMqDriverName()).toBe("redis")
    expect(getMq().name).toBe("redis")
  })

  it("单例：多次 getMq 同一实例", () => {
    expect(getMq()).toBe(getMq())
  })
})

describe("MemoryMqDriver 行为", () => {
  it("subscribe/publish 精确主题分发", async () => {
    const d = new MemoryMqDriver()
    const received: unknown[] = []
    await d.subscribe("order.created", (m) => {
      received.push(m.payload)
    })
    await d.publish({ topic: "order.created", payload: { id: 1 } })
    await d.publish({ topic: "order.paid", payload: { id: 2 } }) // 无订阅者，忽略
    expect(received).toEqual([{ id: 1 }])
    expect(await d.ping()).toBe(true)
  })

  it("多订阅者全部收到", async () => {
    const d = new MemoryMqDriver()
    let count = 0
    await d.subscribe("t", () => {
      count++
    })
    await d.subscribe("t", () => {
      count++
    })
    await d.publish({ topic: "t", payload: null })
    expect(count).toBe(2)
  })

  it("取消订阅后不再收到", async () => {
    const d = new MemoryMqDriver()
    let count = 0
    const unsub = await d.subscribe("t", () => {
      count++
    })
    await d.publish({ topic: "t", payload: null })
    unsub()
    await d.publish({ topic: "t", payload: null })
    expect(count).toBe(1)
  })

  it("dispose 清空订阅", async () => {
    const d = new MemoryMqDriver()
    let count = 0
    await d.subscribe("t", () => {
      count++
    })
    await d.dispose()
    await d.publish({ topic: "t", payload: null })
    expect(count).toBe(0)
  })
})
