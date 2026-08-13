import { z } from "zod"

const supportedDrivers = ["postgresql", "mysql", "mariadb", "tidb", "oceanbase", "opengauss", "gaussdb", "kingbase"] as const
const connectionFields = {
  name: z.string().trim().min(1, "数据源名称不能为空").max(100),
  driver: z.enum(supportedDrivers),
  url: z.string().trim().url("数据源连接格式不正确").max(1024),
  username: z.string().trim().min(1, "用户名不能为空").max(255),
}

export const createDataSourceConfigSchema = z.object({
  ...connectionFields,
  password: z.string().min(1, "密码不能为空").max(512),
  remark: z.string().trim().max(500).optional(),
})

export const updateDataSourceConfigSchema = z.object({
  id: z.string().trim().min(1, "数据源 ID 不能为空"),
  ...connectionFields,
  password: z.string().max(512).optional(),
  remark: z.string().trim().max(500).nullable().optional(),
})

export const dataSourceConfigPageSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const testDataSourceConnectionSchema = z.object({
  id: z.string().trim().min(1).optional(),
  driver: z.enum(supportedDrivers).optional(),
  url: z.string().trim().url("数据源连接格式不正确").max(1024).optional(),
  username: z.string().trim().min(1).max(255).optional(),
  password: z.string().max(512).optional(),
}).superRefine((value, ctx) => {
  if (!value.id && (!value.driver || !value.url || !value.username || !value.password)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "请提供数据源 ID 或完整连接参数" })
  }
})

export type CreateDataSourceConfigInput = z.infer<typeof createDataSourceConfigSchema>
export type UpdateDataSourceConfigInput = z.infer<typeof updateDataSourceConfigSchema>
export type DataSourceConfigPageInput = z.infer<typeof dataSourceConfigPageSchema>
export type TestDataSourceConnectionInput = z.infer<typeof testDataSourceConnectionSchema>
