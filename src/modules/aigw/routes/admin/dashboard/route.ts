import { NextResponse } from "next/server"
import { aigwUsageRepository } from "@/modules/aigw/backend/repositories/aigw-usage.repository"
import { aigwQuotaLedgerRepository, MEMORY_LEDGER_STORE } from "@/modules/aigw/backend/repositories/aigw-ledger.repository"
import { aigwIsvAppRepository } from "@/modules/aigw/backend/repositories/aigw-isv-app.repository"
import { aigwMemberAllocationRepository } from "@/modules/aigw/backend/repositories/aigw-member-allocation.repository"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || "1"

    // 1. 读取用量流水
    const usages = await aigwUsageRepository.findAll({ limit: 100 })
    const ledgerHistory = await aigwQuotaLedgerRepository.queryHistory(tenantId, 1, 50)
    const apps = await aigwIsvAppRepository.findAll()
    const members = await aigwMemberAllocationRepository.findAll({ tenantId })

    // 2. 统计计算
    const totalTokensUsed = usages.reduce((sum, u) => sum + (u.totalTokens || 0), 0)
    const totalBeansUsed = Math.ceil(totalTokensUsed / 1000)

    const latestBalanceTokens = ledgerHistory.items[0]?.balanceAfter ?? 48_500_000
    const latestBalanceBeans = Math.floor(latestBalanceTokens / 1000)

    // 3. 模型占比统计
    const modelMap: Record<string, number> = {}
    usages.forEach((u) => {
      modelMap[u.model] = (modelMap[u.model] || 0) + (u.totalTokens || 0)
    })
    const modelDistribution = Object.entries(modelMap).map(([model, tokens]) => ({
      model,
      tokens,
      percentage: totalTokensUsed > 0 ? Math.round((tokens / totalTokensUsed) * 100) : 0,
    }))

    // 4. 智能体应用占比
    const appDistribution = apps.map((app) => ({
      appCode: app.appCode,
      name: app.name,
      vendor: app.vendor,
      seatsCount: app.activeSeatsCount,
      momaModelTarget: app.momaModelTarget,
    }))

    // 5. 模拟 7 日增量趋势
    const trendDays = ["08-18", "08-19", "08-20", "08-21", "08-22", "08-23", "08-24"]
    const dailyTrend = trendDays.map((day, idx) => ({
      date: day,
      tokens: Math.round(12_000_000 + (idx * 4_500_000) + (Math.sin(idx) * 2_000_000)),
      momaBeans: Math.round(12_000 + (idx * 4_500) + (Math.sin(idx) * 2_000)),
    }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalTokensUsed,
          totalBeansUsed,
          latestBalanceTokens,
          latestBalanceBeans,
          activeMembersCount: members.filter((m) => m.status === "ACTIVE").length,
          totalAllocatedTokens: members.reduce((sum, m) => sum + m.monthlyTokenCap, 0),
          momaClusterStatus: "HEALTHY",
          avgLatencyMs: 24,
          successRate: 99.98,
        },
        modelDistribution,
        appDistribution,
        dailyTrend,
        recentUsages: usages.slice(0, 8),
        recentLedgers: ledgerHistory.items.slice(0, 6),
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "获取大屏监控数据失败" }, { status: 500 })
  }
}
