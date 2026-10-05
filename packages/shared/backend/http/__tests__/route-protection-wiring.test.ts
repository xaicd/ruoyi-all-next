/**
 * 包装器级验证: 防护真的接在**请求流程里**，而不只是助手函数能用。
 *
 * 为什么必须有这一层: 助手单测全绿、但包装器忘了调用它们 —— 这种"接不上"照样是没防护。
 * 用 `optional: true` 免掉真实 token，直接驱动包装器。
 */
import { describe, it, expect, beforeEach } from "vitest"
import { withAppRoute } from "../app-route"
import { clearIdempotencyKeys } from "@/modules/shared/backend/lib/protection-idempotent"

function call(handler: (request: Request, auth: unknown) => Response, options: Parameters<typeof withAppRoute>[1], headers: Record<string, string> = {}) {
  const wrapped = withAppRoute(handler as never, { optional: true, ...options })
  return wrapped(new Request("http://localhost/api/v1/app/demo", { method: "POST", headers }))
}

describe("withAppRoute 的声明式防护（包装器级）", () => {
  beforeEach(() => clearIdempotencyKeys())

  it("未声明防护时行为不变（默认关闭）", async () => {
    const response = await call(() => new Response(JSON.stringify({ success: true }), { status: 200 }), {})
    expect(response.status).toBe(200)
  })

  it("★ 超限时包装器返回 429（证明规则真的接在流程里）", async () => {
    const handler = () => new Response(JSON.stringify({ success: true }), { status: 200 })
    const options = { rateLimit: { maxRequests: 1, windowSeconds: 60, dimension: "ip" as const } }
    const first = await call(handler, options, { "x-forwarded-for": "9.9.9.9" })
    expect(first.status).toBe(200)
    const second = await call(handler, options, { "x-forwarded-for": "9.9.9.9" })
    expect(second.status).toBe(429)
    expect(second.headers.get("Retry-After")).toBeTruthy()
  })

  it("★ 声明了幂等但缺 Idempotency-Key -> 400，且**业务未被调用**", async () => {
    let called = 0
    const response = await call(() => {
      called += 1
      return new Response("{}", { status: 200 })
    }, { idempotent: true })
    expect(response.status).toBe(400)
    expect(called).toBe(0)
  })

  it("★ 重复的 Idempotency-Key -> 409，第二次业务未被调用", async () => {
    let called = 0
    const handler = () => {
      called += 1
      return new Response("{}", { status: 200 })
    }
    const headers = { "idempotency-key": "w-1" }
    expect((await call(handler, { idempotent: true }, headers)).status).toBe(200)
    expect((await call(handler, { idempotent: true }, headers)).status).toBe(409)
    expect(called).toBe(1)
  })
})
