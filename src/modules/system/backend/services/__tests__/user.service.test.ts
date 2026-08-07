import { afterEach, describe, expect, it, vi } from "vitest"
import { ruoyiPrisma } from "../@/modules/shared/backend/prisma"
import { SystemUserService } from "../user.service"

describe("SystemUserService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates repository errors instead of falling back to mock data", async () => {
    vi.spyOn(ruoyiPrisma.admin, "findMany").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemUserService.list({ page: 1, pageSize: 20, keyword: "" }),
    ).rejects.toThrow("db unavailable")
  })
})
