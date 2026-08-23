# 业务项目身份初始化

本仓库是实际业务项目的默认底座。每个新项目复制一次代码、初始化一次数据库，之后只改展示身份，不重做系统能力。

## 改什么

| 项 | 位置 | 何时生效 |
|---|---|---|
| 平台名称、简称、登录文案、版权 | `src/modules/shared/contract/project-profile.json` | 刷新页面 |
| Logo / Favicon | `public/branding/logo.svg`、`public/branding/favicon.svg` | 刷新页面 |
| 默认租户名称、编码、联系人 | 同上 JSON 的 `tenants` | `npm run db:seed` |
| 租户套餐显示名 | 同上 JSON 的 `packages`（id 保持 `111` / `113`） | `npm run db:seed` |
| 管理员显示名 | 同上 JSON 的 `bootstrapAdmin.nickname` | `npm run db:seed` |
| 管理员账号和密码 | `.env.local` 的 `ADMIN_BOOTSTRAP_*` | `npm run db:seed` |

不要把密码写进 JSON。菜单目录仍来自 RuoYi SQL 同步，不按项目手写第二套菜单。

## 初始化顺序

```bash
cp .env.example .env.local
# 编辑 project-profile.json，替换 public/branding 下的 Logo
# 在 .env.local 写入本项目唯一管理员账号
npm install
npm run db:up
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

租户编码只在首次 seed 时写入；以后改显示名可以再跑 seed，不要改已在使用的 `tenants[].code`。

## 不要改的

- 域目录、API 契约、权限码、菜单树结构
- 跨域 Facade / RPC
- 数据库 schema（除非该业务项目真的要加表）
