import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { AigwModelRepository, type AigwModelRow } from "@/modules/aigw/backend/repositories/aigw-model.repository"

export type AigwModelItem = AigwModelRow

export type AigwModelCreateInput = {
  name: string
  modelKey: string
  provider: string
  inputRatio?: number
  outputRatio?: number
  status?: "ACTIVE" | "DISABLED"
  sort?: number
  description?: string
}

export type AigwModelUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type AigwModelPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

export class AigwModelService {
  static async page(input: AigwModelPageQuery) {
    const list = await AigwModelRepository.findAll({ keyword: input.keyword })
    const start = (input.page - 1) * input.pageSize
    domainLog.event("aigw.model.page", { page: input.page, total: list.length })
    return {
      items: list.slice(start, start + input.pageSize),
      total: list.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async get(id: string) {
    const item = await AigwModelRepository.findById(id)
    if (!item) throw new Error("模型不存在")
    domainLog.event("aigw.model.get", { id })
    return item
  }

  static async create(input: AigwModelCreateInput) {
    const item = await AigwModelRepository.create({
      name: input.name,
      modelKey: input.modelKey,
      provider: input.provider,
      inputRatio: input.inputRatio ?? 1.0,
      outputRatio: input.outputRatio ?? 2.0,
      status: input.status ?? "ACTIVE",
      sort: input.sort ?? 0,
      description: input.description,
    })
    domainLog.event("aigw.model.create", { id: item.id })
    domainLog.audit("aigw.model.create", { targetType: "AIGW_MODEL", targetId: item.id })
    return { id: item.id }
  }

  static async update(input: AigwModelUpdateInput) {
    const existing = await AigwModelRepository.findById(input.id)
    if (!existing) throw new Error("模型不存在")
    domainLog.event("aigw.model.update", { id: input.id })
    domainLog.audit("aigw.model.update", { targetType: "AIGW_MODEL", targetId: input.id })
    return { id: input.id }
  }

  static async delete(id: string) {
    domainLog.event("aigw.model.delete", { id })
    domainLog.audit("aigw.model.delete", { targetType: "AIGW_MODEL", targetId: id })
    return { success: true }
  }
}
