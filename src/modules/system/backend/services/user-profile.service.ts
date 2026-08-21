import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { hashPassword, generateSalt, verifyPassword } from "@/modules/shared/backend/lib/crypto"

export class UserProfileService {
  static async getProfile(userId: string) {
    const user = await SystemUserRepository.findById(userId)
    if (!user) throw new Error("用户不存在")
    domainLog.event("system.userProfile.get", { userId })
    const { password, salt, ...profile } = user
    return profile
  }

  static async updateProfile(userId: string, input: { nickname?: string; phone?: string; email?: string }) {
    const user = await SystemUserRepository.findById(userId)
    if (!user) throw new Error("用户不存在")
    await SystemUserRepository.update(userId, input)
    domainLog.event("system.userProfile.update", { userId })
    return { success: true }
  }

  static async updatePassword(userId: string, input: { oldPassword: string; newPassword: string }) {
    const user = await SystemUserRepository.findById(userId)
    if (!user) throw new Error("用户不存在")

    const valid = verifyPassword(input.oldPassword, user.password, user.salt)
    if (!valid) throw new Error("原密码不正确")

    const newSalt = generateSalt()
    const newHash = hashPassword(input.newPassword, newSalt)
    await SystemUserRepository.update(userId, { password: newHash, salt: newSalt })
    domainLog.event("system.userProfile.updatePassword", { userId })
    domainLog.audit("system.userProfile.updatePassword", { targetType: "USER", targetId: userId })
    return { success: true }
  }

  static async getUserProfile(input: { userId: string }) {
    return this.getProfile(input.userId)
  }

  static async updateUserProfile(input: { userId: string; nickname?: string; phone?: string; email?: string }) {
    const { userId, ...patch } = input
    return this.updateProfile(userId, patch)
  }
}
