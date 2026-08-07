import type {
  MemberPageQueryInput,
  MemberUserUpdateInput,
  MemberLevelCreateInput,
  MemberPointAdjustInput,
} from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MemberUser = {
  id: string
  nickname: string
  mobile: string
  levelId: string
  totalPoint: number
  createdAt: string
}

type MemberLevel = {
  id: string
  name: string
  minPoint: number
  discount: number
  icon?: string
}

type MemberPointRecord = {
  id: string
  userId: string
  point: number
  remark: string
  createdAt: string
}

const MOCK_LEVELS: MemberLevel[] = [
  { id: "level-001", name: "普通会员", minPoint: 0, discount: 100 },
  { id: "level-002", name: "银卡会员", minPoint: 1000, discount: 95 },
  { id: "level-003", name: "金卡会员", minPoint: 5000, discount: 90 },
]

const MOCK_MEMBERS: MemberUser[] = [
  { id: "mem-001", nickname: "张三", mobile: "13800000001", levelId: "level-002", totalPoint: 1200, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mem-002", nickname: "李四", mobile: "13800000002", levelId: "level-001", totalPoint: 300, createdAt: "2026-02-15T00:00:00.000Z" },
]

const MOCK_POINT_RECORDS: MemberPointRecord[] = [
  { id: "point-001", userId: "mem-001", point: 200, remark: "购物奖励", createdAt: "2026-03-01T00:00:00.000Z" },
]

export class MemberService {
  static async listUsers(input: MemberPageQueryInput) {
    domainLog.event("member.user.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      levelId: input.levelId,
    })

    let filtered = [...MOCK_MEMBERS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter(
        (m) => m.nickname.toLowerCase().includes(kw) || m.mobile.includes(kw),
      )
    }
    if (input.levelId) {
      filtered = filtered.filter((m) => m.levelId === input.levelId)
    }

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async updateUser(input: MemberUserUpdateInput) {
    const user = MOCK_MEMBERS.find((m) => m.id === input.id)
    if (!user) throw new Error("会员不存在")

    if (input.nickname) user.nickname = input.nickname
    if (input.mobile) user.mobile = input.mobile
    if (input.levelId) {
      const level = MOCK_LEVELS.find((l) => l.id === input.levelId)
      if (!level) throw new Error("会员等级不存在")
      user.levelId = input.levelId
    }

    domainLog.event("member.user.update", { userId: input.id })
    domainLog.audit("member.user.update", {
      targetType: "MEMBER_USER",
      targetId: input.id,
      changes: input,
    })

    return user
  }

  static async listLevels(input: MemberPageQueryInput) {
    domainLog.event("member.level.list", { page: input.page, pageSize: input.pageSize })
    const start = (input.page - 1) * input.pageSize
    return {
      items: MOCK_LEVELS.slice(start, start + input.pageSize),
      total: MOCK_LEVELS.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async createLevel(input: MemberLevelCreateInput) {
    const exists = MOCK_LEVELS.find((l) => l.name === input.name)
    if (exists) throw new Error("等级名称已存在")

    const id = `level-${Date.now()}`
    const level: MemberLevel = { id, ...input }
    MOCK_LEVELS.push(level)

    domainLog.event("member.level.create", { levelId: id, name: input.name })
    domainLog.audit("member.level.create", {
      targetType: "MEMBER_LEVEL",
      targetId: id,
      name: input.name,
      minPoint: input.minPoint,
    })

    return level
  }

  static async listPoints(input: MemberPageQueryInput) {
    domainLog.event("member.point.list", { page: input.page, pageSize: input.pageSize })
    const start = (input.page - 1) * input.pageSize
    return {
      items: MOCK_POINT_RECORDS.slice(start, start + input.pageSize),
      total: MOCK_POINT_RECORDS.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async adjustPoint(input: MemberPointAdjustInput) {
    const user = MOCK_MEMBERS.find((m) => m.id === input.userId)
    if (!user) throw new Error("会员不存在")

    user.totalPoint += input.point
    if (user.totalPoint < 0) user.totalPoint = 0

    const id = `point-${Date.now()}`
    MOCK_POINT_RECORDS.push({
      id,
      userId: input.userId,
      point: input.point,
      remark: input.remark,
      createdAt: new Date().toISOString(),
    })

    domainLog.event("member.point.adjust", { userId: input.userId, point: input.point })
    domainLog.audit("member.point.adjust", {
      targetType: "MEMBER_USER",
      targetId: input.userId,
      point: input.point,
      remark: input.remark,
    })

    return { userId: user.id, totalPoint: user.totalPoint, adjusted: input.point }
  }
}
