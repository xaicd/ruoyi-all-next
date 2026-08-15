import { request } from "@/modules/shared/frontend/lib/request"
import type { {{featureListPascal}}DO } from "@/modules/{{moduleKebab}}/backend/types/{{featureListKebab}}.types"
import type { {{featureListPascal}}CreateInput, {{featureListPascal}}PageQueryInput, {{featureListPascal}}UpdateInput } from "@/modules/{{moduleKebab}}/backend/validators/{{featureListKebab}}.validator"

type {{featureListPascal}}PageData = { items: {{featureListPascal}}DO[]; total: number; page: number; pageSize: number }
const BASE = "/api/v1/admin/{{moduleKebab}}/{{featureListKebab}}"

export const {{featureCamel}}Api = {
  page(params?: Partial<{{featureListPascal}}PageQueryInput>) { return request.get<{{featureListPascal}}PageData>(BASE, params) },
  get(id: string) { return request.get<{{featureListPascal}}DO>(`${BASE}?id=${id}`) },
  create(data: {{featureListPascal}}CreateInput) { return request.post<{ id: string }>(BASE, data) },
  update(data: {{featureListPascal}}UpdateInput) { return request.put<boolean>(BASE, data) },
  delete(id: string) { return request.delete<boolean>(`${BASE}?id=${id}`) },
}
