import { afterEach, describe, expect, it } from "vitest"
import { z } from "zod"
import { registerService } from "../broker-invoke"
import { configureBrokerResilience } from "../broker-resilience"
import { registerActionSchema } from "../broker-validator"
import { eventBus } from "../event-bus"
import { broker, resetBroker } from "../service-broker"
import { serviceBus } from "../service-bus"

describe("moleculer-style broker governance", () => {
  afterEach(() => {
    resetBroker()
    eventBus.clear()
  })

  it("starts a node registry of local domain services", async () => {
    broker.start()
    expect(broker.nodeID).toBe("all-next")
    expect(await broker.waitForServices(["pay", "mall"], 200)).toBe(true)
    expect(broker.getRegistry().services.some((service) => service.name === "pay" && service.local)).toBe(true)
    expect((broker.ping("all-next") as { available: boolean }).available).toBe(true)
  })

  it("calls actions with fallback, metrics and middleware", async () => {
    const seen: string[] = []
    broker.useMiddleware({
      name: "trace",
      before: (ctx) => {
        seen.push(`before:${ctx.action}`)
      },
    })
    registerService("pay", async (method) => {
      if (method === "ping") return { pong: true }
      throw new Error("boom")
    })
    broker.start()
    const ok = await broker.call("pay.ping", {})
    expect(ok.success).toBe(true)
    expect(ok.data).toEqual({ pong: true })
    expect(seen).toEqual(["before:pay.ping"])

    const fallback = await broker.call("pay.missing", {}, { fallbackResponse: () => ({ degraded: true }) })
    expect(fallback.success).toBe(true)
    expect(fallback.fallback).toBe(true)
    expect(broker.getMetrics().fallbacks).toBe(1)
  })

  it("isolates concurrency with bulkhead", async () => {
    configureBrokerResilience({ bulkhead: { concurrency: 1, maxQueueSize: 0 } })
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    registerService("pay", async (method) => {
      if (method === "hold") {
        await gate
        return "done"
      }
      return "ok"
    })
    broker.start()
    const pending = broker.call("pay.hold", {})
    await new Promise((resolve) => setTimeout(resolve, 20))
    const rejected = await broker.call("pay.hold", {})
    expect(rejected.success).toBe(false)
    expect(rejected.error).toMatch(/QueueIsFull/)
    release()
    expect((await pending).success).toBe(true)
  })

  it("emits to one subscriber group and broadcasts to all", async () => {
    const seen: string[] = []
    eventBus.subscribe({ pattern: "pay.order.paid", subscriber: "mall.a", handler: async () => { seen.push("a") } })
    eventBus.subscribe({ pattern: "pay.order.paid", subscriber: "mall.b", handler: async () => { seen.push("b") } })
    eventBus.subscribe({ pattern: "pay.order.paid", subscriber: "audit.logger", handler: async () => { seen.push("audit") } })
    broker.start()
    await broker.emit("pay.order.paid", { id: "1" }, "pay")
    expect(seen.filter((item) => item === "audit")).toHaveLength(1)
    expect(seen.filter((item) => item === "a" || item === "b")).toHaveLength(1)
    seen.length = 0
    await broker.broadcast("pay.order.paid", { id: "2" }, "pay")
    expect(seen.sort()).toEqual(["a", "audit", "b"])
  })

  it("keeps the serviceBus facade on the broker", async () => {
    const result = await serviceBus.call({ service: "unknown", method: "ping", caller: "mall" })
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Unknown domain/)
  })

  it("validates action params with zod schemas", async () => {
    registerActionSchema("pay.ping", z.object({ n: z.number() }))
    registerService("pay", async () => ({ pong: true }))
    broker.start()
    const rejected = await broker.call("pay.ping", { n: "x" })
    expect(rejected.success).toBe(false)
    expect(rejected.error).toMatch(/ValidationError/)
    const ok = await broker.call("pay.ping", { n: 1 })
    expect(ok.success).toBe(true)
  })

  it("caches safe action results through cache-store", async () => {
    let hits = 0
    registerService("pay", async () => {
      hits += 1
      return { pong: hits }
    })
    broker.start()
    const first = await broker.call("pay.ping", { n: 1 }, { cache: true })
    const second = await broker.call("pay.ping", { n: 1 }, { cache: true })
    expect(first.success).toBe(true)
    expect(second.cached).toBe(true)
    expect(second.data).toEqual(first.data)
    expect(hits).toBe(1)
  })
})
