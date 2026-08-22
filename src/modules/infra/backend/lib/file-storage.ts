import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

const DEFAULT_DIR = ".data/uploads"

export function resolveFileStorageDir() {
  return path.resolve(process.env.FILE_STORAGE_DIR || DEFAULT_DIR)
}

function safeRelativeKey(key: string) {
  const normalized = key.replace(/^[/\\]+/, "").replace(/\\/g, "/")
  if (!normalized || normalized.includes("..") || path.isAbsolute(normalized)) throw new Error("文件路径不合法")
  return normalized
}

export function resolveStoredFilePath(key: string) {
  const relative = safeRelativeKey(key)
  const root = resolveFileStorageDir()
  const absolute = path.resolve(root, relative)
  if (!absolute.startsWith(root)) throw new Error("文件路径不合法")
  return { relative, absolute, url: `/uploads/${relative}` }
}

export async function putLocalFile(input: { key: string; bytes: Uint8Array }) {
  const stored = resolveStoredFilePath(input.key)
  await mkdir(path.dirname(stored.absolute), { recursive: true })
  await writeFile(stored.absolute, Buffer.from(input.bytes))
  return { path: stored.relative, url: stored.url, size: input.bytes.byteLength }
}

export async function deleteLocalFile(key: string) {
  const stored = resolveStoredFilePath(key)
  try {
    await unlink(stored.absolute)
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String((error as { code?: string }).code) : ""
    if (code !== "ENOENT") throw error
  }
}
