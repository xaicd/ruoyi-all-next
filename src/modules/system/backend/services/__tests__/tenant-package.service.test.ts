import { afterEach, describe, expect, it, vi } from "vitest"
import { ruoyiPrisma } from "../../../../shared/backend/prisma"
import { SystemTenantPackageService } from "../tenant-package.service"

describe("SystemTenantPackageService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates database failures instead of falling back to mock packages", async () => {
    vi.spyOn(ruoyiPrisma.tenantPackage, "findMany").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemTenantPackageService.list({ page: 1, pageSize: 20, keyword: "" }),
    ).rejects.toThrow("db unavailable")
  })
})
