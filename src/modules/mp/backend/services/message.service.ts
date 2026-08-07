import type { MpSendMessageInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList } from "./mp-setting-store"
import type { MpAccount } from "./types"

export class MpMessageService {
  static async send(input: MpSendMessageInput) {
    domainLog.event("mp.message.send", {
      accountId: input.accountId,
      contentLength: input.content.length,
    })

    const accounts = await readSettingList<MpAccount>("mp.accounts")
    const account = accounts.find((item) => item.id === input.accountId)
    if (!account) {
      throw new Error("公众号账号不存在")
    }

    domainLog.audit("mp.message.send", {
      targetType: "MP_ACCOUNT",
      targetId: input.accountId,
    })

    return {
      accountId: input.accountId,
      contentLength: input.content.length,
      status: "QUEUED",
    }
  }
}
