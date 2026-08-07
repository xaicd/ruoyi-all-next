import { createHash } from "node:crypto"

function md5(input: string) {
  return createHash("md5").update(input).digest("hex")
}

export function hashPasswordMD5(password: string, salt?: string) {
  return md5(`${password}${salt ?? ""}`)
}

export function comparePasswordMD5(password: string, hashed: string, salt?: string) {
  if (!hashed) return false
  const current = hashPasswordMD5(password, salt)
  return current.toLowerCase() === hashed.toLowerCase()
}
