import { beforeEach, describe, expect, it } from "vitest"
import { acquireIdempotencyKey, clearIdempotencyKeys } from "../protection-idempotent"
import { clearLockQueue, withKeyedLock } from "../protection-lock"

describe("idempotent and lock libs", () => {
  beforeEach(() => {
    clearIdempotencyKeys()
    clearLockQueue()
  })

  it("blocks duplicated idempotency key", () => {
    expect(acquireIdempotencyKey("k1", 5000)).toBe(true)
    expect(acquireIdempotencyKey("k1", 5000)).toBe(false)
  })

  it("runs same-key tasks in order", async () => {
    const order: string[] = []

    const p1 = withKeyedLock("cfg", async () => {
      order.push("start-1")
      await new Promise((resolve) => setTimeout(resolve, 5))
      order.push("end-1")
    })

    const p2 = withKeyedLock("cfg", async () => {
      order.push("start-2")
      order.push("end-2")
    })

    await Promise.all([p1, p2])
    expect(order).toEqual(["start-1", "end-1", "start-2", "end-2"])
  })
})
