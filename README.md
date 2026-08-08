# ruoyi-all-next

基于 Next.js 15 的企业级全栈管理平台，从 RuoYi-Vue-Pro 全量迁移。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **数据库**: Kysely (运行时查询) + Prisma (Schema 管理)
- **支持的数据库**: PostgreSQL / MySQL / MariaDB / SQLite / TiDB / OceanBase / openGauss / KingbaseES / 达梦
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
# 默认账号: admin / admin123
```

## 接入真实数据库

```bash
# 1. 复制环境配置
cp .env.example .env.local

# 2. 修改 DATABASE_URL 为你的数据库连接
# PostgreSQL: postgresql://user:pass@localhost:5432/ruoyi_next
# MySQL:      mysql://user:pass@localhost:3306/ruoyi_next

# 3. 生成 Prisma Client
npx prisma generate

# 4. 执行数据库迁移
npx prisma db push

# 5. 重启
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

| 等级 | 数据库 | 说明 |
|---|---|---|
| Tier-A | PostgreSQL, MySQL, SQLite, TiDB, OceanBase | 直接支持 |
| Tier-B | openGauss, GaussDB, KingbaseES | 协议兼容 + 方言适配 |
| Tier-C | 达梦, Oracle | 专用连接器 |

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
