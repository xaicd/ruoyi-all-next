# Requirements Document

## Introduction
将当前 Next.js 模块化单体演进为可按领域渐进替换的架构：前端 API 不变，单个域可先由 TypeScript 本地实现，再通过受控网关切换到 Go 服务。目标是支持独立发布与水平扩展，而非在未定义容量边界时承诺“无限”。

## Glossary
- **Contract**：版本化 OpenAPI/JSON Schema，定义外部请求、响应、错误与 operation ID。
- **Route Manifest**：每域 API 的 owner、upstream、认证、超时、重试、幂等与迁移状态声明。
- **BFF adapter**：Next Route 作为浏览器 API 的稳定边缘适配层。
- **Application Port**：领域用例依赖的接口，不绑定数据库、网络协议或实现语言。
- **Strangler migration**：TS 与 Go 并存，按域/操作逐步切流并可回退。
- **Outbox**：业务数据与待发布事件在同一数据库事务中落库的可靠事件模式。

## Requirements

### Requirement 1: Contract-first public API
**User Story:** 作为客户端开发者，我希望 API 的语言和部署位置变化不影响页面。

#### Acceptance Criteria
1. EACH 可拆分域 SHALL 在 `src/modules/<domain>/contract/` 维护版本化 Contract 与 route manifest。
2. THE Contract SHALL 定义 operation ID、命令 DTO、View DTO、分页、统一错误和认证/权限语义；不得以表结构或 ORM 类型替代。
3. WHEN Contract 存在破坏性变更 THEN 系统必须发布新版本或明确 deprecated 生命周期，不得静默改变 v1。
4. THE frontend SHALL 只依赖 contract-derived DTO 和 API Port，不得依赖 Next backend TypeScript 类型。

### Requirement 2: Domain ports and adapters
**User Story:** 作为后端维护者，我希望可以替换存储、服务调用和 HTTP 实现而不重写领域用例。

#### Acceptance Criteria
1. EACH 新增或迁移域 SHALL 将 application use case 与 persistence/service/event ports 分离。
2. THE existing TypeScript implementation SHALL 作为 adapter；Go implementation SHALL 实现同一 Contract 和 service/event protocol。
3. CROSS-domain synchronous calls SHALL 经 service port，并声明 timeout、retry、idempotency key 和 trace propagation。
4. CROSS-domain reliable events SHALL 使用 transactional outbox、持久化消费者幂等与可观测失败处理；内存 event bus 不得承载可靠跨服务流程。

### Requirement 3: Stable gateway and dynamic upstream routing
**User Story:** 作为运维人员，我希望无需改变浏览器 URL 即可把一个域切换到 Go。

#### Acceptance Criteria
1. THE public browser API SHALL 保持 `/api/v{n}/...` 路径和既有响应契约。
2. THE route manifest SHALL 指定 local Next 或 remote Go upstream，并包含迁移状态与 rollout 策略。
3. WHEN upstream is remote THEN BFF/gateway 必须传递经过验证的 actor、tenant、permission scope、trace 和 idempotency metadata；不得信任客户端伪造身份 header。
4. WHEN remote upstream fails THEN 系统必须应用声明的 timeout、circuit breaker、可重试策略和可观测错误；写操作不得自动重试，除非具备 idempotency key。
5. THE migration SHALL 支持 shadow、canary、切换和回退，且回退不需要修改浏览器客户端。

### Requirement 4: Security, tenancy, and operability
**User Story:** 作为平台管理员，我希望服务拆分后租户和权限边界不被削弱。

#### Acceptance Criteria
1. EACH service SHALL 验证服务间认证，并独立执行权限和 tenant scope 的最终业务授权。
2. EACH service SHALL 暴露 anonymous liveness/readiness、结构化日志、trace correlation 和指标；鉴权业务接口不得被用作健康检查。
3. THE platform SHALL 具备配置、密钥、迁移所有权和数据库边界策略；新服务不得共享其他服务的写模型。
4. EACH deployment SHALL 有资源限制、水平扩缩策略、SLO 和压测证据。

### Requirement 5: Safe incremental migration
**User Story:** 作为交付负责人，我希望能先交付基础能力，再用低风险域验证 Go 迁移。

#### Acceptance Criteria
1. THE first migration SHALL 选择低耦合、非资金、非审批的域或操作作为 Go reference implementation。
2. BEFORE traffic switching, Contract compatibility、auth/tenant propagation、error mapping、outbox/idempotency（如涉及写入）和 rollback 必须通过自动化验证。
3. THE system SHALL 记录 TS 与 Go 的 owner、数据边界、迁移状态和 retirement 条件。
4. NO migration SHALL 直接共享数据库表写入作为长期方案。
