import { describe, expect, it } from "vitest"
import { computeApiSignature, verifyApiSignature } from "../api-signature"
import { CryptoVault } from "../crypto-vault"

describe("接口安全套件测试（防篡改签名、防重放、AES-256 加解密）", () => {
  it("HMAC-SHA256 签名生成与正确校验通过", () => {
    const timestamp = Date.now()
    const nonce = "nonce-uuid-12345"
    const method = "POST"
    const path = "/api/v1/admin/pay/orders"
    const body = { orderNo: "ORD20260823001", amount: 100 }

    const sign = computeApiSignature({ method, path, timestamp, nonce, body })

    const headers = new Headers({
      "x-timestamp": String(timestamp),
      "x-nonce": nonce,
      "x-sign": sign,
    })

    const result = verifyApiSignature(headers, method, path, body)
    expect(result.success).toBe(true)
  })

  it("请求体被篡改时签名校验失败 (Anti-Tampering)", () => {
    const timestamp = Date.now()
    const nonce = "nonce-uuid-tamper-1"
    const method = "POST"
    const path = "/api/v1/admin/pay/orders"
    const originalBody = { orderNo: "ORD20260823001", amount: 100 }

    const sign = computeApiSignature({ method, path, timestamp, nonce, body: originalBody })

    const headers = new Headers({
      "x-timestamp": String(timestamp),
      "x-nonce": nonce,
      "x-sign": sign,
    })

    // 中间人篡改金额为 999999
    const tamperedBody = { orderNo: "ORD20260823001", amount: 999999 }
    const result = verifyApiSignature(headers, method, path, tamperedBody)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("INVALID_SIGNATURE")
    }
  })

  it("相同 Nonce 重复请求被判定为重放攻击拦截 (Anti-Replay)", () => {
    const timestamp = Date.now()
    const nonce = "nonce-uuid-replay-test"
    const method = "GET"
    const path = "/api/v1/admin/system/users"

    const sign = computeApiSignature({ method, path, timestamp, nonce })

    const headers = new Headers({
      "x-timestamp": String(timestamp),
      "x-nonce": nonce,
      "x-sign": sign,
    })

    const first = verifyApiSignature(headers, method, path)
    expect(first.success).toBe(true)

    // 第二次重放
    const second = verifyApiSignature(headers, method, path)
    expect(second.success).toBe(false)
    if (!second.success) {
      expect(second.code).toBe("REPLAY_ATTACK")
    }
  })

  it("超期请求被自动拒绝 (Anti-Expiration)", () => {
    const expiredTimestamp = Date.now() - 10 * 60 * 1000 // 10 分钟前
    const nonce = "nonce-uuid-expired"
    const method = "GET"
    const path = "/api/v1/admin/system/users"

    const sign = computeApiSignature({ method, path, timestamp: expiredTimestamp, nonce })

    const headers = new Headers({
      "x-timestamp": String(expiredTimestamp),
      "x-nonce": nonce,
      "x-sign": sign,
    })

    const result = verifyApiSignature(headers, method, path)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.code).toBe("EXPIRED")
    }
  })

  it("AES-256-GCM 敏感数据加密与安全解密完整闭环", () => {
    const payload = { apiKey: "sk-super-secret-production-key", tenantId: "tenant-001" }
    const cipherText = CryptoVault.encryptJson(payload)

    expect(cipherText).not.toContain("sk-super-secret")
    expect(cipherText.split(":")).toHaveLength(3)

    const decrypted = CryptoVault.decryptJson<typeof payload>(cipherText)
    expect(decrypted.apiKey).toBe(payload.apiKey)
    expect(decrypted.tenantId).toBe(payload.tenantId)
  })
})
