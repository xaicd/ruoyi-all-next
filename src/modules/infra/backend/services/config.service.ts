/**
 * InfraConfig Service - 系统配置管理
 * 已从 JSON 文件存储迁移到 Repository 模式（支持多数据库）
 */

import { InfraConfigRepository } from "@/modules/infra/backend/repositories/config.repository"
import type { UpdateConfigInput } from "@/modules/infra/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type ListInput = { page: number; pageSize: number; keyword?: string; category?: string }
type CreateInput = { category?: string; name: string; configKey: string; value: string; visible?: boolean; remark?: string }
type UpdateInput = { id: string; name?: string; category?: string; value?: string; visible?: boolean; remark?: string }

export class InfraConfigService {
  static async list(input: ListInput) {
    const result = await InfraConfigRepository.findList(input)
    domainLog.event("infra.config.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const config = await InfraConfigRepository.findById(id)
    if (!config) throw new Error(`配置不存在: ${id}`)
    return config
  }

  static async getByKey(key: string) {
    const config = await InfraConfigRepository.findByKey(key)
    if (!config) throw new Error(`配置项不存在: ${key}`)
    return config
  }

  static async getConfigByKey(input: { key: string }) {
    return this.getByKey(input.key)
  }

  /** 运行时获取配置值 */
  static async getValue(key: string, defaultValue?: string): Promise<string> {
    const value = await InfraConfigRepository.getValue(key)
    return value ?? defaultValue ?? ""
  }

  static async create(input: CreateInput) {
    const existing = await InfraConfigRepository.findByKey(input.configKey)
    if (existing) throw new Error(`配置 Key 已存在: ${input.configKey}`)

    const config = await InfraConfigRepository.create(input)
    domainLog.event("infra.config.create", { configId: config.id, key: config.configKey })
    domainLog.audit("infra.config.create", { targetType: "CONFIG", targetId: config.id, configKey: config.configKey })
    return { id: config.id }
  }

  static async updateConfig(input: UpdateConfigInput) {
    const existing = await InfraConfigRepository.findByKey(input.key)
    if (!existing) throw new Error(`配置项不存在: ${input.key}`)

    await InfraConfigRepository.update(existing.id, { value: input.value, remark: input.remark })
    domainLog.event("infra.config.update", { configId: existing.id, key: input.key })
    domainLog.audit("infra.config.update", { targetType: "CONFIG", targetId: existing.id, configKey: input.key })
    return { id: existing.id, key: input.key, value: input.value }
  }

  static async update(input: UpdateInput) {
    const existing = await InfraConfigRepository.findById(input.id)
    if (!existing) throw new Error(`配置不存在: ${input.id}`)

    const { id, ...data } = input
    await InfraConfigRepository.update(id, data)
    domainLog.event("infra.config.update", { configId: id, key: existing.configKey })
    domainLog.audit("infra.config.update", { targetType: "CONFIG", targetId: id, configKey: existing.configKey })
    return { id }
  }

  static async delete(id: string) {
    const existing = await InfraConfigRepository.findById(id)
    if (!existing) throw new Error(`配置不存在: ${id}`)

    await InfraConfigRepository.delete(id)
    domainLog.event("infra.config.delete", { configId: id, key: existing.configKey })
    domainLog.audit("infra.config.delete", { targetType: "CONFIG", targetId: id })
    return { success: true }
  }

  static async save(...args: any[]) {
    return {}
  }

  static async getConfig(input: { id: string }) { return this.getById(input.id) }
  static async updateConfigItem(input: { id: string; name?: string; value?: string; category?: string; visible?: boolean; remark?: string }) { return this.update(input) }
  static async deleteConfig(input: { id: string }) { return this.delete(input.id) }
}
