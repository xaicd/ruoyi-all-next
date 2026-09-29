import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

/**
 * 默认上传目录。
 *
 * 必须写成 `path.join(process.cwd(), ...)` 这种**静态可圈定**的形式，不能用相对字符串：
 * 相对值要到运行时才解析，Turbopack 无法确定范围，就会把**整个项目**纳入 file tracing
 * （Next 会明确警告 "Dynamic filesystem access causes tracing of the whole project"），
 * 构建图因此膨胀、构建时间从 ~45s 涨到数分钟，并可能在资源紧张时让 loader 子进程超时崩溃。
 * 行为不变：默认仍是 仓库根/.data/uploads。
 */
const DEFAULT_DIR = path.join(process.cwd(), ".data", "uploads")

export function resolveFileStorageDir() {
  return process.env.FILE_STORAGE_DIR ? path.resolve(process.env.FILE_STORAGE_DIR) : DEFAULT_DIR
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
