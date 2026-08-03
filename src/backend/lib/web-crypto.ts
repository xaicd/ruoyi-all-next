import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"

function resolveKey(secret: string) {
  return createHash("sha256").update(secret).digest()
}

export function encryptApiPayload(payload: unknown, secret: string) {
  const iv = randomBytes(12)
  const key = resolveKey(secret)
  const cipher = createCipheriv("aes-256-gcm", key, iv)

  const plain = JSON.stringify(payload)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  }
}

export function decryptApiPayload(
  payload: { iv: string; tag: string; data: string },
  secret: string,
) {
  const key = resolveKey(secret)
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"))
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "base64")),
    decipher.final(),
  ])

  return JSON.parse(decrypted.toString("utf8")) as unknown
}

export function shouldEncryptResponse(headers: Headers) {
  return headers.get("x-api-encrypt") === "1"
}
