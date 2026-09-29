/**
 * 存储管理器 —— 按 env 选驱动，对齐 cache 的 cache-manager 哲学：
 *   STORAGE_DRIVER = local(默认，本地磁盘零配置) | s3(S3/MinIO/OSS 兼容)
 * 未配置时一律 local：预览/开发零外部依赖即用；生产切 s3 业务代码不改。
 */
import type { StorageDriver, StorageDriverName } from "./storage-driver"
import { LocalStorageDriver } from "./local-storage-driver"
import { S3StorageDriver, type S3StorageConfig } from "./s3-storage-driver"

let _instance: StorageDriver | null = null

export function getStorageDriverName(): StorageDriverName {
  const raw = (process.env.STORAGE_DRIVER || "").toLowerCase()
  return raw === "s3" ? "s3" : "local"
}

function readS3Config(): S3StorageConfig {
  const bucket = process.env.S3_BUCKET || ""
  if (!bucket) throw new Error("STORAGE_DRIVER=s3 需要配置 S3_BUCKET")
  return {
    bucket,
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || "us-east-1",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || undefined,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || undefined,
    forcePathStyle: (process.env.S3_FORCE_PATH_STYLE || "").toLowerCase() === "true",
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL || undefined,
  }
}

/** 获取当前存储驱动（单例）。默认 local（本地磁盘零配置）。 */
export function getStorage(): StorageDriver {
  if (_instance) return _instance
  const name = getStorageDriverName()
  _instance = name === "s3" ? new S3StorageDriver(readS3Config()) : new LocalStorageDriver()
  return _instance
}

/** 测试/切换用：重置单例（下次 getStorage 按当前 env 重建） */
export async function resetStorage(): Promise<void> {
  if (_instance) await _instance.dispose().catch(() => {})
  _instance = null
}
