# Design Document: Go Microservice Evolution

## Overview
当前项目保留 Next.js 作为 Web/BFF，并将领域实现从“Route → static Service → Repository”渐进收敛为“Contract → BFF adapter → application port → adapter”。Go 不是重写全站的前置条件：一个域可在本地 TS adapter、远程 Go adapter 间切换，浏览器端始终调用相同版本化 API。

## Architecture
```text
React Form/Page
  -> frontend API Port -> HTTP adapter -> /api/v1/... (stable)
  -> Next BFF route adapter -> route manifest
       -> local TS application adapter
       -> remote Go service adapter (HTTP first; gRPC only for internal typed calls)

Domain application -> persistence/service/event ports -> TS or Go adapters
Domain write transaction -> outbox -> broker/dispatcher -> idempotent consumers
```

每域拥有 `contract/openapi.yaml` 与 `contract/route.manifest.yaml`。manifest 作为构建期权威输入，生成 frontend Port/HTTP adapter、Next BFF proxy mapping、Go server/client skeleton、OpenAPI publication 和兼容性测试。运行时 resolver 只消费经过校验和发布的 manifest，不使用现有 `service-bus.ts` 的动态 import 作为远程发现机制。

阶段 A 保持本地 TS adapter；阶段 B 完成 route manifest、统一 HTTP handler、trace、contract CI、outbox 与 remote resolver；阶段 C 用 K8s Service + DNS（或明确选择的注册中心）解析 Go upstream，Traefik/K8s Gateway 负责边缘路由。服务以 domain 为独立部署/扩缩单元，数据库按 schema 再独库演进，禁止跨服务直接写入。

## Components and Interfaces
- **Contract compiler**：读取 OpenAPI/manifest，生成 TypeScript contract DTO、frontend API Port、Go DTO/handler/client interfaces，并校验 operation ID 与版本。
- **Route manifest**：`domain`、`owner`、`publicPrefix`、`contractVersion`、`implementation`、`upstream`、`auth`、`timeoutMs`、`retry`、`idempotency`、`rollout`、`migrationState`。
- **BFF route handler**：共享认证、validator adapter、Problem 映射、trace、tenant context；本地调用 application port 或安全代理 remote upstream。
- **Remote service adapter**：基于 manifest 的 HTTP client；设置 timeout、circuit breaker、trace/idempotency headers；只传递由 guard 生成的可信服务身份上下文。
- **Outbox dispatcher**：在领域事务内写 outbox；异步发布到 broker；consumer 写 processed-event inbox 以支持至少一次投递。
- **Observability adapter**：W3C trace context、结构化日志、metrics、liveness/readiness；由应用和 Go 服务共同实现。

## Data Models
```ts
type RouteManifest = {
  domain: string
  owner: string
  publicPrefix: `/api/v${number}/${string}`
  contractVersion: string
  implementation: "local-ts" | "remote-go"
  upstream?: { baseUrl: string; protocol: "http" | "grpc" }
  auth: { audience: string; tenantPolicy: "required" | "platform" | "optional" }
  resilience: { timeoutMs: number; retry: { maxAttempts: number; safeMethodsOnly: boolean }; idempotencyRequired: boolean }
  rollout: { mode: "local" | "shadow" | "canary" | "remote"; canaryPercent?: number }
}
type Problem = { type: string; title: string; status: number; code: string; traceId: string; detail?: string }
type OutboxEvent = { id: string; type: string; aggregateId: string; tenantId?: string; payload: unknown; occurredAt: string; traceId: string }
```
Contract DTO 与 persistence model 彻底分离；Go 服务有独立 schema/migration ownership。共享读取可在迁移期受控复制，禁止长期跨服务事务或共享写表。

## Correctness Properties

### Property 1: 前端实现隔离
**Validates: Requirements 1.4, 3.1**

同一 Contract 下，local TS 与 remote Go adapter 切换不改变 Page/Form import、浏览器路径或 DTO。

### Property 2: 路由契约完整性
**Validates: Requirements 1.1, 3.2**

每个 manifest upstream 必须有匹配 Contract、operation ID、认证策略、超时与 rollout 策略；无效 manifest 不能发布。

### Property 3: 身份和租户可信传播
**Validates: Requirements 3.3, 4.1**

remote adapter 只从已验证 AuthContext 构建内部身份上下文；Go 服务仍独立验证服务身份与 tenant/permission scope。

### Property 4: 可靠事件边界
**Validates: Requirements 2.4**

标为可靠的跨域事件必须在同一写事务创建 outbox 记录，并由幂等 consumer 以 event ID 去重；进程内 event bus 不满足该属性。

### Property 5: 可回退切流
**Validates: Requirements 3.5, 5.2**

任何 remote/canary manifest 可切回 local TS 而不改变浏览器客户端；切流前后均记录 trace 和版本以支持审计。

## Error Handling
统一返回 `{ success: false, error }` 的兼容层逐步映射到带 `code`、`traceId` 的 Problem；v1 期间不能破坏客户端。BFF 对远程超时、熔断、上游 5xx 映射为可观测的错误，不泄露内部地址或凭据。写操作仅在传入并验证 idempotency key 时按 manifest 策略重试。远端故障触发回退必须由 rollout 策略和人工/自动健康门禁控制，不能盲目双写。

## Testing Strategy
Contract compiler 做 schema、breaking-change 和 TS/Go generated code build 测试。BFF adapter 做本地/远程同契约测试、auth/tenant/trace propagation、Problem 映射与 timeout/circuit breaker 测试。outbox 做同事务写入、重复投递、消费失败重试和 tenant 隔离测试。参考域做 shadow/canary smoke、性能基线、回退演练和独立 health/readiness 测试。

## Migration Plan
1. 发布 contract/manifest 工具链和共享 BFF handler，不切业务流量。
2. 把一个低耦合 read-first 域接到 local TS adapter，证明前端 Port 与 Contract 独立。
3. 为同一域实现 Go service，使用 Contract 生成 DTO/handler，部署为独立容器，完成 auth/trace/health。
4. 先 shadow 验证读操作，再小流量 canary；写操作完成 outbox/idempotency 后才切换。
5. 切换 manifest 到 remote-go，保留 local TS adapter 直到 SLO、回退演练与数据边界验收完成。

## Risks and Rollback
不要先引入服务注册中心、Kafka 或 gRPC 依赖来“形式微服务化”；它们只在 Contract、鉴权、观察性和领域数据边界通过后采用。所有 manifest 改动可回退到 local-ts；Go 服务与 schema 迁移遵循 expand/backfill/dual-read/cutover/contract，禁止不可逆数据库删除与未验证双写。
