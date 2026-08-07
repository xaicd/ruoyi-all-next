import { afterEach, describe, expect, it, vi } from "vitest"
import { ruoyiPrisma } from "../@/modules/shared/backend/prisma"
import { SystemTenantService } from "../tenant.service"

describe("SystemTenantService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates database failures instead of falling back to mock tenants", async () => {
    vi.spyOn(ruoyiPrisma.tenant, "findMany").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemTenantService.list({ page: 1, pageSize: 20, keyword: "" }),
    ).rejects.toThrow("db unavailable")
  })
})
