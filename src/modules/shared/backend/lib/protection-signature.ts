import { createHash } from "node:crypto"

const SIGNATURE_TTL_MS = 5 * 60 * 1000

type SignatureHeaders = {
  signature: string
  timestamp: number
  nonce: string
}

function sign(payload: string, timestamp: number, nonce: string, secret: string) {
  return createHash("sha256")
    .update(`${timestamp}.${nonce}.${payload}.${secret}`)
    .digest("hex")
}

function readSignatureHeaders(headers: Headers): SignatureHeaders {
  const signature = headers.get("x-signature")?.trim() ?? ""
  const timestampRaw = headers.get("x-signature-timestamp")?.trim() ?? ""
  const nonce = headers.get("x-signature-nonce")?.trim() ?? ""

  const timestamp = Number(timestampRaw)
  if (!signature || !nonce || !Number.isFinite(timestamp)) {
    throw new Error("签名头缺失")
  }

  return { signature, timestamp, nonce }
}

export function verifyApiSignature(headers: Headers, payload: string, secret: string) {
  const { signature, timestamp, nonce } = readSignatureHeaders(headers)
  if (Math.abs(Date.now() - timestamp) > SIGNATURE_TTL_MS) {
    throw new Error("签名已过期")
  }

  const expected = sign(payload, timestamp, nonce, secret)
  if (expected !== signature) {
    throw new Error("签名校验失败")
  }
}

export function buildApiSignature(payload: string, timestamp: number, nonce: string, secret: string) {
  return sign(payload, timestamp, nonce, secret)
}
