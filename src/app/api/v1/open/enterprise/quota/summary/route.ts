import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgCode = searchParams.get("org") || "gd-gov-data"

    const isGdGov = orgCode === "gd-gov-data"

    return NextResponse.json({
      success: true,
      data: {
        enterpriseName: isGdGov ? "广东省政务服务和数据管理局" : "广东省交通数智科技集团有限公司",
        creditCode: isGdGov ? "11440000MB2D00001X" : "91440101MA59TRANSPORT",
        tierName: isGdGov ? "旗舰智算融合套餐 (月包)" : "数智研发保障套餐",
        tokensTotal: isGdGov ? 100_000_000 : 80_000_000,
        tokensUsed: isGdGov ? 18_000_000 : 12_000_000,
        tokensRemain: isGdGov ? 82_000_000 : 68_000_000,
        usagePercent: isGdGov ? 18.0 : 15.0,
        momaBeansBalance: isGdGov ? 82_000 : 68_000,
        seatsTotal: isGdGov ? 100 : 80,
        seatsAssigned: isGdGov ? 45 : 35,
        seatsActive: isGdGov ? 38 : 28,
        monthlyBillAmount: isGdGov ? 50000.00 : 40000.00,
        currentMonthExpireAt: "2026-08-31T23:59:59.000Z",
        boundMcps: isGdGov ? [
          { code: "mcp-gov-document", name: "国家标准红头公文排版与合规审计", version: "v2.1" },
          { code: "mcp-meeting-wework", name: "腾讯会议速记与企微待办任务派发", version: "v1.4" },
        ] : [
          { code: "mcp-gitlab-audit", name: "国央企内网 GitLab 源码合规审计与单测生成", version: "v3.0" },
          { code: "mcp-bidding-audit", name: "政府采购招投标方案审查", version: "v1.8" },
        ],
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "获取企业算力大盘失败" }, { status: 500 })
  }
}
