/**
 * InfraJob Service - 定时任务管理
 */

import { InfraJobRepository } from "@/modules/infra/backend/repositories/job.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class InfraJobService {
  static async list(input: any) {
    const result = await InfraJobRepository.findList(input)
    domainLog.event("infra.job.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const job = await InfraJobRepository.findById(id)
    if (!job) throw new Error(`任务不存在: ${id}`)
    return job
  }

  static async create(input: any) {
    const job = await InfraJobRepository.create(input)
    domainLog.event("infra.job.create", { jobId: job.id })
    domainLog.audit("infra.job.create", { targetType: "JOB", targetId: job.id })
    return { id: job.id }
  }

  static async update(input: { id: string; name?: string; handlerName?: string; handlerParam?: string; cronExpression?: string; retryCount?: number; retryInterval?: number; status?: string }) {
    const existing = await InfraJobRepository.findById(input.id)
    if (!existing) throw new Error(`任务不存在: ${input.id}`)
    const { id, ...data } = input
    await InfraJobRepository.update(id, data)
    domainLog.event("infra.job.update", { jobId: id })
    domainLog.audit("infra.job.update", { targetType: "JOB", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await InfraJobRepository.findById(id)
    if (!existing) throw new Error(`任务不存在: ${id}`)
    await InfraJobRepository.delete(id)
    domainLog.event("infra.job.delete", { jobId: id })
    domainLog.audit("infra.job.delete", { targetType: "JOB", targetId: id })
    return { success: true }
  }

  static async updateStatus(id: string, status: "ACTIVE" | "DISABLED") {
    const existing = await InfraJobRepository.findById(id)
    if (!existing) throw new Error(`任务不存在: ${id}`)
    await InfraJobRepository.update(id, { status })
    domainLog.event("infra.job.updateStatus", { jobId: id, status })
    domainLog.audit("infra.job.updateStatus", { targetType: "JOB", targetId: id, newStatus: status })
    return { success: true }
  }

  /** 手动触发一次执行（模拟） */
  static async trigger(id: string) {
    const existing = await InfraJobRepository.findById(id)
    if (!existing) throw new Error(`任务不存在: ${id}`)
    domainLog.event("infra.job.trigger", { jobId: id, handler: existing.handlerName })
    // TODO: 接入真实调度引擎
    return { success: true, message: `任务 ${existing.name} 已触发执行` }
  }

  static async getJob(input: { id: string }) { return this.getById(input.id) }
  static async deleteJob(input: { id: string }) { return this.delete(input.id) }
  static async triggerJob(input: { id: string }) { return this.trigger(input.id) }
  static async updateJobStatus(input: { id: string; status: "ACTIVE" | "DISABLED" }) { return this.updateStatus(input.id, input.status) }
}
