/**
 * 本地磁盘存储驱动 —— 默认零配置。复用 infra/file-storage 的路径安全与读写实现，避免重复造轮子。
 * 写 FILE_STORAGE_DIR（缺省 .data/uploads），url 为 /uploads/<relative>。
 */
import type { PutFileInput, StorageDriver, StoredFile } from "./storage-driver"
import { deleteLocalFile, putLocalFile, resolveStoredFilePath } from "@/modules/infra/backend/lib/file-storage"

export class LocalStorageDriver implements StorageDriver {
  readonly name = "local" as const

  async put(input: PutFileInput): Promise<StoredFile> {
    return putLocalFile({ key: input.key, bytes: input.bytes })
  }

  async delete(key: string): Promise<void> {
    await deleteLocalFile(key)
  }

  resolveUrl(key: string): string {
    return resolveStoredFilePath(key).url
  }

  async ping(): Promise<boolean> {
    return true
  }

  async dispose(): Promise<void> {
    /* 本地磁盘无需释放资源 */
  }
}
