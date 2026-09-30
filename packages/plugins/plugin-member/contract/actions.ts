import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  memberPageQuerySchema,
  memberUserUpdateSchema,
  memberLevelCreateSchema,
  memberPointAdjustSchema,
} from "../backend/validators"

export const memberPingSchema = z.object({
  n: z.number().optional(),
})

export const MEMBER_ACTION_SCHEMAS = {
  "member.ping": memberPingSchema,
  "member.listUsers": memberPageQuerySchema,
  "member.updateUser": memberUserUpdateSchema,
  "member.listLevels": memberPageQuerySchema,
  "member.createLevel": memberLevelCreateSchema,
  "member.listPoints": memberPageQuerySchema,
  "member.adjustPoint": memberPointAdjustSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(MEMBER_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}
