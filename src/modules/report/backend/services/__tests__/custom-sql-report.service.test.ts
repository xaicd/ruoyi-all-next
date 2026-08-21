import { afterEach, describe, expect, it, vi } from "vitest"
import { infraPlatformFacade } from "@/modules/infra/contract/infra.platform.facade"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { CustomSqlReportService, compileNamedParameters, validateReadOnlySql } from "../custom-sql-report.service"

function expectValidation(action: () => unknown) {
  expect(action).toThrow(ApiError)
  try { action() } catch (error) { expect((error as ApiError).code).toBe("VALIDATION_ERROR") }
}

afterEach(() => vi.restoreAllMocks())

describe("CustomSqlReportService SQL safety", () => {
  it("allows one parameterized SELECT", () => {
    expect(() => validateReadOnlySql("SELECT id FROM users WHERE id = :id", "postgresql")).not.toThrow()
    expect(compileNamedParameters("SELECT id FROM users WHERE id = :id", { id: 7 }, true)).toEqual({ sql: "SELECT id FROM users WHERE id = $1", values: [7] })
  })

  it("does not replace a placeholder-looking quoted value or PostgreSQL cast", () => {
    expect(compileNamedParameters("SELECT ':literal', id FROM users WHERE id = :id", { id: 7 }, false)).toEqual({ sql: "SELECT ':literal', id FROM users WHERE id = ?", values: [7] })
    expect(compileNamedParameters("SELECT created_at::date FROM users WHERE id = :id", { id: 7 }, true)).toEqual({ sql: "SELECT created_at::date FROM users WHERE id = $1", values: [7] })
  })

  it("rejects writes, multi-statements, comments, SELECT INTO, and unused input", () => {
    for (const sql of ["DELETE FROM users", "SELECT 1; SELECT 2", "SELECT 1 -- hidden", "SELECT * INTO archive FROM users"]) expectValidation(() => validateReadOnlySql(sql, "postgresql"))
    expectValidation(() => compileNamedParameters("SELECT 1", { unexpected: "value" }, true))
    expectValidation(() => compileNamedParameters("SELECT * FROM users WHERE id = :id", {}, true))
  })

  it("always scopes datasource lookup to the current tenant", async () => {
    const list = vi.spyOn(infraPlatformFacade, "listQueryDataSources").mockResolvedValue({ success: true, data: [] } as Awaited<ReturnType<typeof infraPlatformFacade.listQueryDataSources>>)
    const conn = vi.spyOn(infraPlatformFacade, "getQueryConnection").mockResolvedValue({ success: true, data: null } as Awaited<ReturnType<typeof infraPlatformFacade.getQueryConnection>>)
    await CustomSqlReportService.dataSources("tenant-a")
    expect(list).toHaveBeenCalledWith({ tenantId: "tenant-a" }, expect.objectContaining({ caller: "report.custom-sql" }))
    await expect(CustomSqlReportService.execute("tenant-a", { dataSourceId: "tenant-b-source", sql: "SELECT 1", parameters: {}, maxRows: 1 })).rejects.toMatchObject({ code: "NOT_FOUND" })
    expect(conn).toHaveBeenCalledWith({ tenantId: "tenant-a", id: "tenant-b-source" }, expect.objectContaining({ caller: "report.custom-sql" }))
  })
})