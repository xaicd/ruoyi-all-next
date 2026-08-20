import { afterEach, describe, expect, it } from "vitest"
import {
  natsPublish,
  natsRequest,
  natsStatus,
  natsSubscribe,
  resetNatsFabric,
} from "../nats-fabric"
import {
  natsStreamAck,
  natsStreamConsume,
  natsStreamPending,
  natsStreamPublish,
  resetNatsStream,
} from "../nats-stream"

describe("in-house NATS fabric", () => {
  afterEach(() => {
    resetNatsFabric()
    resetNatsStream()
  })

  it("does native request-reply through an inbox", async () => {
    natsSubscribe("ruoyi.cmd.pay.>", async (message) => {
      expect(message.headers["x-trace-id"]).toBe("t-1")
      return { pong: message.data }
    }, { queue: "ruoyi.pay" })
    const result = await natsRequest("ruoyi.cmd.pay.ping", { n: 1 }, { headers: { "x-trace-id": "t-1" }, timeoutMs: 500 })
    expect(result).toEqual({ pong: { n: 1 } })
    expect(natsStatus().driver).toBe("in-house")
  })

  it("load-balances queue groups and fans out independent subscribers", async () => {
    const seen: string[] = []
    natsSubscribe("ruoyi.evt.pay.>", async () => { seen.push("q1") }, { queue: "mall" })
    natsSubscribe("ruoyi.evt.pay.>", async () => { seen.push("q2") }, { queue: "mall" })
    natsSubscribe("ruoyi.evt.pay.>", async () => { seen.push("audit") })
    await natsPublish("ruoyi.evt.pay.order.paid", { id: 1 })
    expect(seen.filter((item) => item === "audit")).toHaveLength(1)
    expect(seen.filter((item) => item === "q1" || item === "q2")).toHaveLength(1)
  })

  it("rejects requests when no responders exist", async () => {
    await expect(natsRequest("ruoyi.cmd.pay.missing", {}, { timeoutMs: 50 })).rejects.toThrow(/NoResponders/)
  })

  it("redelivers unacked stream records", async () => {
    const seqNo = natsStreamPublish("ruoyi.evt.pay.order.paid", { id: 7 })
    expect(natsStreamPending("ruoyi.evt.pay.>")).toBe(1)
    await natsStreamConsume("ruoyi.evt.pay.>", async (record) => {
      expect(record.seq).toBe(seqNo)
    }, { redeliverUnacked: true })
    expect(natsStreamPending()).toBe(1)
    natsStreamAck(seqNo)
    expect(natsStreamPending()).toBe(0)
  })
})
