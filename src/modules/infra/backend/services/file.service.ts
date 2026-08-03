import type { InfraPageQueryInput } from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraFileItem = {
  id: string
  filename: string
  storage: "LOCAL" | "S3"
  sizeKb: number
  url: string
  uploadedAt: string
}

export class InfraFileService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.file.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const files = await readSettingList<InfraFileItem>("infra.files")
    const filtered = keyword
      ? files.filter(
          (item) =>
            item.filename.toLowerCase().includes(keyword) ||
            item.storage.toLowerCase().includes(keyword),
        )
      : files

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}
