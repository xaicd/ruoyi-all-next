import type { MpPageQueryInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList } from "./mp-setting-store"
import type { MpFan } from "./types"

export class MpFanService {
  static async list(input: MpPageQueryInput) {
    domainLog.event("mp.fan.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const fans = await readSettingList<MpFan>("mp.fans")
    const filtered = keyword
      ? fans.filter((item) => item.nickname.toLowerCase().includes(keyword) || item.accountId.toLowerCase().includes(keyword))
      : fans

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}
