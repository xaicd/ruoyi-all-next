export const nextReactAdminWorkflowValidatorTemplate = `import { z } from "zod"

export const create{{entityName}}WorkflowSchema = z.object({
  title: z.string().trim().min(1, "标题不能为空"),
  remark: z.string().trim().max(200).optional(),
})

export const audit{{entityName}}WorkflowSchema = z.object({
  id: z.string().trim().min(1, "流程ID不能为空"),
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().trim().max(200).optional(),
})
`
