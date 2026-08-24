import { afterEach, describe, expect, it, vi } from "vitest"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemTenantPackageService } from "../tenant-package.service"

describe("SystemTenantPackageService", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("propagates database failures instead of falling back to mock packages", async () => {
    vi.spyOn(TenantPackageRepository, "findList").mockRejectedValueOnce(new Error("db unavailable"))

    await expect(
      SystemTenantPackageService.list({ page: 1, pageSize: 20 }),
    ).rejects.toThrow("db unavailable")
  })
})
