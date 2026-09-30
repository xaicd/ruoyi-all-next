/**
 * Member Profile Service - C 端会员个人中心（真实落库）
 */

import { MemberUserRepository } from "@/modules/member/backend/repositories/member-user.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { MemberProfileUpdateInput } from "@/modules/member/backend/validators/member-auth.validators"
import type { MemberPublic } from "@/modules/member/backend/services/member-auth.service"

function toPublic(row: NonNullable<Awaited<ReturnType<typeof MemberUserRepository.findById>>>): MemberPublic {
  return {
    id: row.id,
    account: row.account,
    email: row.email,
    nickname: row.nickname,
    avatarUrl: row.avatarUrl,
    memberLevel: row.memberLevel,
    status: row.status,
    extraFields: row.extraFields ?? {},
  }
}

export class MemberProfileService {
  static async getProfile(memberId: string): Promise<MemberPublic> {
    const row = await MemberUserRepository.findById(memberId)
    if (!row) throw new Error("会员不存在")
    return toPublic(row)
  }

  static async updateProfile(memberId: string, input: MemberProfileUpdateInput): Promise<MemberPublic> {
    const existing = await MemberUserRepository.findById(memberId)
    if (!existing) throw new Error("会员不存在")
    // 动态字段：把提交的 extraFields 与既有合并（客户加的字段值）
    const mergedExtra = input.extraFields
      ? { ...(existing.extraFields ?? {}), ...input.extraFields }
      : undefined
    const updated = await MemberUserRepository.updateProfile(memberId, {
      nickname: input.nickname,
      avatarUrl: input.avatarUrl,
      extraFields: mergedExtra,
    })
    domainLog.event("member.profile.update", { memberId })
    return toPublic(updated)
  }
}
