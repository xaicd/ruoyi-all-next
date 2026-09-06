/**
 * 文件存储驱动抽象 —— 对齐 cache/database 的哲学：
 * 外部对象存储(S3/MinIO/OSS)必须有本地零配置兜底(本地磁盘)，且可 env 切换。
 *
 * 默认 local：写本地磁盘（FILE_STORAGE_DIR，缺省 .data/uploads），预览/开发零配置即用。
 * 生产 STORAGE_DRIVER=s3 + S3_* env：切对象存储，业务代码不改（S3 兼容协议同时覆盖 MinIO / 阿里 OSS / AWS S3）。
 *
 * 统一异步接口。key 为业务相对路径（如 config/1/logo.png）；url 为可访问地址。
 */

export type StorageDriverName = "local" | "s3"

export interface PutFileInput {
  /** 业务相对 key（不含前导斜杠、禁止 .. 越权） */
  key: string
  bytes: Uint8Array
  /** 可选 MIME 类型（对象存储写 Content-Type） */
  contentType?: string
}

export interface StoredFile {
  /** 规范化后的存储 key（相对路径） */
  path: string
  /** 可访问 URL */
  url: string
  /** 字节数 */
  size: number
}

export interface StorageDriver {
  readonly name: StorageDriverName
  /** 写入文件，返回规范化 key / url / size */
  put(input: PutFileInput): Promise<StoredFile>
  /** 删除文件；不存在时静默成功 */
  delete(key: string): Promise<void>
  /** 解析可访问 URL（不校验存在性） */
  resolveUrl(key: string): string
  /** 健康检查（local 恒 true；s3 探活 bucket） */
  ping(): Promise<boolean>
  dispose(): Promise<void>
}
