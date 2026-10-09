import { describe, it, expect } from "vitest"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import { CrmClueService } from "../crm-clue.service"
import { CrmCustomerService } from "../crm-customer.service"

describe("CrmClueService - 业务生命周期与转化状态机", () => {
  it("应支持完整的线索创建、跟进记录与客户转化闭环", async () => {
    await runWithTenantContext({ tenantId: "100" }, async () => {
      // 1. 创建新线索
      const clue = await CrmClueService.create({
        name: "张总（意向客户）",
        mobile: "13800138000",
        email: "zhang@example.com",
        owner_user_id: 101,
        remark: "通过官网咨询了解私有化部署",
      } as any)
      expect(clue.id).toBeDefined()
      expect(clue.follow_up_status).toBe(false)
      expect(clue.transform_status).toBe(false)

      // 2. 记录跟进
      const followed = await CrmClueService.recordFollowUp(
        clue.id,
        {
          content: "已进行初次电话沟通，对方对旗舰版功能很感兴趣",
          nextTime: "2026-10-15T10:00:00.000Z",
        },
        "101",
      )
      expect(followed.follow_up_status).toBe(true)
      expect(followed.contact_last_content).toContain("已进行初次电话沟通")
      expect(followed.contact_next_time).toBe("2026-10-15T10:00:00.000Z")

      // 3. 线索转化为客户
      const conversion = await CrmClueService.transformToCustomer(clue.id, "101")
      expect(conversion.clue.transform_status).toBe(true)
      expect(conversion.clue.customer_id).toBe(conversion.customer.id)
      expect(conversion.customer.name).toBe("张总（意向客户）")
      expect(conversion.customer.mobile).toBe("13800138000")
      expect(conversion.customer.owner_user_id).toBe(101)

      // 4. 不变量守卫：已转化的线索禁止重复转化
      await expect(CrmClueService.transformToCustomer(clue.id, "101")).rejects.toThrow("不可重复转化")

      // 5. 校验通过客户服务能够获取生成的客户
      const fetchedCustomer = await CrmCustomerService.get(conversion.customer.id)
      expect(fetchedCustomer).toBeDefined()
      expect(fetchedCustomer?.id).toBe(conversion.customer.id)
    })
  })
})
