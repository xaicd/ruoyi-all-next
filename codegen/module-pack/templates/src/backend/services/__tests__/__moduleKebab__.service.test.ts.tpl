import { describe, expect, it } from "vitest"
import { {{modulePascal}}Service } from "@/modules/{{moduleKebab}}/backend/services"

describe("{{modulePascal}}Service", () => {
  it("lists {{featureListKebab}}", async () => {
    const result = await {{modulePascal}}Service.list{{featureListPascal}}({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })
})
