import type { MallCouponIssueInput, MallPageQueryInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MallProduct = {
  id: string
  name: string
  category: "FOOD" | "GIFT" | "TICKET"
  price: number
}

type MallOrder = {
  id: string
  orderNo: string
  amount: number
  status: "PENDING" | "PAID" | "REFUNDED"
}

const MOCK_PRODUCTS: MallProduct[] = [
  { id: "mall-p-001", name: "章丘铁锅礼盒", category: "GIFT", price: 299 },
  { id: "mall-p-002", name: "农庄采摘门票", category: "TICKET", price: 88 },
]

const MOCK_ORDERS: MallOrder[] = [
  { id: "mall-o-001", orderNo: "MO-202608-001", amount: 598, status: "PAID" },
  { id: "mall-o-002", orderNo: "MO-202608-002", amount: 176, status: "PENDING" },
]

export class MallService {
  static async listProducts(input: MallPageQueryInput) {
    domainLog.event("mall.product.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_PRODUCTS.filter((item) => item.name.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword))
      : MOCK_PRODUCTS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async listOrders(input: MallPageQueryInput) {
    domainLog.event("mall.order.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_ORDERS.filter((item) => item.orderNo.toLowerCase().includes(keyword) || item.status.toLowerCase().includes(keyword))
      : MOCK_ORDERS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async issueCoupon(input: MallCouponIssueInput) {
    domainLog.event("mall.coupon.issue", {
      couponTemplateId: input.couponTemplateId,
      targetUserId: input.targetUserId,
      amount: input.amount,
    })

    domainLog.audit("mall.coupon.issue", {
      targetType: "USER",
      targetId: input.targetUserId,
      couponTemplateId: input.couponTemplateId,
      amount: input.amount,
    })

    return {
      couponTemplateId: input.couponTemplateId,
      targetUserId: input.targetUserId,
      amount: input.amount,
      status: "ISSUED" as const,
    }
  }
}
