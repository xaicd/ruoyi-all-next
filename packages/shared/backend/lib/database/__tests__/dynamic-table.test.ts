import { describe, expect, it } from "vitest"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { matchesMemory, sqlColumn, sqlTable } from "../dynamic-table"

describe("dynamic-table helpers", () => {
  it("rejects unsafe table and column identifiers", () => {
    expect(() => sqlTable("Demo_Widget")).toThrow(ApiError)
    expect(() => sqlTable("demo;drop")).toThrow(ApiError)
    expect(() => sqlColumn("1name")).toThrow(ApiError)
    expect(sqlTable("demo_widget")).toBeTruthy()
    expect(sqlColumn("tenant_id")).toBeTruthy()
  })

  it("applies memory query operators used by generated repositories", () => {
    expect(matchesMemory("Alpha", "alp", "LIKE")).toBe(true)
    expect(matchesMemory("Alpha", "beta", "LIKE")).toBe(false)
    expect(matchesMemory(3, [1, 3], "IN")).toBe(true)
    expect(matchesMemory(5, [1, 10], "BETWEEN")).toBe(true)
    expect(matchesMemory(4, 3, ">")).toBe(true)
    expect(matchesMemory("a", "a", "=")).toBe(true)
    expect(matchesMemory("a", undefined, "LIKE")).toBe(true)
  })
})
