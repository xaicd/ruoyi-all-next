import { describe, expect, it } from "vitest"
import { SystemTenantService } from "../system-tenant.service"
import { SystemTenantPackageService } from "../system-tenant-package.service"

describe("System tenant services", () => {
  it("lists tenants and tenant packages", async () => {
    const tenants = await SystemTenantService.list({ page: 1, pageSize: 20, keyword: "" })
    const packages = await SystemTenantPackageService.list({ page: 1, pageSize: 20, keyword: "" })

    expect(tenants.total).toBeGreaterThan(0)
    expect(packages.total).toBeGreaterThan(0)
  })

  it("supports keyword filtering", async () => {
    const tenants = await SystemTenantService.list({ page: 1, pageSize: 20, keyword: "山东" })
    const packages = await SystemTenantPackageService.list({ page: 1, pageSize: 20, keyword: "标准" })

    expect(tenants.items.length).toBeGreaterThan(0)
    expect(packages.items.length).toBeGreaterThan(0)
  })

  it("updates tenant status and package", async () => {
    const statusUpdated = await SystemTenantService.updateStatus("admin-1", {
      tenantId: "t-001",
      status: "DISABLED",
    })
    const packageUpdated = await SystemTenantService.assignPackage("admin-1", {
      tenantId: "t-001",
      packageId: "tp-002",
    })

    expect(statusUpdated.status).toBe("DISABLED")
    expect(packageUpdated.packageId).toBe("tp-002")
  })
})
