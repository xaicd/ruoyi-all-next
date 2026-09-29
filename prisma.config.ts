import "dotenv/config"
import { defineConfig } from "prisma/config"

// Prisma ORM v7 起, datasource 的 url 不再允许写在 schema.prisma 中, 统一由本文件承载。
// 这里刻意使用 process.env 而非 prisma/config 的 env() 助手: env() 在变量缺失时会抛错,
// 而 prisma generate 并不需要数据库连接串 —— 本地与 CI 均在无 DATABASE_URL 下执行 generate,
// 用 env() 会让这些流程直接失败。仅在真正需要连接的 migrate/db 命令上才要求该变量。
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    // 仅 `prisma migrate diff --to-migrations` 需要（它要重放迁移到影子库）。
    // 注意**必须条件式带上**：Prisma 会校验该字段不能为空字符串，
    // 写成 `shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL ?? ""` 会让
    // 未设置该变量的所有 prisma 命令（migrate status / resolve / deploy）直接报错。
    ...(process.env.SHADOW_DATABASE_URL ? { shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL } : {}),
  },
})
