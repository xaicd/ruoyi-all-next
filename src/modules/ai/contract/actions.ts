import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  aiPageQuerySchema,
  aiModelCreateSchema,
  aiChatDeleteSchema,
} from "../backend/validators"

export const aiPingSchema = z.object({
  n: z.number().optional(),
})

export const AI_ACTION_SCHEMAS = {
  "ai.ping": aiPingSchema,
  "ai.listModels": aiPageQuerySchema,
  "ai.createModel": aiModelCreateSchema,
  "ai.listChats": aiPageQuerySchema,
  "ai.deleteChat": aiChatDeleteSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(AI_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}
