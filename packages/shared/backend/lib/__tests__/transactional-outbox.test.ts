import { afterEach, describe, expect, it } from "vitest"
import { eventBus } from "../event-bus"
import { natsPublish, resetNatsFabric } from "../nats-fabric"
import { resetNatsStream } from "../nats-stream"
import { broker, resetBroker } from "../service-broker"
import {
  failNextOutboxPublishes,
  listOutbox,
  outboxDispatch,
  resetOutbox,
  runUnitOfWork,
} from "../transactional-outbox"

describe("transactional outbox", () => {
  afterEach(() => {
    resetBroker()
    eventBus.clear()
    resetNatsFabric()
    resetNatsStream()
    resetOutbox()
  })

  it("discards staged events when the unit of work throws", async () => {
    const seen: string[] = []
    eventBus.subscribeReliable({
      pattern: "pay.order.paid",
      subscriber: "mall.order",
      handler: async (event) => {
        seen.push(event.eventId)
      },
    })
    await expect(runUnitOfWork(async (uow) => {
      uow.appendOutbox({ type: "pay.order.paid", source: "pay", payload: { id: "1" } })
      throw new Error("rollback")
    })).rejects.toThrow(/rollback/)
    expect(await listOutbox()).toHaveLength(0)
    expect(seen).toEqual([])
  })

  it("publishes after commit and dedupes the same consumer by eventId", async () => {
    const seen: string[] = []
    eventBus.subscribeReliable({
      pattern: "pay.order.paid",
      subscriber: "mall.order",
      handler: async (event) => {
        seen.push(event.eventId)
      },
    })
    const { eventIds } = await runUnitOfWork(async (uow) => {
      uow.appendOutbox({ type: "pay.order.paid", source: "pay", payload: { id: "1" } })
      return "ok"
    })
    expect(eventIds).toHaveLength(1)
    expect(await listOutbox("published")).toHaveLength(1)
    expect(seen).toEqual(eventIds)
    const published = (await listOutbox("published"))[0]
    await natsPublish(published.subject, {
      type: published.type,
      subject: published.subject,
      source: published.source,
      payload: published.payload,
      eventId: published.eventId,
      timestamp: published.createdAt,
    })
    expect(seen).toEqual(eventIds)
  })

  it("retries pending records after a dispatcher failure", async () => {
    const seen: string[] = []
    eventBus.subscribeReliable({
      pattern: "pay.order.paid",
      subscriber: "mall.order",
      handler: async (event) => {
        seen.push(event.eventId)
      },
    })
    failNextOutboxPublishes(1)
    await runUnitOfWork(async (uow) => {
      uow.appendOutbox({ type: "pay.order.paid", source: "pay", payload: { id: "2" } })
    })
    expect(await listOutbox("pending")).toHaveLength(1)
    expect(seen).toEqual([])
    expect(await outboxDispatch()).toBe(1)
    expect(await listOutbox("published")).toHaveLength(1)
    expect(seen).toHaveLength(1)
  })

  it("exposes publishReliable on the broker", async () => {
    const seen: string[] = []
    eventBus.subscribeReliable({
      pattern: "pay.order.paid",
      subscriber: "mall.order",
      handler: async () => {
        seen.push("mall")
      },
    })
    broker.start()
    await broker.publishReliable("pay.order.paid", { id: "3" }, "pay")
    expect(seen).toEqual(["mall"])
  })

  it("exposes the same transaction handle for domain writes and rolls it back together", async () => {
    await expect(runUnitOfWork(async (uow) => {
      expect(uow.db).toEqual({ driver: "memory" })
      uow.appendOutbox({ type: "pay.order.paid", source: "pay", payload: { id: "4" } })
      throw new Error("domain rollback")
    })).rejects.toThrow(/domain rollback/)
    expect(await listOutbox()).toHaveLength(0)
  })

  it("owns the outbox store by writing domain in stage A/B shared storage", async () => {
    const { getOutboxStoreForDomain, resolveOutboxOwnerDomain } = await import("../transactional-outbox")
    expect(resolveOutboxOwnerDomain("pay.order")).toBe("pay")
    expect(getOutboxStoreForDomain("pay")).toBe(getOutboxStoreForDomain("mall"))
    await runUnitOfWork(async (uow) => {
      uow.appendOutbox({ type: "pay.order.paid", source: "pay", payload: { id: "owner" } })
    }, { domain: "pay", dispatch: false })
    expect(await listOutbox("pending")).toHaveLength(1)
  })
})
