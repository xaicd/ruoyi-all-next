import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { {{featureListPascal}}CreateInput, {{featureListPascal}}PageQueryInput, {{featureListPascal}}UpdateInput } from "../validators/{{featureListKebab}}.validator"

type {{featureListPascal}} = { id: string; name: string; status: "ACTIVE" | "DISABLED" }
const MOCK_ITEMS: {{featureListPascal}}[] = []
let nextId = 100

export class {{featureListPascal}}Service {
  static async page(input: {{featureListPascal}}PageQueryInput) {
    const start = (input.page - 1) * input.pageSize
    return { items: MOCK_ITEMS.slice(start, start + input.pageSize), total: MOCK_ITEMS.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) {
    const item = MOCK_ITEMS.find((value) => value.id === id)
    if (!item) throw new Error("{{featureListLabel}}不存在")
    return item
  }
  static async create(input: {{featureListPascal}}CreateInput) {
    const id = "{{featureListKebab}}-" + ++nextId
    const item: {{featureListPascal}} = { id, name: input.name ?? "", status: input.status ?? "ACTIVE" }
    MOCK_ITEMS.push(item)
    domainLog.audit("{{moduleKebab}}.{{featureCamel}}.create", { targetType: "{{moduleKebab}}_{{featureListPascal}}", targetId: id })
    return { id }
  }
  static async update(input: {{featureListPascal}}UpdateInput) {
    const item = await this.get(input.id)
    Object.assign(item, input)
    return true
  }
  static async delete(id: string) {
    const index = MOCK_ITEMS.findIndex((value) => value.id === id)
    if (index < 0) throw new Error("{{featureListLabel}}不存在")
    MOCK_ITEMS.splice(index, 1)
    return true
  }
}
