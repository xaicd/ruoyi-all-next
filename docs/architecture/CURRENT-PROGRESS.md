# ruoyi-all-next 当前进度与待办

更新时间：2026-08-08

## 已完成

1. modules-first 架构重构完成
2. 15 域全量代码生成（388 Controller → 1400+ 文件）
3. 微服务治理基础设施 15 个组件就绪
4. 多端 API 版本化（/api/v1/admin、/api/v1/app、/api/v1/open）
5. 低代码引擎核心（CodegenEngine + SchemaReader + Preview API）
6. Build 通过（typescript.ignoreBuildErrors=true 临时开启）
7. ui-ux-pro-max 规范集成
8. ✅ P0 目录结构调整全部完成
9. ✅ 多数据库兼容架构（Kysely + Prisma 双引擎）
10. ✅ System 域完整 CRUD：User/Role/Dept/Menu/Post/Dict/Tenant/TenantPackage
11. ✅ Auth 认证链路：JWT + 双重 MD5+Salt 密码
12. ✅ Docker 部署方案：4 环境 + Traefik
13. ✅ 前端完整 Admin Layout：
    - RuoYi 风格二级折叠侧边栏
    - 7 个菜单分组（系统管理/认证安全/消息通知/基础设施/支付中心/CRM/系统监控）
    - 顶栏面包屑 + 用户头像 + 退出
    - 侧边栏折叠/展开
    - Auth Guard 路由守卫
14. ✅ 业务域扩展：
    - Infra：Config/Job/File + 代码生成可视化
    - Pay：订单/退款 列表+筛选
    - CRM：客户管理 CRUD
15. ✅ 对标 yudao-ui-admin-vue3 菜单层级
16. ✅ 低代码引擎完整实现：
    - 代码生成器：导入表 → 编辑列配置 → 预览 → 下载 ZIP
    - Schema Reader：Prisma Schema 解析 + DB Introspection + Mock fallback
    - Puck 页面构建器：拖拽式搭建（ProTable/Form/StatCard/Container/Button）
    - 模板引擎：Handlebars 模板管理
17. ✅ API Route 规范文档（docs/guides/api-route-conventions.md）
18. ✅ 前端统一请求封装（request client + API 路径常量）

## 当前问题

1. typescript.ignoreBuildErrors=true 需最终关闭
2. 密码加密已改为双重 MD5 + Salt（对标 RuoYi 原版）
3. 非 system/infra/pay 域的 Service 仍为旧骨架，待后续按模式补全
4. 侧边栏 Logo 和用户信息待接入真实 auth state

## 可访问页面清单

| 路径 | 页面 | 状态 |
|---|---|---|
| / | 首页（着陆页） | ✅ |
| /login | 登录页 | ✅ |
| /admin/system/users | 用户管理 | ✅ CRUD |
| /admin/system/roles | 角色管理 | ✅ CRUD |
| /admin/system/menus | 菜单管理 | ✅ 树形 CRUD |
| /admin/system/depts | 部门管理 | ✅ 树形 CRUD |
| /admin/system/posts | 岗位管理 | ✅ CRUD |
| /admin/system/dicts | 字典管理 | ✅ CRUD |
| /admin/infra/configs | 系统配置 | ✅ CRUD |
| /admin/infra/job-center | 定时任务 | ✅ CRUD + 手动触发 |
| /admin/infra/files | 文件管理 | ✅ 列表 + 删除 |
| /admin/pay/orders | 支付订单 | ✅ 列表 + 筛选 |
| /admin/pay/refunds | 退款订单 | ✅ 列表 + 筛选 |

## 下一步待办（按优先级）

### P0：让项目能跑起来 ✅ DONE
- ~~删除 src/backend/ 和 src/lib/~~
- ~~重命名 src/app/(admin) → src/app/(admin-pages)~~
- ~~旧 api/admin/ routes 迁移到 api/v1/admin/~~

### P1：数据库基础设施 ✅ DONE
- ~~创建 Prisma Schema（system + infra 核心表）~~
- ~~搭建 Kysely 多数据库 query engine~~
- ~~实现 User Repository（双模式）~~
- ~~补全 User CRUD 全链路（Service → API → Page）~~

### P2：按 User 模式复制到其他核心模块 ✅ DONE
- ✅ Role（角色）Repository + Service + API (list/create/update/delete/status)
- ✅ Dept（部门）Repository + Service + API (tree/list/create/update/delete)
- ✅ Menu（菜单）Repository + Service + API (tree/list/create/update/delete)
- ✅ Post（岗位）Repository + Service + API (list/create/update/delete)
- ✅ Dict（字典类型+数据）Repository + Service + API (types/data CRUD)
- ✅ Tenant（租户）Repository + Service + API (list/create/update/delete/status)

### P3：Infra 域实战接入 ✅ DONE
- ✅ InfraConfig Repository + Service + API（Kysely + 内存双模）
- ✅ InfraJob 定时任务 Repository + Service + API（CRUD + 手动触发）
- ✅ InfraFile 文件管理 Repository + Service + API（上传记录 + 删除）
- TODO 接入真实调度引擎（cron-based scheduler）
- TODO 接入真实文件存储（S3/OSS/MinIO）

### P4：类型修复
- 关闭 ignoreBuildErrors
- 修复所有 TypeScript 类型错误
- 补齐缺失的 Service 方法

### P5：大域子域拆分
- mall: product/trade/promotion/statistics
- mes: cal/md/pro/qc/tm/wm
- system: auth/user/permission/tenant/notify/log

## 关键文件位置

- 架构文档：docs/architecture/ruoyi-all-next-architecture.md
- 开发规范：AGENTS.md
- Prisma Schema：prisma/schema.prisma
- 数据库基础设施：src/modules/shared/backend/lib/database/
- User Repository：src/modules/system/backend/repositories/user.repository.ts
- User Service：src/modules/system/backend/services/user.service.ts
- User API：src/app/api/v1/admin/system/users/route.ts
- User Page：src/modules/system/frontend/pages/users.page.tsx
- 权限码：src/modules/shared/backend/constants/permissions.ts
- DB 配置示例：.env.example
- 迁移脚本：scripts/migrate-api-routes-to-v1.cjs
- 低代码引擎：src/modules/infra/backend/services/codegen-engine.service.ts

## 新对话启动指令

读取以下文件了解上下文：
1. docs/architecture/CURRENT-PROGRESS.md（本文件）
2. docs/architecture/ruoyi-all-next-architecture.md
3. AGENTS.md
4. prisma/schema.prisma
5. src/modules/shared/backend/lib/database/index.ts
