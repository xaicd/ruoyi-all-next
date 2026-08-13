# 租户套餐与菜单初始化

套餐和菜单的唯一业务来源是本工作区的 RuoYi SQL：`../ruoyi-vue-pro/sql/mysql/ruoyi-vue-pro.sql`。不要手写另一套菜单或套餐目录。

## 生成与部署

1. 上游 SQL 更新后执行 `npm run catalog:sync:ruoyi`，生成 `prisma/data/menus.seed-data.ts` 与 `prisma/data/tenant-packages.seed-data.ts`。
2. 部署数据库结构：`npm run db:migrate`。
3. 写入可重复的目录与关联数据：`npm run db:seed`。

`db:seed` 会将套餐菜单完整写入 `system_tenant_package_menu`，并将旧的本地草稿套餐（1/2/3）软删除；不会删除历史记录。Docker 数据库初始化不直接挂载该业务 SQL，因为 Prisma 表结构必须先完成迁移。

## 租户运行边界

- 新建租户必须选择启用套餐，并同时创建首个租户管理员。
- 管理员角色菜单由套餐菜单初始化；登录、权限详情和侧栏都以角色菜单与套餐菜单的交集作为最终权限。
- 租户禁用、过期、未分配套餐或套餐停用时，普通租户用户不能重新登录。
- 租户内新增账号会执行 `accountCount` 额度检查。

平台管理员是控制面身份，保留跨租户套餐与租户管理能力。平台身份须由已验签 JWT 的 `platform-admin` 角色决定。
