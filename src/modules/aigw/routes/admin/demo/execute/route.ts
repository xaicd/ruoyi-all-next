import { NextResponse } from "next/server"
import { aigwQuotaLedgerRepository } from "@/modules/aigw/backend/repositories/aigw-ledger.repository"
import { aigwSplitRepository } from "@/modules/aigw/backend/repositories/aigw-split.repository"
import { aigwUsageRepository } from "@/modules/aigw/backend/repositories/aigw-usage.repository"
import { aigwInvoiceRepository } from "@/modules/aigw/backend/repositories/aigw-invoice.repository"
import { aigwIsvAppRepository } from "@/modules/aigw/backend/repositories/aigw-isv-app.repository"
import { aigwMemberAllocationRepository } from "@/modules/aigw/backend/repositories/aigw-member-allocation.repository"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const scenario = body.scenario || "GOV_DOC_DRAFTING"

    // 读取动态编排参数
    const customCarrier = body.carrierName || "中国移动通信集团政企客户分公司"
    const customModel = body.model || "deepseek-r1-moma"
    const customPhone = body.phone || "13911112222"
    const customPrompt = body.prompt || ""

    // 辅助函数：记录台账与用量
    const recordGovUsage = async (tokens: number, appName: string, desc: string) => {
      const beans = Math.ceil(tokens / 1000)
      const ledger = await aigwQuotaLedgerRepository.recordChange({
        tenantId: "1",
        changeType: "USAGE_DEDUCT",
        deltaTokens: -tokens,
        balanceAfter: Math.max(0, 48_500_000 - tokens),
        modelPattern: customModel,
        remark: `${appName} • ${desc}，折合扣减 ${beans} 粒移动豆`,
      })
      await aigwUsageRepository.record({
        model: customModel,
        promptTokens: Math.floor(tokens * 0.3),
        completionTokens: Math.floor(tokens * 0.7),
        totalTokens: tokens,
        success: true,
        latencyMs: 24,
        tenantId: "1",
      })
      await aigwMemberAllocationRepository.recordUsage(customPhone, tokens)
      return { ledger, beans }
    }

    if (scenario === "GOV_DOC_DRAFTING") {
      // 场景 1：红头公文起草、政策合规审查与标准格式润色
      const tokens = 2850
      const { ledger, beans } = await recordGovUsage(tokens, "腾讯 WorkBuddy", "红头公文《关于推进政企智算中枢建设的请示》起草")

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "GOV_DOC_DRAFTING",
          scenarioTitle: "红头公文起草与合规审查",
          agent: "腾讯 WorkBuddy (挂载政务公文规范 MCP)",
          momaCompute: `中国移动 MOMA • ${customModel}`,
          tokensUsed: tokens,
          beansDeducted: `${beans} 粒移动豆`,
          balanceAfter: ledger.balanceAfter,
          documentResult: {
            title: "关于加快推进全省政企数智算力中枢与大模型基础设施建设的请示",
            docNumber: "粤数政发〔2026〕18号",
            sendTo: "省数智化转型领导小组办公室：",
            summary: "为贯彻落实国家智算战略，依托中国移动 MOMA 平台智算资源，构建面向全省政企办公的普惠算力中枢与智能体分发平台...",
            sections: [
              "一、总体建设目标与算力消纳测算 (预计年消纳 5000 亿 Tokens)",
              "二、智能体生态引入与公文/会议/安全研发赋能体系",
              "三、移动豆计量与四方合规清分机制保障",
            ],
            complianceAudit: {
              status: "PASSED",
              policyKeywordsCheck: "已排查涉密、意识形态与政策合规表述，符合《党政机关公文处理工作条例》",
              riskScore: 0,
            },
          },
          remark: "WorkBuddy 智能体自动完成红头公文排版与合规审计，扣减 3 粒移动豆！",
        },
      })
    } else if (scenario === "MEETING_MINUTES_DISPATCH") {
      // 场景 2：多方涉密会议速记 -> 决议摘要与企微待办任务派发
      const tokens = 3420
      const { ledger, beans } = await recordGovUsage(tokens, "腾讯 WorkBuddy", "全省政企算力调度推进会速记生成与待办派发")

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "MEETING_MINUTES_DISPATCH",
          scenarioTitle: "会议速记摘要与企微待办派发",
          agent: "腾讯 WorkBuddy (挂载腾讯会议 / 企微连接器 MCP)",
          momaCompute: `中国移动 MOMA • ${customModel}`,
          tokensUsed: tokens,
          beansDeducted: `${beans} 粒移动豆`,
          balanceAfter: ledger.balanceAfter,
          meetingSummary: {
            meetingTheme: "2026年第三季度政企大模型与 MOMA 算力调度专题推进会",
            attendees: "李总 (政企信息化主管)、张工 (核心研发架构师)、王主任 (行政办)",
            coreDecisions: [
              "1. 确定选用 DeepSeek-R1 作为政企业务深度推理核心底座；",
              "2. 下沉营业厅全面启动【政企协同办公 5000万 Token 算力包】推广；",
              "3. 统一采用手机号 SSO 打通 WorkBuddy 与 Qoder 双智能体生态。",
            ],
            dispatchedTasks: [
              { task: "完成政企门户员工手机号与份额分配", owner: "张工", deadline: "本周五 17:00", notifyChannel: "企业微信待办已发送" },
              { task: "出具月度 MOMA 移动豆四方清分对账单", owner: "王主任", deadline: "下周一 12:00", notifyChannel: "企业微信待办已发送" },
            ],
          },
          remark: "2小时长会议录音秒级提炼核心决议，自动创建并推送 2 项企微待办！",
        },
      })
    } else if (scenario === "BIDDING_PROPOSAL_AUDIT") {
      // 场景 3：招投标技术方案对比、偏离项分析与废标排查
      const tokens = 4100
      const { ledger, beans } = await recordGovUsage(tokens, "阿里 Qoder / WorkBuddy", "某市政务云大模型服务采购标书智能审查")

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "BIDDING_PROPOSAL_AUDIT",
          scenarioTitle: "标书对比与偏离项审查",
          agent: "WorkBuddy (挂载标书对比审查 MCP)",
          momaCompute: `中国移动 MOMA • ${customModel}`,
          tokensUsed: tokens,
          beansDeducted: `${beans} 粒移动豆`,
          balanceAfter: ledger.balanceAfter,
          biddingAnalysis: {
            projectName: "2026年度数字政府算力中台与大模型能力采购项目",
            budget: "￥1,200,000.00",
            vendorComparisonMatrix: [
              { vendor: "供应商 A (移动联合体)", techScore: "98.5分", pricing: "￥1,150,000", sla: "99.99%", deviations: "0 项负偏离 (完全响应)" },
              { vendor: "供应商 B", techScore: "89.0分", pricing: "￥1,180,000", sla: "99.90%", deviations: "2 项条款存在响应不足 (维保响应 > 4h)" },
              { vendor: "供应商 C", techScore: "76.5分", pricing: "￥980,000", sla: "99.50%", deviations: "⚠️ 存在重大实质性偏离风险 (缺少私有化部署承诺)" },
            ],
            recommendation: "推荐供应商 A 作为第一中标候选人，技术与服务承诺完全契合政企合规要求。",
          },
          remark: "秒级解析 3 家供应商投标文件，生成技术参数与报价对比矩阵，识别潜在废标风险！",
        },
      })
    } else if (scenario === "DEV_CODE_AUDIT_TESTS") {
      // 场景 4：政企核心研发：内网代码安全审计、重构与 100% 单测生成
      const tokens = 2150
      const { ledger, beans } = await recordGovUsage(tokens, "阿里 Qoder", "高并发计费清分微服务安全审计与 Vitest 单测生成")

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "DEV_CODE_AUDIT_TESTS",
          scenarioTitle: "内网代码安全审计与自动化单测",
          agent: "阿里 Qoder (智能代码助手)",
          momaCompute: `中国移动 MOMA • ${customModel}`,
          tokensUsed: tokens,
          beansDeducted: `${beans} 粒移动豆`,
          balanceAfter: ledger.balanceAfter,
          codeAuditResult: {
            targetFile: "src/modules/aigw/backend/services/settlement-engine.service.ts",
            vulnerabilitiesFound: [
              { level: "HIGH", issue: "并发扣费场景下存在竞态条件 (Race Condition)", fix: "引入物理台账 balanceAfter 悲观锁校验" },
            ],
            generatedTestSnippet: `describe("SettlementEngine High Concurrency", () => {
  it("should prevent double-deducting beans on 1000 concurrent requests", async () => {
    const results = await Promise.all(requests.map(r => ledgerRepo.record(r)));
    expect(results.filter(r => r.success).length).toBe(1);
  });
});`,
            testCoverage: "100% (分支覆盖率达标，代码合规不出内网)",
          },
          remark: "全程在运营商本地私有 MOMA 算力上运行，代码零出内网泄密风险！",
        },
      })
    } else {
      // 场景 5：政务 12345 民生工单智能派单与政策答复
      const tokens = 1890
      const { ledger, beans } = await recordGovUsage(tokens, "腾讯 WorkBuddy", "12345 市民热线工单自动分类派单与政策答复")

      return NextResponse.json({
        code: 0,
        msg: "success",
        data: {
          scenario: "HOTLINE_12345_KNOWLEDGE",
          scenarioTitle: "12345 工单智能分类与政策答复",
          agent: "腾讯 WorkBuddy (挂载 12345 工单系统 MCP)",
          momaCompute: `中国移动 MOMA • ${customModel}`,
          tokensUsed: tokens,
          beansDeducted: `${beans} 粒移动豆`,
          balanceAfter: ledger.balanceAfter,
          hotlineResult: {
            callerQuery: "咨询老旧小区加装电梯，公积金如何提取？政府财政每台补贴多少万元？需要哪些申请材料？",
            matchedPolicy: "《关于进一步推进既有住宅加装电梯工作的若干意见》(2026年修订版) 第三条、第七条",
            standardReply: "尊敬的市民：根据最新政策，加装电梯可全额提取业主及配偶住房公积金；财政对符合条件的每台电梯给予 15 万元一次性补贴。申请材料包括：不动产权证、加装电梯协议书、规划审查意见书。",
            dispatchedDept: "市住房和城乡建设局 • 物业与既有建筑改造科",
            urgencyLevel: "普通民生工单 (要求 3 个工作日内办结闭环)",
          },
          remark: "秒级完成民生诉求意图识别，精准调取最新政务答复口径并自动派单！",
        },
      })
    }
  } catch (err: any) {
    return NextResponse.json({ code: 500, error: err.message || "演练执行失败" }, { status: 500 })
  }
}
