import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseActionQuery } from "../parse-action-input"
import { payPageQuerySchema } from "@/modules/pay/backend/validators"

describe("parseActionQuery", () => {
  it("parses HTTP search params with the broker action schema", () => {
    const request = new Request("http://local.test/api/v1/admin/pay/orders?page=2&pageSize=10&keyword=demo")
    const input = parseActionQuery(payPageQuerySchema, request)
    expect(input).toMatchObject({ page: 2, pageSize: 10, keyword: "demo" })
  })

  it("rejects invalid query with the same schema broker uses", () => {
    const schema = z.object({ page: z.coerce.number().int().min(1) })
    const request = new Request("http://local.test/api/v1/admin/pay/orders?page=0")
    expect(() => parseActionQuery(schema, request)).toThrow()
  })
})
