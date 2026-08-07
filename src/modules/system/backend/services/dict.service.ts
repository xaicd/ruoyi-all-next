/**
 * System Dict Service - 字典类型 + 字典数据
 */

import { SystemDictTypeRepository, SystemDictDataRepository } from "@/modules/system/backend/repositories/dict.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class SystemDictService {
  // === 字典类型 ===
  static async listTypes(input: { page: number; pageSize: number; keyword?: string; status?: string }) {
    const result = await SystemDictTypeRepository.findList(input)
    domainLog.event("system.dict.listTypes", { total: result.total })
    return result
  }

  static async getType(id: string) {
    const t = await SystemDictTypeRepository.findById(id)
    if (!t) throw new Error(`字典类型不存在: ${id}`)
    return t
  }

  static async createType(input: { name: string; type: string; status?: string; remark?: string }) {
    const existing = await SystemDictTypeRepository.findByType(input.type)
    if (existing) throw new Error(`字典类型编码已存在: ${input.type}`)
    const t = await SystemDictTypeRepository.create(input)
    domainLog.event("system.dict.createType", { dictTypeId: t.id })
    domainLog.audit("system.dict.createType", { targetType: "DICT_TYPE", targetId: t.id })
    return { id: t.id }
  }

  static async updateType(input: { id: string; name?: string; type?: string; status?: string; remark?: string }) {
    const existing = await SystemDictTypeRepository.findById(input.id)
    if (!existing) throw new Error(`字典类型不存在: ${input.id}`)
    if (input.type && input.type !== existing.type) {
      const conflict = await SystemDictTypeRepository.findByType(input.type)
      if (conflict) throw new Error(`字典类型编码已存在: ${input.type}`)
    }
    const { id, ...data } = input
    await SystemDictTypeRepository.update(id, data)
    domainLog.event("system.dict.updateType", { dictTypeId: id })
    domainLog.audit("system.dict.updateType", { targetType: "DICT_TYPE", targetId: id })
    return { id }
  }

  static async deleteType(id: string) {
    await SystemDictTypeRepository.delete(id)
    domainLog.event("system.dict.deleteType", { dictTypeId: id })
    domainLog.audit("system.dict.deleteType", { targetType: "DICT_TYPE", targetId: id })
    return { success: true }
  }

  // === 字典数据 ===
  static async listData(dictTypeId: string) {
    const data = await SystemDictDataRepository.findByDictTypeId(dictTypeId)
    domainLog.event("system.dict.listData", { dictTypeId, count: data.length })
    return data
  }

  static async getDataByType(type: string) {
    return SystemDictDataRepository.findByType(type)
  }

  static async createData(input: { dictTypeId: string; label: string; value: string; sort?: number; status?: string; colorType?: string; remark?: string }) {
    const d = await SystemDictDataRepository.create(input)
    domainLog.event("system.dict.createData", { dictDataId: d.id })
    domainLog.audit("system.dict.createData", { targetType: "DICT_DATA", targetId: d.id })
    return { id: d.id }
  }

  static async updateData(input: { id: string; label?: string; value?: string; sort?: number; status?: string; colorType?: string; remark?: string }) {
    const existing = await SystemDictDataRepository.findById(input.id)
    if (!existing) throw new Error(`字典数据不存在: ${input.id}`)
    const { id, ...data } = input
    await SystemDictDataRepository.update(id, data)
    domainLog.event("system.dict.updateData", { dictDataId: id })
    return { id }
  }

  static async deleteData(id: string) {
    await SystemDictDataRepository.delete(id)
    domainLog.event("system.dict.deleteData", { dictDataId: id })
    return { success: true }
  }
}
