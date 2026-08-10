import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type IpAreaItem = { ip: string; area: string; isp: string }

export class IpAreaService {
  static async query(ip: string): Promise<IpAreaItem> {
    domainLog.event("system.ipArea.query", { ip })
    // Mock: 根据 IP 前缀返回模拟数据
    if (ip.startsWith("192.168")) return { ip, area: "局域网", isp: "内网" }
    if (ip.startsWith("10.")) return { ip, area: "局域网", isp: "内网" }
    if (ip === "127.0.0.1") return { ip, area: "本机", isp: "localhost" }
    return { ip, area: "广东省深圳市", isp: "电信" }
  }

  static async page(input: any) {
    // IP 地区查询一般不分页，这里返回空
    return { items: [], total: 0, page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) { return IpAreaService.query(id) }
  static async create(input: any) { return { id: "mock" } }
  static async update(input: any) { return { id: input.id ?? "mock" } }
  static async delete(id: string) { return { success: true } }
}

// Alias for index.ts re-export
export { IpAreaService as SystemIpAreaService }
