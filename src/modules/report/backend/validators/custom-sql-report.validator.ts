import { z } from "zod"

const parameterValue = z.union([z.string().max(2_000), z.number().finite(), z.boolean(), z.null()])
const parametersSchema = z.record(z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "参数名只能使用字母、数字和下划线"), parameterValue)

export const executeCustomSqlReportSchema = z.object({
  dataSourceId: z.string().trim().min(1, "请选择数据源"),
  sql: z.string().trim().min(1, "SQL 不能为空").max(20_000, "SQL 不能超过 20000 个字符"),
  parameters: parametersSchema.default({}).superRefine((value, context) => {
    if (Object.keys(value).length > 50) context.addIssue({ code: z.ZodIssueCode.custom, message: "参数不能超过 50 个" })
  }),
  maxRows: z.coerce.number().int().min(1).max(500).default(200),
}).strict()

export type ExecuteCustomSqlReportInput = z.infer<typeof executeCustomSqlReportSchema>
