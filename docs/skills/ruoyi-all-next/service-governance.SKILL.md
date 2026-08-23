---
name: service-governance
description: 超时、重试、熔断、舱壁、限流、降级、链路追踪、高可用。跨域调用或生产流量时启用。
---

# 服务治理

## 权威

- `src/modules/shared/backend/constants/microservice-governance.json`
- `src/modules/shared/backend/lib/broker-resilience.ts`
- `src/modules/shared/backend/lib/rate-limiter.ts`
- `src/modules/shared/backend/lib/trace-context.ts`
- `docs/architecture/ruoyi-all-next-messaging-constraints.md`

## 同步调用（强制声明）

1. **超时**：默认见 governance.json `requestTimeoutMs`。
2. **重试**：只重试安全读；写命令必须带幂等键。
3. **熔断**：失败率达阈值则开路，半开探测；禁止无限重试打穿下游。
4. **舱壁**：限制并发与队列，避免一个域拖死进程。
5. **降级**：fallback 只返回约定降级数据，不吞掉鉴权失败。

跨域禁止裸 `fetch` 绕过 broker。

## 限流与风控

- HTTP 限流：`rateLimiter`（IP / user / API）。超限 429。
- 登录、验证码、开放签名接口必须有比 CRUD 更严的规则。
- 阶段 A 可内存计数；多副本必须升 Redis，禁止各实例各算各的还当全局限流。
- 黑名单与暴力破解事件走风控规则，不得只打日志。

## 追踪与日志

- 传递 `x-trace-id` / 消息头；禁止信任客户端伪造的租户头。
- 结构化日志：event + 敏感操作 audit。
- 禁止日志输出密码、token、完整证件号。

## 高可用

- 无本地会话；JWT + 服务端 session registry 可多实例。
- 生产：健康检查、就绪、水平扩缩（见 `deploy/docker-compose.prod.yml --scale app=N`）。
- 可靠事件：outbox + inbox，禁止只靠内存 emit。
- 跨库 outbox 仍属阶段 C（D13），不得假装已完成。

## 禁止

无超时的跨域调用；熔断后仍同步死等；用限流代替鉴权。
