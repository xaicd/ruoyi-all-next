# ruoyi-all-next

`ruoyi-all-next` 是基于 `ruoyi-vue-pro` + `yudao-ui-admin-vue3` 思路，在 Next.js 技术栈上的通用业务基座。

## 1. 定位

1. 面向多业务系统复用（不仅当前项目）
2. 面向 AI + 工程师协同开发
3. 面向规范驱动的模块化交付

## 2. 核心原则

1. 路由薄层：参数解析 + 鉴权 + 调 Service
2. 业务内聚：复杂逻辑只在 Service
3. 强约束：Validator、权限码、日志审计必选
4. 模板优先：先套模板，再填业务

## 3. 目录说明

```text
src/
  app/
    (admin)/admin/system/
    api/admin/system/
  backend/
    services/
    validators/
  frontend/
    templates/
```

## 4. 首批模块

1. 在线用户：`online-users`
2. 登录日志：`login-logs`
3. 操作日志：`operate-logs`

## 5. 新模块开发流程

1. 新建 validator schema
2. 新建 service（含日志事件）
3. 新建 API route（薄层）
4. 新建页面模板实例
5. 注册权限码和菜单
6. 编写至少 1 条关键路径测试

## 6. 一键初始化与运行（子项目入口）

`ruoyi-all-next` 已支持独立启动，可在当前目录直接运行。

```bash
cd apps/ruoyi/ruoyi-all-next
npm run quick-start
```

默认行为：

1. 自动安装依赖（首次）
2. 使用本地最小模式启动（无需数据库）
3. 启动 Next 开发服务器（默认 `3100`）

可选参数：

```bash
# 跳过基础设施初始化（仅启动开发）
npm run quick-start -- --skip-init

# 跳过门禁检查（本地临时调试）
npm run quick-start -- --skip-check

# 启用 root 初始化（需要仓库根已提供 docker/db 脚本）
npm run quick-start -- --root-init
```

补充：

1. `npm run dev`：直接本地开发
2. `npm run build && npm run start`：生产模式验证
3. `npm run init:root`：手动触发仓库根初始化链路

## 7. 使用模板能力扩展新功能

### 7.1 通过页面导出模板

管理后台进入 `infra/template-engine`，可选择三种导出模式：

1. 全栈模板包
2. 当前模板
3. Service 设计模式四件套（组合包一键展开）

### 7.2 通过命令行脚手架

```bash
cd apps/ruoyi/ruoyi-all-next

# 一键生成 Service 设计模式四件套
npm run scaffold -- --pack service-pattern --module system/user --entity SystemUser --service SystemUserService --permission-update SYSTEM_USER_UPDATE

# 生成指定模板编码
npm run scaffold -- --templates next-react-admin-route,next-react-admin-service --module mall/product --entity MallProduct --service MallProductService
```

默认输出根目录是 `apps/ruoyi/ruoyi-all-next`，若文件已存在需加 `--force` 才会覆盖。

## 7.3 ruoyi 命令入口约定

`ruoyi:*` 命令统一从子项目目录执行：

```bash
cd apps/ruoyi/ruoyi-all-next
npm run ruoyi:full:scan
npm run ruoyi:deep:scan
npm run ruoyi:mini:scan
npm run ruoyi:matrix:check:strict
npm run ruoyi:governance:check:strict
```

## 8. 开发检查清单

1. API 响应结构是否统一
2. 是否无 roles 硬编码
3. 是否有 event + audit 日志
4. 是否有分页筛选
5. 是否有最小测试覆盖

## 9. 参考文档

1. `docs/architecture/ruoyi-all-next-foundation.md`
2. `docs/architecture/ruoyi-system-foundation-study.md`
3. `apps/ruoyi/ruoyi-all-next/docs/architecture/ruoyi-native-capabilities-catalog.md`
4. `apps/ruoyi/ruoyi-all-next/docs/architecture/artifacts/ruoyi-full-scan-2026-08-02.md`
5. `apps/ruoyi/ruoyi-all-next/docs/architecture/system-core-implementation-checklist.md`
6. `apps/ruoyi/ruoyi-all-next/docs/architecture/artifacts/ruoyi-domain-evidence-2026-08-02.md`
7. `apps/ruoyi/ruoyi-all-next/docs/architecture/ruoyi-full-migration-board.md`
8. `apps/ruoyi/ruoyi-all-next/docs/architecture/yudao-boot-mini-core-foundation-study.md`
9. `apps/ruoyi/ruoyi-all-next/docs/architecture/artifacts/yudao-boot-mini-core-scan-2026-08-02.md`
10. `apps/ruoyi/ruoyi-all-next/docs/architecture/yudao-boot-mini-to-all-next-migration-plan.md`
11. `apps/ruoyi/ruoyi-all-next/docs/architecture/artifacts/all-next-starter-coverage-2026-08-02.md`
12. `apps/ruoyi/ruoyi-all-next/docs/architecture/yudao-mini-system-infra-task-breakdown.md`
13. `docs/guides/rbac-guide.md`
14. `docs/guides/logging-standards.md`
15. `docs/guides/ui-template-rules.md`
