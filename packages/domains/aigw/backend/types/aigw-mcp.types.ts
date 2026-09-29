export interface AigwMcpAsset {
  id: string
  mcpCode: string
  name: string
  category: "GOV_DOC" | "MEETING_OA" | "BIDDING" | "DEV_SECURITY" | "HOTLINE" | "TELECOM_CRM" | "CUSTOM"
  icon: string
  version: string
  description: string
  endpoint: string
  authorizedCount: number
  status: "ACTIVE" | "DISABLED"
  isOfficial: boolean
  tenantId: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface CreateMcpAssetInput {
  mcpCode: string
  name: string
  category: "GOV_DOC" | "MEETING_OA" | "BIDDING" | "DEV_SECURITY" | "HOTLINE" | "TELECOM_CRM" | "CUSTOM"
  icon?: string
  version?: string
  description?: string
  endpoint: string
}

export interface UpdateMcpAssetInput {
  id: string
  name?: string
  category?: "GOV_DOC" | "MEETING_OA" | "BIDDING" | "DEV_SECURITY" | "HOTLINE" | "TELECOM_CRM" | "CUSTOM"
  icon?: string
  version?: string
  description?: string
  endpoint?: string
  status?: "ACTIVE" | "DISABLED"
}

export interface McpAssetPageQuery {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  status?: string
}
