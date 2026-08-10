/**
 * CRM Customer Service
 */

import { CrmCustomerRepository } from "@/modules/crm/backend/repositories/customer.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class CrmCustomerService {
  static async list(input: any) {
    const result = await CrmCustomerRepository.findList(input)
    domainLog.event("crm.customer.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const customer = await CrmCustomerRepository.findById(id)
    if (!customer) throw new Error(`客户不存在: ${id}`)
    return customer
  }

  static async create(input: any) {
    const customer = await CrmCustomerRepository.create(input)
    domainLog.event("crm.customer.create", { customerId: customer.id })
    domainLog.audit("crm.customer.create", { targetType: "CRM_CUSTOMER", targetId: customer.id })
    return { id: customer.id }
  }

  static async update(input: { id: string; name?: string; phone?: string; email?: string; industry?: string; level?: string; source?: string; status?: string; dealStatus?: string; remark?: string }) {
    const existing = await CrmCustomerRepository.findById(input.id)
    if (!existing) throw new Error(`客户不存在: ${input.id}`)
    const { id, ...data } = input
    await CrmCustomerRepository.update(id, data)
    domainLog.event("crm.customer.update", { customerId: id })
    domainLog.audit("crm.customer.update", { targetType: "CRM_CUSTOMER", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    await CrmCustomerRepository.delete(id)
    domainLog.event("crm.customer.delete", { customerId: id })
    domainLog.audit("crm.customer.delete", { targetType: "CRM_CUSTOMER", targetId: id })
    return { success: true }
  }

  /** 转入公海 */
  static async moveToPool(id: string) {
    const existing = await CrmCustomerRepository.findById(id)
    if (!existing) throw new Error(`客户不存在: ${id}`)
    await CrmCustomerRepository.update(id, { status: "POOL", ownerUserId: undefined })
    domainLog.event("crm.customer.moveToPool", { customerId: id })
    return { success: true }
  }
}
