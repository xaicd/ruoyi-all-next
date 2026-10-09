import { describe, it, expect } from "vitest"
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import { PayOrderService } from "../pay-order.service"

describe("PayOrderService 支付订单业务与 4 态状态机测试", () => {
  it("基础 CRUD 正常流转", async () => {
    await runWithTenantContext({ tenantId: "1" }, async () => {
      const created = await PayOrderService.create({
        subject: "测试商品",
        price: 10000,
        status: "WAITING",
      } as any)
      expect(created).toBeDefined()
      expect(created.id).toBeDefined()

      const list = await PayOrderService.page({ page: 1, pageSize: 10 })
      expect(list.items.length).toBeGreaterThan(0)

      const fetched = await PayOrderService.get(created.id)
      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)

      const updated = await PayOrderService.update(created.id, {
        id: created.id,
        subject: "更新后的商品标题",
      } as any)
      expect(updated).toBeDefined()

      const deleted = await PayOrderService.delete(created.id)
      expect(deleted).toBe(true)
    })
  })

  it("完整 4 态流转：WAITING -> 提交支付 -> 首次回调 SUCCESS -> 重复回调幂等 -> 部分退款 -> 全额退款 CLOSED", async () => {
    await runWithTenantContext({ tenantId: "1" }, async () => {
      // 1. 创建订单 (初始 WAITING)
      const order = await PayOrderService.create({
        subject: "iPhone 16 Pro",
        price: 999900, // 9999.00 元
        status: "WAITING",
      } as any)
      expect(order.status).toBe("WAITING")

      // 2. 提交支付通道
      const submitted = await PayOrderService.submit(order.id, "wx_pub", {
        userIp: "127.0.0.1",
        channelUserId: "wx-user-1001",
      })
      expect(submitted?.channel_code).toBe("wx_pub")

      // 3. 首次支付成功回调
      const ext = { id: `ext-${Date.now()}`, orderId: order.id, status: "WAITING" }
      const firstCallback = await PayOrderService.notifyPaid(order.id, ext)
      expect(firstCallback.duplicate).toBe(false)
      expect(firstCallback.emitEvent).toBe(true)
      expect(firstCallback.order?.status).toBe("SUCCESS")
      expect(firstCallback.order?.success_time).toBeDefined()

      // 4. 重复回调幂等验证（不变量 1：不可重复触发下游事件）
      const secondCallback = await PayOrderService.notifyPaid(order.id, ext)
      expect(secondCallback.duplicate).toBe(true)
      expect(secondCallback.emitEvent).toBe(false)
      expect(secondCallback.order?.status).toBe("SUCCESS")

      // 5. 关闭回调防降级验证（不变量 2：已支付订单绝不因关闭通知降级为 CLOSED）
      const closeResult = await PayOrderService.close(order.id, ext, "商户端尝试超时关单")
      expect(closeResult.outcome).toBe("skipped-paid-no-downgrade")
      const orderAfterClose = await PayOrderService.get(order.id)
      expect(orderAfterClose?.status).toBe("SUCCESS")

      // 6. 部分退款（退款 3000 元，订单依然是 SUCCESS）
      const partialRefund = await PayOrderService.refund(order.id, 300000, "部分退款")
      expect(partialRefund?.refund_price).toBe(300000)
      expect(partialRefund?.status).toBe("SUCCESS")

      // 7. 退款超额拦截
      await expect(
        PayOrderService.refund(order.id, 800000, "超额退款尝试")
      ).rejects.toThrow(/退款金额超过订单支付总额/)

      // 8. 补齐剩余尾款全额退款（订单最终迁移为终态 CLOSED）
      const fullRefund = await PayOrderService.refund(order.id, 699900, "结清退款")
      expect(fullRefund?.refund_price).toBe(999900)
      expect(fullRefund?.status).toBe("CLOSED")

      // 清理数据
      await PayOrderService.delete(order.id)
    })
  })
})
