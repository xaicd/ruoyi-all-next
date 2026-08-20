import { NextResponse, type NextRequest } from "next/server"
import { matchRemoteDomainUpstream } from "@/modules/shared/backend/lib/domain-pack"

const STATIC_UPSTREAMS: Record<string, string | undefined> = {
  RUOYI_DOMAIN_SYSTEM_UPSTREAM: process.env.RUOYI_DOMAIN_SYSTEM_UPSTREAM,
  RUOYI_DOMAIN_INFRA_UPSTREAM: process.env.RUOYI_DOMAIN_INFRA_UPSTREAM,
  RUOYI_DOMAIN_ONLINE_UPSTREAM: process.env.RUOYI_DOMAIN_ONLINE_UPSTREAM,
  RUOYI_DOMAIN_BPM_UPSTREAM: process.env.RUOYI_DOMAIN_BPM_UPSTREAM,
  RUOYI_DOMAIN_PAY_UPSTREAM: process.env.RUOYI_DOMAIN_PAY_UPSTREAM,
  RUOYI_DOMAIN_REPORT_UPSTREAM: process.env.RUOYI_DOMAIN_REPORT_UPSTREAM,
  RUOYI_DOMAIN_MP_UPSTREAM: process.env.RUOYI_DOMAIN_MP_UPSTREAM,
  RUOYI_DOMAIN_MALL_UPSTREAM: process.env.RUOYI_DOMAIN_MALL_UPSTREAM,
  RUOYI_DOMAIN_MEMBER_UPSTREAM: process.env.RUOYI_DOMAIN_MEMBER_UPSTREAM,
  RUOYI_DOMAIN_CRM_UPSTREAM: process.env.RUOYI_DOMAIN_CRM_UPSTREAM,
  RUOYI_DOMAIN_ERP_UPSTREAM: process.env.RUOYI_DOMAIN_ERP_UPSTREAM,
  RUOYI_DOMAIN_WMS_UPSTREAM: process.env.RUOYI_DOMAIN_WMS_UPSTREAM,
  RUOYI_DOMAIN_MES_UPSTREAM: process.env.RUOYI_DOMAIN_MES_UPSTREAM,
  RUOYI_DOMAIN_AI_UPSTREAM: process.env.RUOYI_DOMAIN_AI_UPSTREAM,
  RUOYI_DOMAIN_IOT_UPSTREAM: process.env.RUOYI_DOMAIN_IOT_UPSTREAM,
  RUOYI_DOMAIN_IM_UPSTREAM: process.env.RUOYI_DOMAIN_IM_UPSTREAM,
  RUOYI_PACK_DOMAIN: process.env.RUOYI_PACK_DOMAIN,
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
])

function headersFrom(source: Headers): Headers {
  const headers = new Headers()
  source.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
  })
  return headers
}

export async function middleware(request: NextRequest) {
  const match = matchRemoteDomainUpstream(request.nextUrl.pathname, STATIC_UPSTREAMS)
  if (!match) return NextResponse.next()

  const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, match.baseUrl)
  const headers = headersFrom(request.headers)
  headers.set("x-ruoyi-upstream-domain", match.domain)
  headers.set("x-forwarded-host", request.headers.get("host") ?? "")
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""))

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer()
  }

  try {
    const upstream = await fetch(target, init)
    const responseHeaders = headersFrom(upstream.headers)
    responseHeaders.set("x-ruoyi-upstream-domain", match.domain)
    return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders })
  } catch {
    return NextResponse.json(
      { success: false, error: `domain upstream unavailable: ${match.domain}` },
      { status: 502, headers: { "x-ruoyi-upstream-domain": match.domain } },
    )
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
}
