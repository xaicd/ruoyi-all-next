---
name: service-governance
description: 超时重试、熔断降级、隔板舱壁、限流防刷、链路追踪、高可用保障。
---

# 服务治理与高可用保障规范

## 1. 适用场景
- 配置跨域/跨服务调用的容错与稳定性策略。
- 实现防刷限流、降级保护与分布式并发控制。
- 注入链路追踪 TraceId 与敏感操作安全审计。

## 2. 权威依据
- `AGENTS.md` §3.3 (服务调用/超时重试/熔断/隔板/可靠事件总线)
- `AGENTS.md` §4.5 (日志与审计规范)
- `src/modules/shared/backend/constants/microservice-governance.json`
- `src/modules/shared/backend/lib/broker-resilience.ts`
- `src/modules/shared/backend/lib/rate-limiter.ts`
- `src/modules/shared/backend/lib/trace-context.ts`

## 3. 六大核心治理策略

### 1. 超时控制 (Timeout)
- 所有外部/远程调用必须声明显式超时（默认查询 3000ms，复杂计算 8000ms），禁止无限期挂起。

### 2. 幂等与重试 (Retry with Idempotency)
- 只允许对**幂等只读操作**执行自动重试（最多 2~3 次，指数退避算法：100ms, 200ms, 400ms）。
- 涉及写操作必须携带 `Idempotency-Key`，由服务端记录防重。

### 3. 熔断器 (Circuit Breaker)
- 当调用下游失败率超过阈值（如 50% 且样本数 >= 10）时，自动触发 **OPEN（开路）**，快速失败阻止雪崩。
- 经过休眠窗口（如 5s）后进入 **HALF-OPEN（半开）** 探测，成功则恢复 **CLOSED（闭路）**。

### 4. 隔板隔离 (Bulkhead)
- 每个下游域配置独立并发槽位（如并发上限 20，队列等待 50），避免单个慢接口耗尽整个服务的线程池。

### 5. 分布式限流 (Rate Limiting)
- 接口级限流：基于令牌桶 / 滑动窗口算法。
- 区分维度：IP 限流（防恶意爬虫）、User 限流（防高频连击）、API 全局限流（防流量洪峰）。
- 超限统一响应 `HTTP 429 Too Many Requests` 并返回 `Retry-After` 响应头。

### 6. 全链路追踪 (Distributed Tracing)
- 网关生成或继承 `x-trace-id`，全程透传至各层日志、RPC Header 与异步事件。
- 结构化日志必须打上 `traceId`, `tenantId`, `userId` 标签。

## 4. 绝对禁止项
- 严禁调用第三方或远程服务时不设超时时间。
- 严禁熔断后无降级策略导致整站瘫痪。
- 严禁将限流作为鉴权的替代品。
