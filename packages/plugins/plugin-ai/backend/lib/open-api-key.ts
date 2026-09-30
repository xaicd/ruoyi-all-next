/** 开放网关从请求头读取调用令牌，不落日志。 */
export function readOpenApiKey(request: Request): string {
  const header = request.headers.get("authorization") || ""
  const match = /^Bearer\s+(.+)$/i.exec(header)
  if (match?.[1]) return match[1].trim()
  return request.headers.get("x-api-key")?.trim() || ""
}

export function clientIp(request: Request): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined
}
