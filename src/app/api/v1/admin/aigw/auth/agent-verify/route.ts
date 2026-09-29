import { NextResponse } from "next/server"
import { aigwIsvAppRepository } from "@/modules/aigw/backend/repositories/aigw-isv-app.repository"
import { aigwMemberAllocationRepository } from "@/modules/aigw/backend/repositories/aigw-member-allocation.repository"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, appCode } = body

    if (!phone || !appCode) {
      return NextResponse.json({ success: false, error: "缺少必要参数 phone 或 appCode" }, { status: 400 })
    }

    // 1. 校验 ISV 智能体应用状态
    const app = await aigwIsvAppRepository.findByAppCode(appCode)
    if (!app || app.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: `智能体应用 [${appCode}] 未接入或已被停用` }, { status: 403 })
    }

    // 2. 校验员工手机号与政企开通状态
    const member = await aigwMemberAllocationRepository.findByPhone(phone)
    if (!member) {
      return NextResponse.json({
        success: false,
        error: `手机号 [${phone}] 尚未在政企门户开通算力授权，请联系管理员分配`,
      }, { status: 404 })
    }

    if (member.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: `用户 [${member.name}] 算力授权已暂停` }, { status: 403 })
    }

    // 3. 校验该智能体应用是否在授权清单中
    if (!member.allowedApps.includes(appCode)) {
      return NextResponse.json({
        success: false,
        error: `用户 [${member.name}] 未被分配 [${app.name}] 使用权限`,
      }, { status: 403 })
    }

    // 4. 校验月度 Token 配额是否耗尽
    const remainTokens = Math.max(0, member.monthlyTokenCap - member.usedTokens)
    if (remainTokens <= 0) {
      return NextResponse.json({
        success: false,
        error: `用户 [${member.name}] 本月算力额度已耗尽 (上限 ${member.monthlyTokenCap.toLocaleString()} Tokens)，请联系企业管理员增额`,
      }, { status: 429 })
    }

    // 5. 鉴权通过，下发指向 MOMA 平台纳管模型的调用令牌与会话
    return NextResponse.json({
      success: true,
      data: {
        authorized: true,
        member: {
          id: member.id,
          name: member.name,
          phone: member.phone,
          deptName: member.deptName,
          remainTokens,
          usedTokens: member.usedTokens,
          monthlyTokenCap: member.monthlyTokenCap,
          momaBeansBalance: member.momaBeansBalance,
        },
        app: {
          appCode: app.appCode,
          name: app.name,
          vendor: app.vendor,
        },
        momaRouting: {
          targetModel: app.momaModelTarget,
          carrierCluster: "中国移动 MOMA 智算中心 (广州/韶关集群)",
          endpoint: "https://moma.10086.cn/api/v1",
          sessionToken: `moma-sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        },
        injectedMcps: member.phone === "13800000001" ? [
          { code: "mcp-gov-document", name: "国家标准红头公文排版与合规审计", status: "MOUNTED", version: "v2.1" },
          { code: "mcp-meeting-wework", name: "腾讯会议速记与企微待办派发", status: "MOUNTED", version: "v1.4" },
        ] : member.phone === "13911112222" ? [
          { code: "mcp-gitlab-audit", name: "国央企内网 GitLab 源码合规审计与单测生成", status: "MOUNTED", version: "v3.0" },
          { code: "mcp-bidding-audit", name: "政府采购招投标方案比对审查", status: "MOUNTED", version: "v1.8" },
        ] : [
          { code: "mcp-12345-hotline", name: "政务 12345 市民热线诉求与工单分派", status: "MOUNTED", version: "v1.5" },
        ],
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "统一鉴权处理异常" }, { status: 500 })
  }
}
