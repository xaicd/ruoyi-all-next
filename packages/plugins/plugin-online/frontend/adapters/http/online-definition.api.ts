import { request } from "@/modules/shared/frontend/lib/request"
import type { OnlineDefinitionGateway } from "../../ports/online-definition.gateway"

const endpoint = "/api/v1/admin/online/definitions"

export const onlineDefinitionApi: OnlineDefinitionGateway = {
  page: (params) => request.get(endpoint, params).then((response) => {
    if (!response.success || !response.data) throw new Error(response.error ?? "Online 定义加载失败")
    return response.data
  }),
}
