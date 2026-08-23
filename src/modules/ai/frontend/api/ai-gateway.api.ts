import { request } from "@/modules/shared/frontend/lib/request"

export type AiPlaygroundInput = {
  model: string
  messages: { role: string; content: string }[]
}

/** 页面只依赖版本化 HTTP 契约，禁止直连 Service。 */
export const aiGatewayApi = {
  playground: (data: AiPlaygroundInput) =>
    request.post<unknown>("/api/v1/admin/ai/playground", data),
}
