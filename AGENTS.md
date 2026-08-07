# ruoyi-all-next 开发工作手册

更新时间：2026-08-03

本文件是 ruoyi-all-next 子项目的独立开发规范，覆盖架构边界、研发流程、测试门禁、运行部署与交付标准。

## 1. 项目定位

1. ruoyi-all-next 是基于 Next.js 的 RuoYi 能力迁移与复用基座。
2. 目标是以模块化单体方式先完成全域能力吸收，再按域支持独立拆分。
3. 当前阶段坚持“证据驱动迁移”：任何能力声明必须有扫描产物与代码落地。

## 2. 适用范围与边界

1. 本规范仅作用于 apps/ruoyi/ruoyi-all-next 目录。
2. all-next 当前阶段只允许建设 RuoYi 原生域，不接收非原生扩展域。
3. 原生域清单、规模证据、迁移阶段以扫描结果为准。

原生域（15）：

1. system
2. infra
3. bpm
4. pay
5. report
6. mp
7. mall
8. member
9. crm
10. erp
11. wms
12. mes
13. ai
14. iot
15. im

## 3. 架构总览

### 3.1 分层架构

1. Route 层：src/app/api/admin/**/route.ts
2. Service 层：src/modules/<domain>/backend/services/**
3. Validator 层：src/modules/<domain>/backend/validators/**
4. Page 层：src/app/(admin)/admin/** + src/modules/<domain>/frontend/pages/**
5. 基座层：src/modules/shared/backend/constants、src/modules/shared/backend/lib

### 3.2 目录约束

1. 新增业务域必须落在 src/modules/<domain>/。
2. 公共基座（constants/lib/templates）统一放 src/modules/shared/。
3. src 下只允许两个顶层目录：app（Next.js路由）和 modules（全部业务+基座）。
4. 禁止在 src 下新建 backend/、frontend/、components/、lib/ 等平铺目录。
5. 通用模板统一放 src/modules/shared/frontend/templates。

## 4. 编码规范（强制）

### 4.1 Route 薄层

1. Route 只做参数解析、鉴权、调用 Service、统一响应。
2. 禁止在 Route 写业务编排、事务、资源分配。
3. 所有输入必须接 Validator，不允许裸参数直传 Service。

### 4.2 Service 内聚

1. 复杂业务、事务边界、状态机、审计统一放 Service。
2. Service 必须输出结构化日志；关键动作至少 event，敏感动作增加 audit。
3. 跨域调用必须声明超时、重试、幂等策略。

### 4.3 Validator 与契约

1. 所有写接口必须有 schema。
2. 统一错误语义：参数错 400、未登录 401、无权 403、冲突 409、限流 429。
3. API 成功与失败结构统一，禁止同域内响应形状漂移。

### 4.4 权限规范

1. 新增 API 必须使用 permission code。
2. 禁止新增 roles 硬编码作为长期方案。
3. 菜单与页面可见性必须与权限码一致。

### 4.5 日志规范

1. 禁止使用 console.*（测试代码除外）。
2. 关键路径必须记录 event。
3. 审核、权限变更、资金与风控相关操作必须补 audit。
4. 日志禁止输出密码、密钥、token、完整隐私数据。

### 4.6 Service 设计模式规范

1. all-next Service 必须遵循独立模式规范文档。
2. 每个域必须有稳定 Service 门面，子能力按策略/子服务拆分。
3. 涉及状态迁移必须使用状态守卫，禁止无守卫直接写状态。
4. 复杂流程建议统一执行管道：authorize -> guard -> transaction -> log。
5. 规范文档：apps/ruoyi/ruoyi-all-next/docs/guides/service-design-patterns.md。

## 5. Domain-First 研发流程

每个域按六要素推进，不允许跳步宣称完成。

1. API
2. Service
3. Validator
4. Page
5. Permission
6. Log + Test

标准顺序：

1. 先读扫描证据与迁移作战板，确认域边界。
2. 用模板生成最小闭环骨架。
3. 补齐权限、日志与关键路径测试。
4. 回写文档与矩阵状态。

## 6. 能力同步与治理门禁

1. 能力状态必须对照 docs/architecture/ruoyi-all-next-capability-matrix.md。
2. 域声明必须同步 docs/architecture/ruoyi-all-next-domain-governance.md。
3. 未登记能力不得标记 DONE。
4. PARTIAL 与 DONE 域必须带 TestRefs。
5. 微服务阶段为 B/C 的域必须填写 SplitNote。

CI 前置检查：

1. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:matrix:check
2. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:governance:check
3. 合并前建议执行 strict：
	- cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:matrix:check:strict
	- cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:governance:check:strict

## 6.1 Skill Registry（强制）

以下 Skill 为 all-next 的治理必备项，AGENTS 必须注册并在对应场景启用：

1. database-compatibility：apps/ruoyi/ruoyi-all-next/docs/skills/ruoyi-all-next/database-compatibility.SKILL.md
2. ui-framework-governance：apps/ruoyi/ruoyi-all-next/docs/skills/ruoyi-all-next/ui-framework-governance.SKILL.md
3. microservice-evolution：apps/ruoyi/ruoyi-all-next/docs/skills/ruoyi-all-next/microservice-evolution.SKILL.md
4. ui-ux-pro-max：.kiro/steering/ui-ux-pro-max/SKILL.md

启用规则：

1. 涉及数据库选型、兼容等级或迁移时，启用 database-compatibility。
2. 涉及页面模板、组件结构或交互规范时，启用 ui-framework-governance + ui-ux-pro-max。
3. 涉及域拆分、独立发布或阶段演进时，启用 microservice-evolution。
4. 涉及 C 端页面、视觉设计、UX 交互或前端组件开发时，必须启用 ui-ux-pro-max。

## 7. 扫描与迁移节奏（证据驱动）

推荐每个批次都执行以下命令链：

1. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:full:scan
2. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:deep:scan
3. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:mini:scan
4. cd apps/ruoyi/ruoyi-all-next && npm run ruoyi:migration:board

产物目录：apps/ruoyi/ruoyi-all-next/docs/architecture/artifacts/

迁移节奏：

1. P0-Foundation：system + infra 先闭环
2. P1-CloseGaps：已有骨架域补齐日志与测试
3. P2-Bootstrap：从 0 到 1 建立域骨架
4. P3-NewDomain：TODO 域按六要素启动

## 8. 测试规范

1. 每个新域至少补 1 条关键路径自动化测试。
2. 涉及日志规范时必须有 log/audit 断言。
3. 涉及权限边界时必须有拒绝路径测试。
4. 涉及事务时必须有失败回滚测试。

建议命令：

1. npm test -- --run apps/ruoyi/ruoyi-all-next/src/backend/services/<domain>-log-audit.test.ts
2. npm test -- --run apps/ruoyi/ruoyi-all-next/src/modules/infra/backend/services/__tests__/template-engine.service.test.ts
3. npm test

## 9. 本地开发与运行步骤

说明：当前 all-next 作为主仓库中的子项目运行，ruoyi 相关命令统一在子项目目录执行。

子项目一键入口（推荐）：

1. cd apps/ruoyi/ruoyi-all-next
2. npm run quick-start

该入口会自动执行基础设施启动、数据库初始化、治理检查与开发服务器启动。

### 9.1 首次启动

1. cd apps/ruoyi/ruoyi-all-next
2. 首次初始化：npm run init
3. 门禁检查：npm run check
4. 启动应用：npm run dev

### 9.2 all-next 研发常用命令

1. 能力扫描：npm run ruoyi:full:scan
2. 证据扫描：npm run ruoyi:deep:scan
3. mini 基座扫描：npm run ruoyi:mini:scan
4. 迁移作战板：npm run ruoyi:migration:board
5. 治理检查：npm run check
6. strict 治理：npm run ruoyi:matrix:check:strict && npm run ruoyi:governance:check:strict

子项目本地命令面（apps/ruoyi/ruoyi-all-next/package.json）：

1. npm run quick-start
2. npm run check
3. npm run scaffold

### 9.3 本地验证最小闭环

1. 打开 /admin/system、/admin/infra 与当前域页面。
2. 验证列表、筛选、分页、详情、保存等核心路径。
3. 校验无权限用户访问被正确拒绝。

## 10. 构建与部署步骤

### 10.1 预发/生产构建

1. npm run lint
2. npm test
3. npm run build
4. npm run start

### 10.2 Docker 部署

1. 构建镜像：docker build -t qloapps-next .
2. 生产编排启动：docker-compose up -d
3. 开发编排启动：docker-compose -f docker-compose.dev.yml up -d

### 10.3 发布门禁

1. 发布前必须通过 strict 治理检查。
2. 发布前必须生成最新扫描证据与迁移作战板。
3. 发布前必须同步文档索引：npm run docs:sync-context。

## 11. 代码规模与拆分约束

1. 单模块包含 3 个以上子能力时，Service 与 Validator 必须目录化拆分。
2. 单文件超过 200 行优先拆分为子服务并保留门面入口。
3. 新开发禁止继续向兼容门面堆业务代码。
4. 域稳定后应具备独立拆分为 app/service 的最小条件。

## 12. 常见禁止项

1. 禁止绕过 Validator 直连 Service。
2. 禁止在 Route 写事务。
3. 禁止未登记能力宣称完成。
4. 禁止只做页面不补权限与测试。
5. 禁止输出无审计证据的高风险变更。

## 13. 参考文档

1. apps/ruoyi/ruoyi-all-next/README.md
2. apps/ruoyi/ruoyi-all-next/src/modules/README.md
3. apps/ruoyi/ruoyi-all-next/docs/architecture/ruoyi-native-capabilities-catalog.md
4. apps/ruoyi/ruoyi-all-next/docs/architecture/ruoyi-full-migration-board.md
5. apps/ruoyi/ruoyi-all-next/docs/architecture/system-core-implementation-checklist.md
6. docs/architecture/ruoyi-all-next-capability-matrix.md
7. docs/architecture/ruoyi-all-next-domain-governance.md
8. docs/guides/logging-standards.md
9. docs/guides/rbac-guide.md
10. apps/ruoyi/ruoyi-all-next/docs/guides/service-design-patterns.md
11. apps/ruoyi/ruoyi-all-next/scripts/quick-start.sh
12. apps/ruoyi/ruoyi-all-next/scripts/scaffold-feature.ts
