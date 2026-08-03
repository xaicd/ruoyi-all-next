import type { MpPageQueryInput, MpSendMessageInput } from "../validators"
import { MpAccountService } from "./account.service"
import { MpFanService } from "./fan.service"
import { MpMessageService } from "./message.service"

export class MpService {
  static async listAccounts(input: MpPageQueryInput) {
    return MpAccountService.list(input)
  }

  static async listFans(input: MpPageQueryInput) {
    return MpFanService.list(input)
  }

  static async sendMessage(input: MpSendMessageInput) {
    return MpMessageService.send(input)
  }
}
