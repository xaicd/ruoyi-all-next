type AreaInfo = {
  ip: string
  province: string
  city: string
}

const AREA_BOOK: Record<string, AreaInfo> = {
  "127.0.0.1": { ip: "127.0.0.1", province: "Local", city: "Local" },
}

export function resolveIpArea(ip: string) {
  return AREA_BOOK[ip] ?? { ip, province: "UNKNOWN", city: "UNKNOWN" }
}
