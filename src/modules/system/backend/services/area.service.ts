import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { SystemAreaRepository } from "@/modules/system/backend/repositories/area.repository"

export class AreaService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    const result = await SystemAreaRepository.page({ page: input.page ?? 1, pageSize: input.pageSize ?? 20, keyword: input.keyword })
    domainLog.event("system.area.page", { total: result.total })
    return result
  }

  static async get(id: string) {
    const item = await SystemAreaRepository.findById(id)
    if (!item) throw new Error("地区不存在")
    return item
  }

  static async create(input: { name: string; parentId?: string; level?: number }) {
    const row = await SystemAreaRepository.create(input)
    domainLog.event("system.area.create", { id: row.id })
    return { id: row.id }
  }

  static async update(input: { id: string; name?: string; parentId?: string | null; level?: number; status?: string }) {
    const { id, ...data } = input
    await SystemAreaRepository.update(id, data)
    domainLog.event("system.area.update", { id })
    return { id }
  }

  static async delete(id: string) {
    await SystemAreaRepository.delete(id)
    domainLog.event("system.area.delete", { id })
    return { success: true }
  }

  static async getArea(input: { id: string }) { return this.get(input.id) }
  static async createArea(input: { name: string; parentId?: string; level?: number }) { return this.create(input) }
  static async updateArea(input: { id: string; name?: string; parentId?: string | null; level?: number; status?: string }) { return this.update(input) }
  static async deleteArea(input: { id: string }) { return this.delete(input.id) }
}
