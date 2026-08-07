import { z } from "zod"

export const memberPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  levelId: z.string().optional(),
})

export const memberUserUpdateSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  nickname: z.string().trim().min(1).max(50).optional(),
  mobile: z.string().trim().regex(/^1[3-9]\d{9}$/, "手机号格式不正确").optional(),
  levelId: z.string().optional(),
})

export const memberLevelCreateSchema = z.object({
  name: z.string().trim().min(1).max(50),
  minPoint: z.coerce.number().int().min(0),
  discount: z.coerce.number().min(0).max(100, "折扣不能超过100"),
  icon: z.string().url().optional(),
})

export const memberPointAdjustSchema = z.object({
  userId: z.string().trim().min(1, "userId 不能为空"),
  point: z.coerce.number().int(),
  remark: z.string().trim().min(1).max(200),
})

export type MemberPageQueryInput = z.infer<typeof memberPageQuerySchema>
export type MemberUserUpdateInput = z.infer<typeof memberUserUpdateSchema>
export type MemberLevelCreateInput = z.infer<typeof memberLevelCreateSchema>
export type MemberPointAdjustInput = z.infer<typeof memberPointAdjustSchema>
