---
name: service-governance
description: 超时重试、熔断降级、隔板舱壁、限流防刷、链路追踪。融合 Resilience4j 与 OpenTelemetry 顶级规范。
---

# 服务治理与高可用保障规范 (融合 Resilience4j & OpenTelemetry)

## 1. 适用场景
- 生产环境流量管控、服务间同步 RPC 与异步消息调用。
- 熔断降级、防刷限流、分布式链路追踪与指标监控。

## 2. 权威依据与吸收来源
- `AGENTS.md` §3.3, §4.5
- **Resilience4j / Hystrix**：熔断状态机（CircuitBreaker）、隔板隔离（Bulkhead）、指数退避重试
- **OpenTelemetry & W3C Trace Context**：分布式追踪 `traceparent` 标准协议
- **Redis Sliding Window Rate Limiter**：分布式高精度滑动窗口限流

## 3. 分布式断路器三态机 (Circuit Breaker State Machine)
```
       [ CLOSED (正常通信) ]
             │  失败率 > 50% (样本 >= 10)
             ▼
       [ OPEN (熔断开路，快速失败) ]
             │  休眠窗口等待 5000ms
             ▼
    [ HALF-OPEN (半开探测，放行 3 个探针请求) ]
        ├── 探测成功 ──► [ CLOSED (自动恢复) ]
        └── 探测失败 ──► [ OPEN (继续熔断) ]
```

## 4. 带抖动的指数退避重试策略 (Exponential Backoff with Jitter)
- 严禁所有重试请求在同一毫秒发起导致“惊群效应”打崩下游。
- 公式：`WaitTime = min(MaxWait, BaseWait * 2^attempt) + RandomJitter(0~100ms)`。
- 只对只读幂等接口进行重试，写接口必须搭配 `Idempotency-Key`。

## 5. 分布式限流多层防护网
1. **全局网关限流**：单 IP 每秒最多 100 次请求（防基础 DDoS / 爬虫）。
2. **鉴权端点限流**：`/auth/login`、`/auth/send-code` 单 IP 每分钟最多 5 次（防撞库与短信轰炸）。
3. **业务写接口限流**：单用户每秒最多 2 次（防连击与恶意刷单）。
4. 超限统一返回 `HTTP 429 Too Many Requests` 并附带 `Retry-After: 60`。

## 6. 全链路追踪规范 (W3C Trace Context)
- 网关生成或继承标准 `traceparent`：`00-{traceId}-{spanId}-{flags}`。
- 所有应用层日志、RPC 调用、异步事件投递必须自动注入该 `traceId`。

## 7. 绝对禁止项
- 严禁无超时时间（Timeout = 0）的跨网络请求。
- 严禁在发生熔断时直接吞掉异常不抛出告警。
- 严禁单机内存计数作为多副本集群环境下的全局限流方案。
