/**
 * Member Auth Service - C 端会员注册/登录/登出（真实落库，非 mock）
 *
 * 复用平台底座：lib/crypto（加盐哈希）、auth/jwt（签发 type:'app' JWT）。
 * 登录失败统一错误（防账号枚举）。
 */

import { MemberUserRepository, type MemberUserRow } from "@/modules/member/backend/repositories/member-user.repository"
import { hashPassword, generateSalt, verifyPassword } from "@/modules/shared/backend/lib/crypto"
import { issueJwt } from "@/modules/shared/backend/auth/jwt"
import { AuthenticationError } from "@/modules/shared/backend/auth/context"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { MemberRegisterInput, MemberLoginInput } from "@/modules/member/backend/validators/member-auth.validators"

export type MemberPublic = {
  id: string
  account: string
  email: string | null
  nickname: string
  avatarUrl: string | null
  memberLevel: string
  status: string
}

function toPublic(row: MemberUserRow): MemberPublic {
  return {
    id: row.id,
    account: row.account,
    email: row.email,
    nickname: row.nickname,
    avatarUrl: row.avatarUrl,
    memberLevel: row.memberLevel,
    status: row.status,
  }
}

export class MemberAuthService {
  /** 注册：账号去重 + 加盐哈希落库 */
  static async register(input: MemberRegisterInput): Promise<MemberPublic> {
    const existing = await MemberUserRepository.findByAccount(input.account)
    if (existing) throw new Error("账号已注册")

    const salt = generateSalt()
    const passwordHash = hashPassword(input.password, salt)
    const created = await MemberUserRepository.insert({
      account: input.account,
      email: input.email ?? null,
      passwordHash,
      passwordSalt: salt,
      nickname: input.nickname?.trim() || input.account,
    })
    domainLog.event("member.auth.register", { memberId: created.id, account: created.account })
    return toPublic(created)
  }

  /** 登录：校验密码 → 签发 app JWT。失败统一错误（防枚举） */
  static async login(input: MemberLoginInput): Promise<{ token: string; expiresIn: number; member: MemberPublic }> {
    const member = await MemberUserRepository.findByAccount(input.account)
    const invalid = new AuthenticationError("账号或密码错误")
    if (!member) throw invalid
    if (member.status !== "ACTIVE") throw invalid
    if (!verifyPassword(input.password, member.passwordHash, member.passwordSalt)) throw invalid

    const { token, expiresIn } = issueJwt({
      sub: member.id,
      username: member.account,
      memberId: member.id,
      memberLevel: member.memberLevel,
      roles: [],
      permissions: [],
      type: "app",
    })
    domainLog.event("member.auth.login", { memberId: member.id })
    return { token, expiresIn, member: toPublic(member) }
  }

  /** 登出：无状态 JWT，受理即可（预留 session 撤销扩展） */
  static async logout(memberId: string): Promise<{ success: true }> {
    domainLog.event("member.auth.logout", { memberId })
    return { success: true }
  }
}
