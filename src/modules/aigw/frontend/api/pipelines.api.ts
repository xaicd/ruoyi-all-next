import { request } from "@/modules/shared/frontend/lib/request"

export function getSplitPage(params?: any) {
  return request.get("/api/v1/admin/aigw/pipelines", { params })
}

export const AigwSplitApi = {
  page: (params?: any) => getSplitPage(params).then((r: any) => ({ success: true, data: r })),
}
