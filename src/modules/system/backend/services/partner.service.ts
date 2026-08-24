import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import {
  SystemPartnerRepository,
  type SystemPartnerRow,
  type CreatePartnerData,
  type UpdatePartnerData,
  type PartnerListParams,
  type PageResult,
} from "../repositories/partner.repository"

export class SystemPartnerService {
  static async page(params: PartnerListParams, actorId?: string): Promise<PageResult<SystemPartnerRow>> {
    return SystemPartnerRepository.findList(params)
  }

  static async get(id: string, actorId?: string): Promise<SystemPartnerRow | null> {
    return SystemPartnerRepository.findById(id)
  }

  static async create(data: CreatePartnerData, actorId?: string): Promise<SystemPartnerRow> {
    const row = await SystemPartnerRepository.create(data)
    domainLog.event("system.partner.created", { id: row.id, name: row.name, actorId })
    return row
  }

  static async update(id: string, data: UpdatePartnerData, actorId?: string): Promise<SystemPartnerRow> {
    const row = await SystemPartnerRepository.update(id, data)
    domainLog.event("system.partner.updated", { id, actorId })
    return row
  }

  static async bindCustomerByPromoCode(promoCode: string, tenantId: string, actorId?: string) {
    const row = await SystemPartnerRepository.bindTenantByPromoCode(promoCode, tenantId)
    domainLog.event("system.partner.customerBound", { partnerId: row.id, tenantId, actorId })
    return row
  }

  static async getReferralLedger(partnerId: string) {
    return SystemPartnerRepository.getReferralLedger(partnerId)
  }

  static async delete(id: string, actorId?: string): Promise<void> {
    await SystemPartnerRepository.delete(id)
    domainLog.event("system.partner.deleted", { id, actorId })
  }
}

export const systemPartnerService = SystemPartnerService
