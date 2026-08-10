import { SystemPostRepository } from "@/modules/system/backend/repositories/post.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class SystemPostService {
  static async list(input: any) {
    const result = await SystemPostRepository.findList(input)
    domainLog.event("system.post.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const post = await SystemPostRepository.findById(id)
    if (!post) throw new Error(`岗位不存在: ${id}`)
    return post
  }

  static async create(input: any) {
    const existing = await SystemPostRepository.findByCode(input.code)
    if (existing) throw new Error(`岗位编码已存在: ${input.code}`)
    const post = await SystemPostRepository.create(input)
    domainLog.event("system.post.create", { postId: post.id })
    domainLog.audit("system.post.create", { targetType: "POST", targetId: post.id })
    return { id: post.id }
  }

  static async update(input: { id: string; name?: string; code?: string; sort?: number; status?: string; remark?: string }) {
    const existing = await SystemPostRepository.findById(input.id)
    if (!existing) throw new Error(`岗位不存在: ${input.id}`)
    if (input.code && input.code !== existing.code) {
      const conflict = await SystemPostRepository.findByCode(input.code)
      if (conflict) throw new Error(`岗位编码已存在: ${input.code}`)
    }
    const { id, ...data } = input
    await SystemPostRepository.update(id, data)
    domainLog.event("system.post.update", { postId: id })
    domainLog.audit("system.post.update", { targetType: "POST", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await SystemPostRepository.findById(id)
    if (!existing) throw new Error(`岗位不存在: ${id}`)
    await SystemPostRepository.delete(id)
    domainLog.event("system.post.delete", { postId: id })
    domainLog.audit("system.post.delete", { targetType: "POST", targetId: id })
    return { success: true }
  }
}
