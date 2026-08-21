import { z } from "zod"
import { pageQuerySchema } from "./common.validators"

export const postListQuerySchema = pageQuerySchema.extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createPostSchema = z.object({
  name: z.string().trim().min(1).max(50),
  code: z.string().trim().min(1).max(64),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  remark: z.string().trim().max(500).optional(),
})

export type PostListQueryInput = z.infer<typeof postListQuerySchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
