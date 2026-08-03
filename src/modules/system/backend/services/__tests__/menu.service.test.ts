import { afterEach, describe, expect, it, vi } from "vitest"
import { ruoyiPrisma } from "../../../../shared/backend/prisma"
import { SystemMenuService } from "../menu.service"

describe("SystemMenuService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates database failures instead of falling back to mock menus", async () => {
    vi.spyOn(ruoyiPrisma.adminMenu, "findMany").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemMenuService.list({ page: 1, pageSize: 20, keyword: "" }),
    ).rejects.toThrow("db unavailable")
  })
})