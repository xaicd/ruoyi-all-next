export const nextReactAdminTreeValidatorTemplate = `import { z } from "zod"

export const {{entityName}}TreeInputSchema = z.object({
  id: z.string().min(1, "节点ID不能为空"),
  targetParentId: z.string().nullable(),
})

export const {{entityName}}TreeNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  children: z.array(z.any()).optional(),
})
`
