import { z } from "zod"

export const menuQuerySchema = z.object({
  mode: z.enum(["tree", "list", "tenant-package", "role-assign"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  roleId: z.string().trim().min(1).optional(),
})

export const createMenuSchema = z.object({
  name: z.string().trim().min(1).max(50),
  type: z.enum(["DIR", "MENU", "BUTTON"]),
  parentId: z.string().trim().nullable().optional(),
  permission: z.string().trim().max(100).optional(),
  path: z.string().trim().max(200).optional(),
  component: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(100).optional(),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  visible: z.boolean().default(true),
  keepAlive: z.boolean().default(true),
})

export type MenuQueryInput = z.infer<typeof menuQuerySchema>
export type CreateMenuInput = z.infer<typeof createMenuSchema>
