# ruoyi-all-next

基于 Next.js 15 的企业级全栈管理平台，从 RuoYi-Vue-Pro 全量迁移。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **数据库**: PostgreSQL（默认，Prisma Schema/Migration）+ Kysely（运行时查询）
- **运行时方言**: PostgreSQL 默认；MySQL/MariaDB 等需维护独立 Prisma schema 与迁移历史后启用
- **校验**: Zod
- **UI**: React 19 + Tailwind CSS

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（内存模式，无需数据库）
npm run dev

# 3. 打开浏览器
# 首页: http://localhost:3100
# 登录: http://localhost:3100/login
# 登录账号与密码：由 .env.local 的 ADMIN_BOOTSTRAP_USERNAME / ADMIN_BOOTSTRAP_PASSWORD 配置；禁止使用通用默认凭据。
```

## 统一启动脚本

项目根目录提供跨平台启动入口：Windows 使用 `start.bat`，Linux/macOS 使用 `./start.sh`。

```powershell
# 默认：启动 PostgreSQL:5433、Redis:6380，执行迁移，再以前台方式启动 Next.js
.\start.bat

# 仅基础设施和迁移
.\start.bat infra

# 使用已准备好的 .env.local，只启动 Next.js
.\start.bat app

# 构建并后台启动完整 Docker 开发栈
.\start.bat docker

# 无数据库、无 Redis 的内存模式
.\start.bat memory

# 查看或停止项目 Docker 服务（stop 不删除数据卷）
.\start.bat status
.\start.bat stop
```

```bash
./start.sh                 # 默认 dev 模式
./start.sh infra           # PostgreSQL + Redis + migration
./start.sh app             # 仅 Next.js
./start.sh docker          # 完整 Docker 开发栈
./start.sh memory          # 内存模式
./start.sh status
./start.sh stop
```

`start.bat dev` / `start.sh dev` 需要 Docker 与 Node.js；Docker App 模式会占用宿主机 `3100`，若该端口已被占用，请使用 `app` 模式或先释放端口。

## 接入真实数据库

```bash
# 1. 复制环境配置
cp .env.example .env.local

# 2. 启动默认 PostgreSQL（Docker Desktop 需已运行）
npm run db:up

# 3. `.env.local` 默认已指向 PostgreSQL `localhost:5433` 和 Redis `localhost:6380`；如有需要再修改连接变量

# 4. 在 .env.local 设置唯一的 ADMIN_BOOTSTRAP_USERNAME、强 ADMIN_BOOTSTRAP_PASSWORD、ADMIN_BOOTSTRAP_SALT
# 5. 生成 Prisma Client、执行迁移并初始化本地管理员
npm run db:generate
npm run db:migrate
npm run db:seed

# 6. 启动应用
npm run dev
```

## 项目结构

```
src/
├── app/                          # Next.js 路由层（薄壳）
│   ├── api/v1/admin/             # 管理后台 REST API
│   ├── (admin-pages)/admin/      # 管理后台页面
│   ├── login/                    # 登录页
│   └── page.tsx                  # 首页
│
└── modules/                      # 全部业务实现
    ├── shared/backend/lib/       # 基础设施（auth/db/log/event）
    │   └── database/             # 多数据库引擎（Kysely）
    ├── system/                   # 系统管理（用户/角色/菜单/部门/岗位/字典/租户）
    └── infra/                    # 基础设施（配置/定时任务/文件）
```

## 已实现模块

### System 域（完整 CRUD）
- 用户管理 (User)
- 角色管理 (Role)
- 部门管理 (Dept) - 树形
- 菜单管理 (Menu) - 树形
- 岗位管理 (Post)
- 字典管理 (Dict) - 类型 + 数据
- 租户管理 (Tenant)
- 认证登录 (Auth) - JWT 签发/验证/刷新

### Infra 域（完整 CRUD）
- 系统配置 (Config)
- 定时任务 (Job)
- 文件管理 (File)

### 其他域（骨架已生成）
- BPM / Pay / Mall / CRM / ERP / WMS / MES / AI / IoT / IM / MP / Member / Report

## API 规范

- 版本化路径: `/api/v1/admin/*`
- 统一响应格式: `{ success: boolean, data?: T, error?: string }`
- 权限码鉴权: `x-user-id` + `x-permissions` 或 Bearer JWT
- 输入校验: Zod schema

## 数据库兼容

当前 Prisma schema 与版本化迁移固定使用 **PostgreSQL**，也是本地 Docker 与生产环境默认数据库。Kysely 的运行时驱动保留 MySQL 等协议族适配能力；启用异构数据库前，必须同时提供该数据库独立的 Prisma schema、迁移目录和 CI 验证，不能通过 `DB_PROVIDER` 在同一 schema 中切换。

## 开发命令

```bash
npm run dev          # 开发模式 (port 3100)
npm run build        # 生产构建
npm run start        # 生产启动
npm run lint         # 代码检查
npm run check        # 治理检查
```

## 文档

- [架构总览](docs/architecture/ruoyi-all-next-architecture.md)
- [当前进度](docs/architecture/CURRENT-PROGRESS.md)
- [数据库兼容规范](docs/architecture/ruoyi-all-next-database-compatibility.md)
- [开发规范](AGENTS.md)
