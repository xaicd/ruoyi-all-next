# Next.js App Router 无状态扩容审计

审计日期：2026-08-14。范围：`src/app/api/v1/**/route.ts`、直接认证/数据库/状态基础设施依赖、生产 Compose 与健康检查脚本。静态审计不替代逐接口业务授权测试；“未见 guard”表示 Route 层未识别到标准 guard 调用。

## 结论
当前 API 全部位于 `/api/v1`，JWT 验签本身无服务端 session，具备无 sticky-session 的基础；但系统**尚不满足安全可靠的多副本上线门槛**。先修复路由统一鉴权、公开回调幂等、生产持久化 fail-fast、liveness/readiness，随后再外置共享状态并做双副本压测。

## 路由盘点
| 分类 | route.ts 数 | 结论 |
|---|---:|---|
| `api/v1/admin/**` | 820 | 管理 API 主体 |
| `api/v1/app/**` | 3 | 应用端 API |
| `api/v1/open/**` | 1 | 支付回调 |
| 非 v1 API | 0 | 无遗留 Route Handler |
| 合计 | 824 | API 路径已统一 |

2026-08-14 再次生成全量策略基线：820 条 admin Route 中，14 条使用 `withAdminRoute`，50 条仍使用旧 direct guard，756 条仅由全局 Proxy JWT 边界保护、尚未声明资源级权限。完整审阅清单在 `docs/architecture/artifacts/admin-route-policy-baseline.json`，并由 `npm run admin:routes:manifest:check` 校验，任何 Route、HTTP 方法或保护级别变化都必须显式更新并审查该清单。高风险资金、OTA、库存、租户和套餐写操作优先迁移；不得靠路径或模板名猜测权限码后批量声称完成。

## 无状态性矩阵
| 能力 | 当前状态 | 多副本结论 | 必要改造 |
|---|---|---|---|
| 管理端 JWT | Bearer JWT + HMAC，本地验证 | 可无 sticky session | 各副本共享 issuer/audience/密钥；后续支持 `kid` 多密钥轮换与撤销策略 |
| 租户上下文 | AsyncLocalStorage | 请求级，无 sticky | 新 wrapper 全程使用 `runWithTenantContext` |
| 数据库 | PostgreSQL 已部署；缺配置可回退 memory | memory 模式不可扩容 | 生产 fail-fast，禁止 memory/mock；readyz 校验 DB 与迁移 |
| 缓存/配置 | `cache-store.ts`、`config-center.ts` 为进程内 Map | 不一致 | 迁至 Redis/持久化配置并广播失效 |
| 幂等/锁/限流 | `protection-idempotent.ts`、`protection-lock.ts`、`rate-limiter.ts` 为进程内状态 | 跨副本失效 | Redis `SET NX`/Lua 或 DB 唯一约束；key 必带 tenant scope |
| 事件/消息 | `event-bus.ts`、platform MQ 为进程内 | 重启丢失、跨副本不达 | transactional outbox + durable broker + consumer inbox |
| WebSocket | `platform-websocket.ts` 为进程内 Map，未接入 Route | 启用后需 sticky 或 backplane | 专用 WS gateway + Redis/Kafka backplane，不依赖 sticky |
| 文件 | 当前只登记元数据，未见本地二进制写入 | 未来本地盘不可扩容 | OSS/S3/MinIO 预签名上传，DB 仅存元数据 |

## P0：扩容前阻断项
1. **Route 鉴权闭环**：为所有 admin Route 使用统一 wrapper，manifest 声明 permission/platform/public 策略；无 token=401、缺权=403。禁止通过 message 字符串判断权限错误。
2. **支付回调闭环**：`src/app/api/v1/open/pay/notify/route.ts` 仍是 TODO。实现渠道验签、时间窗、持久化 nonce/event ID 去重、订单状态机事务与审计；重复回调命中不同副本只能处理一次。
3. **持久化 fail-fast**：`datasource-manager.ts` 的 memory 回退仅限显式开发/测试。生产无 DB 配置或迁移不匹配必须 readiness 失败，绝不可对外接流量。
4. **健康检查修复**：新增匿名 `/healthz`（进程存活）与 `/readyz`（DB/必要依赖就绪）。Traefik 当前配置的 `/api/v1/admin/system/auth/info` 不存在且不应使用鉴权业务接口；`scripts/health-check.sh` 仍调用旧 `/api/admin/...` 路径。

## P1：首轮无状态扩容
- Redis 承接缓存、全局限流、幂等、分布式锁和配置通知；验证请求落到不同副本时结果一致。
- 将可靠跨域事件迁至 outbox + broker；消费者以 event ID 幂等，具备重试、DLQ 与可观测性。
- 统一 HTTP error / Problem、trace/request ID、结构化日志和 Prometheus/OTel 指标。
- 为所有部署实例设置数据库连接池总量预算：`APP_REPLICAS × DB_POOL_SIZE` 不得超过 PostgreSQL 可用连接容量。

## 验收门禁
- admin Route 策略清单覆盖 820/820，且基线校验通过；公开 allowlist 经安全评审。
- 新增 Route 必须使用 `withAdminRoute`，存量 756 条 proxy-only Route 必须按风险批次归零，不得因基线存在而视为已完成资源级授权。
- 两副本下相同 idempotency key 只产生一次写入；全局限流阈值不随副本数翻倍。
- 任意副本创建的数据可由其他副本读取；重启不丢数据或可靠事件。
- DB 断开时 `/readyz`=503，`/healthz` 可反映进程存活；负载均衡仅向 ready 副本分流。
- 支付伪签名、过期签名和跨副本并发重放均不能改变订单状态。

## 关联文件
`src/modules/shared/backend/auth/guards.ts`、`src/modules/shared/backend/lib/database/datasource-manager.ts`、`src/modules/shared/backend/lib/cache-store.ts`、`src/modules/shared/backend/lib/event-bus.ts`、`src/modules/shared/backend/lib/protection-idempotent.ts`、`src/modules/shared/backend/lib/protection-lock.ts`、`src/modules/shared/backend/lib/rate-limiter.ts`、`deploy/docker-compose.prod.yml`、`scripts/health-check.sh`。
