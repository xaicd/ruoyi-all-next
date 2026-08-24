import { request } from "@/modules/shared/frontend/lib/request"

export interface DashboardData {
  summary: {
    totalTokensUsed: number
    totalBeansUsed: number
    latestBalanceTokens: number
    latestBalanceBeans: number
    activeMembersCount: number
    totalAllocatedTokens: number
    momaClusterStatus: string
    avgLatencyMs: number
    successRate: number
  }
  modelDistribution: Array<{ model: string; tokens: number; percentage: number }>
  appDistribution: Array<{ appCode: string; name: string; vendor: string; seatsCount: number; momaModelTarget: string }>
  dailyTrend: Array<{ date: string; tokens: number; momaBeans: number }>
  recentUsages: Array<any>
  recentLedgers: Array<any>
}

export const AigwDashboardApi = {
  async getDashboardData(tenantId = "1"): Promise<DashboardData> {
    const res: any = await request.get(`/api/v1/admin/aigw/dashboard?tenantId=${tenantId}`)
    return res?.data || res
  },
}
