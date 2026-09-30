import { request } from "@/modules/shared/frontend/lib/request"
import { AigwMcpAsset, CreateMcpAssetInput, UpdateMcpAssetInput, McpAssetPageQuery } from "../../backend/types/aigw-mcp.types"

export const mcpHubApi = {
  async page(params: McpAssetPageQuery = {}) {
    return request.get<{ list: AigwMcpAsset[]; total: number }>("/api/v1/admin/aigw/mcp-hub", { params })
  },

  async create(data: CreateMcpAssetInput) {
    return request.post<AigwMcpAsset>("/api/v1/admin/aigw/mcp-hub", data)
  },

  async update(data: UpdateMcpAssetInput) {
    return request.put<AigwMcpAsset>("/api/v1/admin/aigw/mcp-hub", data)
  },

  async delete(id: string) {
    return request.delete<{ success: boolean }>(`/api/v1/admin/aigw/mcp-hub?id=${id}`)
  },
}
