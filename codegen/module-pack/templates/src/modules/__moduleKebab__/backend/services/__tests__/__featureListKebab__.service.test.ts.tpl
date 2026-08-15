import { describe, expect, it } from "vitest"
import { {{featureListPascal}}Service } from "../{{featureListKebab}}.service"

describe("{{featureListPascal}}Service", () => {
  it("creates, reads, pages, and deletes {{featureListKebab}}", async () => {
    const { id } = await {{featureListPascal}}Service.create({ name: "示例", status: "ACTIVE" })
    expect((await {{featureListPascal}}Service.get(id)).id).toBe(id)
    expect((await {{featureListPascal}}Service.page({ page: 1, pageSize: 20 })).items).toHaveLength(1)
    await expect({{featureListPascal}}Service.delete(id)).resolves.toBe(true)
  })
})
