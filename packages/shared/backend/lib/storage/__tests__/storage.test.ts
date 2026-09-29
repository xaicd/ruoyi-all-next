import { rm } from "node:fs/promises"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { getStorage, getStorageDriverName, resetStorage } from "../storage-manager"
import { LocalStorageDriver } from "../local-storage-driver"

const TEST_DIR = ".data/uploads-storage-test"

afterEach(async () => {
  delete process.env.STORAGE_DRIVER
  delete process.env.FILE_STORAGE_DIR
  delete process.env.S3_BUCKET
  await resetStorage()
})

describe("storage manager 驱动选择", () => {
  it("默认 local（本地磁盘零配置）", () => {
    expect(getStorageDriverName()).toBe("local")
    expect(getStorage().name).toBe("local")
  })

  it("STORAGE_DRIVER=s3 时选 s3 驱动（配 S3_BUCKET，不实际连接）", async () => {
    await resetStorage()
    process.env.STORAGE_DRIVER = "s3"
    process.env.S3_BUCKET = "test-bucket"
    expect(getStorageDriverName()).toBe("s3")
    expect(getStorage().name).toBe("s3")
  })

  it("STORAGE_DRIVER=s3 缺 S3_BUCKET 时抛清晰错误", async () => {
    await resetStorage()
    process.env.STORAGE_DRIVER = "s3"
    expect(() => getStorage()).toThrow(/S3_BUCKET/)
  })

  it("单例：多次 getStorage 同一实例", () => {
    expect(getStorage()).toBe(getStorage())
  })
})

describe("LocalStorageDriver 行为", () => {
  beforeEach(() => {
    process.env.FILE_STORAGE_DIR = TEST_DIR
  })
  afterEach(async () => {
    await rm(path.resolve(TEST_DIR), { recursive: true, force: true })
  })

  it("put/resolveUrl/delete 与路径安全", async () => {
    const d = new LocalStorageDriver()
    const stored = await d.put({ key: "config/1/logo.png", bytes: Buffer.from("hello") })
    expect(stored.path).toBe("config/1/logo.png")
    expect(stored.url).toBe("/uploads/config/1/logo.png")
    expect(stored.size).toBe(5)
    expect(d.resolveUrl("config/1/logo.png")).toBe("/uploads/config/1/logo.png")
    expect(await d.ping()).toBe(true)

    await d.delete("config/1/logo.png")
    // 删除不存在的文件应静默成功
    await expect(d.delete("config/1/logo.png")).resolves.toBeUndefined()
  })

  it("拒绝越权路径 ..", async () => {
    const d = new LocalStorageDriver()
    await expect(d.put({ key: "../../etc/passwd", bytes: Buffer.from("x") })).rejects.toThrow(/不合法/)
  })
})
