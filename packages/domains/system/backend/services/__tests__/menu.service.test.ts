import { afterEach, describe, expect, it, vi } from "vitest"
import { SystemMenuRepository } from "@/modules/system/backend/repositories/menu.repository"
import { SystemMenuService } from "../menu.service"

describe("SystemMenuService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates database failures instead of falling back to mock menus", async () => {
    vi.spyOn(SystemMenuRepository, "findAll").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemMenuService.list({ status: "ACTIVE" }),
    ).rejects.toThrow("db unavailable")
  })
})