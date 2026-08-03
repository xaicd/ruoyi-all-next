import type { CrmFollowupInput, CrmPageQueryInput } from "../validators"
import { domainLog } from "../../../../backend/lib/domain-log"

type CrmCustomer = {
  id: string
  name: string
  level: "A" | "B" | "C"
  owner: string
}

type CrmClue = {
  id: string
  title: string
  source: string
  status: "NEW" | "CONTACTED"
}

const MOCK_CUSTOMERS: CrmCustomer[] = [
  { id: "cus-001", name: "章丘农旅集团", level: "A", owner: "operator01" },
  { id: "cus-002", name: "千岛湖文旅公司", level: "B", owner: "operator01" },
]

const MOCK_CLUES: CrmClue[] = [
  { id: "clue-001", title: "村级驿站采购合作", source: "微信咨询", status: "NEW" },
  { id: "clue-002", title: "民宿升级托管需求", source: "线下活动", status: "CONTACTED" },
]

export class CrmService {
  static async listCustomers(input: CrmPageQueryInput) {
    domainLog.event("crm.customer.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_CUSTOMERS.filter((item) => item.name.toLowerCase().includes(keyword) || item.owner.toLowerCase().includes(keyword))
      : MOCK_CUSTOMERS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async listClues(input: CrmPageQueryInput) {
    domainLog.event("crm.clue.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_CLUES.filter((item) => item.title.toLowerCase().includes(keyword) || item.source.toLowerCase().includes(keyword))
      : MOCK_CLUES

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async createFollowup(input: CrmFollowupInput) {
    domainLog.event("crm.followup.create", { customerId: input.customerId })
    const customer = MOCK_CUSTOMERS.find((item) => item.id === input.customerId)
    if (!customer) {
      throw new Error("客户不存在")
    }

    domainLog.audit("crm.followup.create", {
      targetType: "CUSTOMER",
      targetId: input.customerId,
    })

    return {
      customerId: input.customerId,
      status: "RECORDED",
      contentLength: input.content.length,
    }
  }
}
