import { describe, expect, it } from "vitest"
import { BpmProcessService } from "../bpm-process.service"

describe("BpmProcessService", () => {
  it("lists process definitions", async () => {
    const result = await BpmProcessService.listDefinitions({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("approves task", async () => {
    const result = await BpmProcessService.actionTask({ taskId: "task-001", action: "approve" })
    expect(result.status).toBe("DONE")
  })
})
