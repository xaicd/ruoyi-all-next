# Implementation Plan: Go Microservice Evolution

## Overview
以 App Router 无状态化、Contract-first 和 ports/adapters 为基础，按域渐进从 Next/TypeScript 切换到 Go。前两波只建立可验证基础，不改变当前公开 API 或生产流量。

## Task Dependency Graph
```json
{
  "waves": [
    { "id": "wave-1", "tasks": ["1"], "dependsOn": [] },
    { "id": "wave-2", "tasks": ["2"], "dependsOn": ["wave-1"] },
    { "id": "wave-3", "tasks": ["3", "4"], "dependsOn": ["wave-2"] },
    { "id": "wave-4", "tasks": ["5"], "dependsOn": ["wave-3"] },
    { "id": "wave-5", "tasks": ["6"], "dependsOn": ["wave-4"] }
  ]
}
```

## Tasks

- [ ] 1. 全量 App Router 无状态化基线
  - [ ] 1.1 维护 `docs/architecture/nextjs-app-router-stateless-scaling-audit.md`，枚举全部 `/api/v1/**/route.ts`、guard 策略、状态依赖、健康检查和高风险公开入口；每次新增 Route 同步更新或由自动扫描生成。
  - [ ] 1.2 建立 admin Route 默认拒绝策略和静态门禁：每个 admin Route 必须通过共享 wrapper 声明 permission/platform/public policy；未鉴权与缺权回归测试覆盖全量 Route manifest。
  - [ ] 1.3 新增匿名 `/healthz`、`/readyz` 和生产 fail-fast 配置校验；替换 Traefik 与健康检查脚本中旧的或鉴权业务路径。
  - [ ] 1.4 定义生产状态外置规则：禁止 memory 数据源、进程内 cache/config/idempotency/lock/event bus 承载跨副本正确性；Redis、DB、outbox 和对象存储分别承担对应职责。
  - [ ] 1.5 实现支付回调真实验签、时间窗、持久化 nonce/event ID 去重、订单状态机事务和审计；跨副本并发重放只允许一次有效处理。

- [ ] 2. Contract 和 BFF 边界基线
  - [ ] 2.1 定义 `contracts/` 或逐域 `contract/` 的 OpenAPI、route manifest、Problem、事件和 compatibility 目录规范；更新 AGENTS、module structure、API route 文档。
  - [ ] 2.2 建立 manifest schema/validator，禁止未知 upstream、无 contract version、未声明 auth/resilience/rollout 的域发布。
  - [ ] 2.3 建立统一 BFF route handler：认证、tenant context、trace、validator、Problem 映射；新 route 先使用，旧 route 逐域迁移。
  - [ ] 2.4 为前端固定 API Port/HTTP adapter 边界；Form/Page 不得 import Next backend、ORM 或 persistence DTO。

- [ ] 3. Ports/adapters 和生成器（依赖：1、2）
  - [ ] 3.1 为选定参考域提取 application、persistence/service/event ports 与 TS adapters；不做全仓静态 Service 一次性重构。
  - [ ] 3.2 将 `service-bus.ts` 改为 manifest 驱动 resolver；保留 local adapter，新增 HTTP remote adapter，禁止动态 import 用作拆分后调用路径。
  - [ ] 3.3 设计并实现 transactional outbox、dispatcher、consumer inbox/去重；只在事务边界明确的域启用。
  - [ ] 3.4 升级 codegen：从 Contract + UI schema 生成 frontend Port/HTTP adapter、TS application skeleton、Go handler/client skeleton 与契约测试；数据库 metadata 仅生成 persistence adapter。
  - [ ] 3.5 增加 Contract breaking-change、manifest、BFF local/remote parity、trace/tenant propagation 与 outbox tests。

- [ ] 4. 平台治理和运行时能力（依赖：1、2）
  - [ ] 4.1 增加服务间认证和 token audience/issuer/key rotation 设计；Go 服务独立验证，不透传不可信客户端 header。
  - [ ] 4.2 建立 W3C trace、structured logs、metrics、SLO dashboard 与 per-service liveness/readiness 规范。
  - [ ] 4.3 在 Docker Compose 添加仅用于开发的 Go reference service 与路由；生产部署按 K8s service/DNS 或已批准 registry 方案实施。
  - [ ] 4.4 定义服务数据库/schema ownership、迁移、备份、数据同步与禁用跨服务写表规则。
  - [ ] 4.5 将 Redis 接入缓存、全局限流、幂等键、分布式锁和配置通知；验证阈值与结果不随 replica 数变化。

- [ ] 5. Go 参考域迁移（依赖：3、4）
  - [ ] 5.1 选择低耦合 read-first 域/操作，记录 owner、数据边界、Contract、SLO、回退与验收；资金、审批和强事务域不作为第一例。
  - [ ] 5.2 实现 Go service 与 Contract generated DTO/handler，完成 auth、tenant、trace、health 和指标。
  - [ ] 5.3 local TS 与 Go 做契约 parity、shadow read、性能和故障注入测试；记录差异。
  - [ ] 5.4 通过 manifest 执行 canary，再切 `remote-go`；写操作先验证 outbox/idempotency 和回退。

- [ ] 6. 扩展与退役（依赖：5）
  - [ ] 6.1 执行本地 TS 回退演练、remote Go 回退演练和独立扩缩演练。
  - [ ] 6.2 在 SLO、错误预算、契约稳定和数据所有权通过后退役对应 TS adapter；禁止同时长期双写。
  - [ ] 6.3 将可复制的服务模板、部署、告警和容量验证加入 codegen/CI，按域重复迁移。

## Notes
- 当前 `event-bus.ts`、`service-bus.ts`、`api-registry.ts`、`config-center.ts` 都是阶段 A 的进程内抽象，不能被当作已完成的远程治理能力。
- Go 迁移的唯一兼容边界是版本化 Contract；不以共享数据库、复制 TypeScript 内部类型或前端改 URL 作为迁移手段。
- Docker Compose 参考服务属于可逆开发改动；Kubernetes、真实注册中心、消息代理和生产流量切换属于高影响操作，需要单独批准。
