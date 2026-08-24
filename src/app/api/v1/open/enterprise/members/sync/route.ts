import { NextResponse } from "next/server"
import { aigwMemberAllocationRepository } from "@/modules/aigw/backend/repositories/aigw-member-allocation.repository"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { members } = body

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ success: false, error: "members 数组不能为空" }, { status: 400 })
    }

    const results = []
    for (const m of members) {
      if (!m.phone || !m.name) continue
      
      const payload = {
        phone: m.phone,
        name: m.name,
        deptName: m.deptName || "数智业务部",
        role: m.role || "办事员",
        allowedApps: Array.isArray(m.allowedApps) && m.allowedApps.length > 0 ? m.allowedApps : ["workbuddy"],
        monthlyTokenCap: Number(m.monthlyTokenCap) || 10_000_000,
        usedTokens: 0,
        momaBeansBalance: Math.floor((Number(m.monthlyTokenCap) || 10_000_000) / 1000),
        status: "ACTIVE" as const,
      }

      const saved = await aigwMemberAllocationRepository.create(payload)
      results.push({
        phone: m.phone,
        name: m.name,
        status: "ACTIVE",
        memberId: saved.id,
        notifiedBySms: !!m.sendSmsNotification,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCount: members.length,
        successCount: results.length,
        failedCount: members.length - results.length,
        items: results,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "批量同步员工失败" }, { status: 500 })
  }
}
