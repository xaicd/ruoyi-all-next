import type { MpPageQueryInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList } from "./mp-setting-store"
import type { MpAccount } from "./types"

export class MpAccountService {
  static async list(input: MpPageQueryInput) {
    domainLog.event("mp.account.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const accounts = await readSettingList<MpAccount>("mp.accounts")
    const filtered = keyword
      ? accounts.filter((item) => item.name.toLowerCase().includes(keyword) || item.appId.toLowerCase().includes(keyword))
      : accounts

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}
