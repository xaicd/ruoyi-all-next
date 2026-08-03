import type { {{modulePascal}}PageQueryInput } from "../validators"

type {{modulePascal}}{{featureListPascal}} = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
}

const MOCK_ITEMS: {{modulePascal}}{{featureListPascal}}[] = [
  { id: "{{moduleKebab}}-001", name: "{{moduleLabel}}{{featureListLabel}}示例", status: "ACTIVE" },
]

export class {{modulePascal}}Service {
  static async list{{featureListPascal}}(input: {{modulePascal}}PageQueryInput) {
    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword ? MOCK_ITEMS.filter((item) => item.name.toLowerCase().includes(keyword)) : MOCK_ITEMS
    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}
