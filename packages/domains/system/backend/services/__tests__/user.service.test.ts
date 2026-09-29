import { afterEach, describe, expect, it, vi } from "vitest"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemUserService } from "../user.service"

describe("SystemUserService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates repository errors instead of falling back to mock data", async () => {
    vi.spyOn(SystemUserRepository, "findList").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemUserService.list({ page: 1, pageSize: 20, keyword: "" }),
    ).rejects.toThrow("db unavailable")
  })
})
