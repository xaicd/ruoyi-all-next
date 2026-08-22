/**
 * InfraFile Service - 文件管理
 */

import { InfraFileRepository } from "@/modules/infra/backend/repositories/file.repository"
import { deleteLocalFile, putLocalFile } from "@/modules/infra/backend/lib/file-storage"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class InfraFileService {
  static async list(input: any) {
    const result = await InfraFileRepository.findList(input)
    domainLog.event("infra.file.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const file = await InfraFileRepository.findById(id)
    if (!file) throw new Error(`文件不存在: ${id}`)
    return file
  }

  /** 记录文件上传；带 contentBase64 时写入本地存储 */
  static async recordUpload(input: { configId: string; name?: string; path: string; url: string; type?: string; size: number; contentBase64?: string }) {
    let path = input.path
    let url = input.url
    let size = input.size
    if (input.contentBase64) {
      const stored = await putLocalFile({ key: input.path, bytes: Buffer.from(input.contentBase64, "base64") })
      path = stored.path
      url = stored.url
      size = stored.size
    }
    const file = await InfraFileRepository.create({ configId: input.configId, name: input.name, path, url, type: input.type, size })
    domainLog.event("infra.file.upload", { fileId: file.id, name: file.name, size: file.size })
    domainLog.audit("infra.file.upload", { targetType: "FILE", targetId: file.id })
    return file
  }

  static async delete(id: string) {
    const file = await InfraFileRepository.findById(id)
    if (!file) throw new Error(`文件不存在: ${id}`)
    await deleteLocalFile(file.path)
    await InfraFileRepository.delete(id)
    domainLog.event("infra.file.delete", { fileId: id, path: file.path })
    domainLog.audit("infra.file.delete", { targetType: "FILE", targetId: id })
    return { success: true }
  }

  static async getFile(input: { id: string }) { return this.getById(input.id) }
  static async deleteFile(input: { id: string }) { return this.delete(input.id) }
}
