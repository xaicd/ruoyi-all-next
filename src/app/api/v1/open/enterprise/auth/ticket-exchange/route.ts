import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { ticket, enterpriseTaxCode } = body

    // 模拟根据 Ticket 或企业纳税人税号解析政企身份
    const isGdGov = !enterpriseTaxCode || enterpriseTaxCode.includes("11440000") || enterpriseTaxCode.includes("MA59")
    
    const enterpriseData = isGdGov
      ? {
          id: "ent-gd-gov",
          code: "gd-gov-data",
          name: "广东省政务服务和数据管理局",
          creditCode: "11440000MB2D00001X",
          carrier: "中国移动通信集团广东有限公司",
          tierName: "旗舰智算融合套餐 (月包)",
          tokensTotal: 100_000_000,
          tokensUsed: 18_000_000,
          tokensRemain: 82_000_000,
          momaBeansRemain: 82_000,
          seatsTotal: 100,
          seatsUsed: 45,
          injectedMcps: [
            { code: "mcp-gov-document", name: "国家标准红头公文排版与合规审计", version: "v2.1" },
            { code: "mcp-meeting-wework", name: "腾讯会议速记与企微待办任务派发", version: "v1.4" },
          ],
        }
      : {
          id: "ent-yue-trans",
          code: "yue-transport-tech",
          name: "广东省交通数智科技集团有限公司",
          creditCode: "91440101MA59TRANSPORT",
          carrier: "中国移动 MOMA 智算中心",
          tierName: "数智研发保障套餐",
          tokensTotal: 80_000_000,
          tokensUsed: 12_000_000,
          tokensRemain: 68_000_000,
          momaBeansRemain: 68_000,
          seatsTotal: 80,
          seatsUsed: 35,
          injectedMcps: [
            { code: "mcp-gitlab-audit", name: "国央企内网 GitLab 源码合规审计与单测生成", version: "v3.0" },
            { code: "mcp-bidding-audit", name: "政府采购与招投标方案审查", version: "v1.8" },
          ],
        }

    return NextResponse.json({
      success: true,
      data: {
        accessToken: `jwt-gov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        expiresIn: 86400,
        enterprise: enterpriseData,
        operator: {
          name: isGdGov ? "李总 (信息化处长)" : "张总 (技术总监)",
          phone: isGdGov ? "13800000001" : "13911112222",
          role: "TENANT_ADMIN",
        },
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Ticket 交换失败" }, { status: 500 })
  }
}
