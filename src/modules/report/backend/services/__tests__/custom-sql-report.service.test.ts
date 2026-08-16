import { afterEach, describe, expect, it, vi } from "vitest"
import { DataSourceConfigRepository } from "@/modules/infra/backend/repositories/data-source-config.repository"
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
    const page = vi.spyOn(DataSourceConfigRepository, "findPage").mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 100 })
    const source = vi.spyOn(DataSourceConfigRepository, "findById").mockResolvedValue(null)
    await CustomSqlReportService.dataSources("tenant-a")
    expect(page).toHaveBeenCalledWith({ tenantId: "tenant-a", page: 1, pageSize: 100 })
    await expect(CustomSqlReportService.execute("tenant-a", { dataSourceId: "tenant-b-source", sql: "SELECT 1", parameters: {}, maxRows: 1 })).rejects.toMatchObject({ code: "NOT_FOUND" })
    expect(source).toHaveBeenCalledWith("tenant-a", "tenant-b-source")
  })
})