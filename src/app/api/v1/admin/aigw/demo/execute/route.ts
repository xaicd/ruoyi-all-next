import { NextResponse } from "next/server"
import { AigwRelayService } from "@/modules/aigw/backend/services/aigw-relay.service"
import { aigwQuotaLedgerRepository } from "@/modules/aigw/backend/repositories/aigw-ledger.repository"
import { aigwSplitRepository } from "@/modules/aigw/backend/repositories/aigw-split.repository"
import { aigwUsageRepository } from "@/modules/aigw/backend/repositories/aigw-usage.repository"
import { aigwEnterpriseRepository } from "@/modules/aigw/backend/repositories/aigw-enterprise.repository"
import { aigwSeatRepository } from "@/modules/aigw/backend/repositories/aigw-seat.repository"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const scenario = body.scenario || "B2B_GOV" // B2B_GOV or B2C_SKU

    if (scenario === "B2B_GOV") {
      // 场景 1：政企 Agent 开发者席位授权与对公清分闭环
      const userEmail = "dev_seat_008@telecom.gd.cn"
      const prompt = "请分析 Redis 并发锁机制，并给出包含 Python + Lua 脚本的高并发锁重构代码"

      // 1. 确保开户与席位落盘
      await aigwEnterpriseRepository.create("1", {
        name: "中国电信股份有限公司广东省政企分公司",
        code: "CT_GD_GOV",
        province: "广东省",
        city: "广州市",
        industry: "电信/运营商",
        contactName: "张经理",
        contactPhone: "13800138000",
        status: "ACTIVE",
      })

      await aigwSeatRepository.create("1", {
        enterpriseId: "CT_GD_GOV",
        userName: "开发工程师 (seat_008)",
        appType: "WORKBUDDY",
        userEmail,
        monthlyTokenCap: 50000000,
        status: "ACTIVE",
      })

      // 2. 调用 Relay 大模型服务 (带有安全合规防线与优雅回退)
      let answerContent = "def acquire_lock(redis_client, lock_key, request_id):\n    lua_script = 'if redis.call(\"get\", KEYS[1]) == ARGV[1] then return 1 else return 0 end'\n    return redis_client.eval(lua_script, 1, lock_key, request_id)"
      let totalTokens = 3420
      let promptTokens = 1200
      let completionTokens = 2220

      try {
        const relayRes = await AigwRelayService.relayChatCompletion({
          apiKey: "sk-ruoyi-demo-gateway",
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
        })
        if (relayRes?.choices?.[0]?.message?.content) {
          answerContent = relayRes.choices[0].message.content
        }
        if (relayRes?.usage?.total_tokens) {
          totalTokens = relayRes.usage.total_tokens
          promptTokens = relayRes.usage.prompt_tokens || 1200
          completionTokens = relayRes.usage.completion_tokens || 2220
        }
      } catch (e: any) {
        console.warn("[demo-execute] Relay LLM fallback to simulated completion:", e?.message)
      }

      // 3. 落盘增量算力台账 (CONTRACT_FRAMEWORK_GRANT 扣减)
      const ledger = await aigwQuotaLedgerRepository.recordChange({
        tenantId: "1",
        changeType: "CONTRACT_FRAMEWORK_GRANT",
        deltaTokens: -totalTokens,
        balanceAfter: 49996580,
        modelPattern: "deepseek/*",
        refId: "CT-2026-GD-0088",
        operatorId: userEmail,
        remark: `WorkBuddy Agent 消费扣减 (${totalTokens} Token)`,
      })

      // 4. 落盘用量日志
      await aigwUsageRepository.record({
        tokenId: "token-demo-01",
        channelId: "channel-deepseek",
        model: "deepseek-chat",
        promptTokens,
        completionTokens,
        totalTokens,
        success: true,
        latencyMs: 380,
      })

      // 5. 落盘三方清分流水记录
      const split = await aigwSplitRepository.create("1", {
        carrierName: "中国电信广东省分公司",
        month: "2026-08",
        totalTokens: totalTokens.toString(),
        totalAmount: (totalTokens * 0.00001).toFixed(4),
        carrierShare: (totalTokens * 0.00001 * 0.3).toFixed(4),
        platformShare: (totalTokens * 0.00001 * 0.7).toFixed(4),
        status: "SETTLED",
      })

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "B2B_GOV",
          userEmail,
          carrierContract: "CT-2026-GD-0088 (中国电信广东分公司 5000万 框架标)",
          modelUsed: "deepseek-chat",
          answerContent,
          tokensUsed: { promptTokens, completionTokens, totalTokens },
          ledger,
          split,
        },
      })
    } else {
      // 场景 2：To C / 小微企线上加购算力加油包与闲时 5 折闭环
      const skuCode = "DEEPSEEK_50M"
      const rechargeTokens = 50000000

      // 1. 模拟收到 ruoyi.evt.trade.order_paid 事件，向台账充值 +50,000,000 Token
      const rechargeLedger = await aigwQuotaLedgerRepository.recordChange({
        tenantId: "1",
        changeType: "SKU_RECHARGE",
        deltaTokens: rechargeTokens,
        balanceAfter: 58500000,
        modelPattern: "deepseek/*",
        refId: "ORD-20260824-9901",
        operatorId: "buyer_small_biz@company.com",
        remark: `在线加购 ${skuCode} 算力加油包上充`,
      })

      // 2. 模拟夜间闲时 (23:30) 调用大模型，命中闲时 5 折单价
      let answerContent = "🔥 2026 全新升级！应算通 AI 算力中台：支撑高并发路由、政企席位授权与多省运营商 30% 清分！"
      let totalTokens = 850

      try {
        const relayRes = await AigwRelayService.relayChatCompletion({
          apiKey: "sk-ruoyi-demo-gateway",
          model: "deepseek-chat",
          messages: [{ role: "user", content: "请写一段 2026 全新 AI 算力中台产品上线宣传语" }],
        })
        if (relayRes?.choices?.[0]?.message?.content) {
          answerContent = relayRes.choices[0].message.content
        }
        if (relayRes?.usage?.total_tokens) {
          totalTokens = relayRes.usage.total_tokens
        }
      } catch (e: any) {
        console.warn("[demo-execute] Relay LLM fallback to simulated completion:", e?.message)
      }

      // 3. 落盘折后用量与清分记录
      await aigwUsageRepository.record({
        tokenId: "token-demo-02",
        channelId: "channel-deepseek",
        model: "deepseek-chat",
        promptTokens: 150,
        completionTokens: 700,
        totalTokens,
        success: true,
        latencyMs: 260,
      })

      const split = await aigwSplitRepository.create("1", {
        carrierName: "中国移动浙江省云中心",
        month: "2026-08",
        totalTokens: totalTokens.toString(),
        totalAmount: (totalTokens * 0.000005).toFixed(4),
        carrierShare: (totalTokens * 0.000005 * 0.35).toFixed(4),
        platformShare: (totalTokens * 0.000005 * 0.65).toFixed(4),
        status: "UNSETTLED",
      })

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "B2C_SKU",
          tradeOrderNo: "ORD-20260824-9901",
          skuCode,
          rechargeLedger,
          tariffApplied: "DeepSeek 闲时 5 折优惠资费 (原价 ¥ 0.002 -> 现价 ¥ 0.001 / kToken)",
          answerContent,
          tokensUsed: totalTokens,
          split,
        },
      })
    }
  } catch (err: any) {
    return NextResponse.json({ code: 500, msg: err.message || "执行失败" }, { status: 500 })
  }
}
