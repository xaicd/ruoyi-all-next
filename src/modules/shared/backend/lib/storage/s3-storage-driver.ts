/**
 * S3 兼容对象存储驱动 —— 生产/分布式。懒加载 @aws-sdk/client-s3（不装则不引入依赖）。
 * S3 协议同时覆盖 AWS S3 / MinIO / 阿里 OSS（S3 兼容端点）：仅换 endpoint / region / 凭证即可。
 *
 * 仅当 STORAGE_DRIVER=s3 时被选用。env：
 *   S3_BUCKET(必填) S3_ENDPOINT(MinIO/OSS 必填, AWS 可缺省) S3_REGION(缺省 us-east-1)
 *   S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY  S3_FORCE_PATH_STYLE(MinIO=true)
 *   S3_PUBLIC_BASE_URL(可选, 生成可访问 url 的前缀; 缺省用 endpoint/bucket 拼装)
 */
import type { PutFileInput, StorageDriver, StoredFile } from "./storage-driver"

export interface S3StorageConfig {
  bucket: string
  endpoint?: string
  region: string
  accessKeyId?: string
  secretAccessKey?: string
  forcePathStyle: boolean
  publicBaseUrl?: string
}

function safeKey(key: string): string {
  const normalized = key.replace(/^[/\\]+/, "").replace(/\\/g, "/")
  if (!normalized || normalized.includes("..")) throw new Error("文件路径不合法")
  return normalized
}

export class S3StorageDriver implements StorageDriver {
  readonly name = "s3" as const
  private client: any = null
  private ready: Promise<any> | null = null

  constructor(private readonly config: S3StorageConfig) {}

  private async conn(): Promise<any> {
    if (this.client) return this.client
    if (!this.ready) {
      this.ready = (async () => {
        let mod: any
        try {
          // @aws-sdk/client-s3 为可选依赖：仅 STORAGE_DRIVER=s3 时才需安装；未装时不影响 local 默认路径。
          // @ts-ignore optional peer dependency, resolved at runtime only
          mod = await import("@aws-sdk/client-s3")
        } catch {
          throw new Error("STORAGE_DRIVER=s3 需要安装依赖 @aws-sdk/client-s3（npm i @aws-sdk/client-s3）")
        }
        const { S3Client } = mod
        this.client = new S3Client({
          region: this.config.region,
          endpoint: this.config.endpoint || undefined,
          forcePathStyle: this.config.forcePathStyle,
          credentials:
            this.config.accessKeyId && this.config.secretAccessKey
              ? { accessKeyId: this.config.accessKeyId, secretAccessKey: this.config.secretAccessKey }
              : undefined,
        })
        this.client.__sdk = mod
        return this.client
      })()
    }
    return this.ready
  }

  resolveUrl(key: string): string {
    const k = safeKey(key)
    if (this.config.publicBaseUrl) return `${this.config.publicBaseUrl.replace(/\/+$/, "")}/${k}`
    const base = (this.config.endpoint || "").replace(/\/+$/, "")
    if (base) {
      return this.config.forcePathStyle ? `${base}/${this.config.bucket}/${k}` : `${base}/${k}`
    }
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${k}`
  }

  async put(input: PutFileInput): Promise<StoredFile> {
    const c = await this.conn()
    const { PutObjectCommand } = c.__sdk
    const key = safeKey(input.key)
    const body = Buffer.from(input.bytes)
    await c.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: body,
        ContentType: input.contentType || undefined,
      }),
    )
    return { path: key, url: this.resolveUrl(key), size: body.byteLength }
  }

  async delete(key: string): Promise<void> {
    const c = await this.conn()
    const { DeleteObjectCommand } = c.__sdk
    await c.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: safeKey(key) }))
  }

  async ping(): Promise<boolean> {
    try {
      const c = await this.conn()
      const { HeadBucketCommand } = c.__sdk
      await c.send(new HeadBucketCommand({ Bucket: this.config.bucket }))
      return true
    } catch {
      return false
    }
  }

  async dispose(): Promise<void> {
    if (this.client) {
      try {
        this.client.destroy?.()
      } catch {
        /* ignore */
      }
      this.client = null
      this.ready = null
    }
  }
}
