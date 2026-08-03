export const nextReactAdminValidatorTemplate = `import { z } from "zod"

export const {{validatorName}} = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const create{{entityName}}Schema = z.object({
  name: z.string().trim().min(1, "名称不能为空"),
})

export type Create{{entityName}}Input = z.infer<typeof create{{entityName}}Schema>
`
