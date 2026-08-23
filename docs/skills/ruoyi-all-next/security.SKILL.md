---
name: security
description: 鉴权、安全扫描、SQL 注入与风控。写查询、开放接口、发版、审计时启用。
---

# 安全

## 权威

- `docs/specs/api-security-persistence-spec.md`
- `src/modules/shared/backend/auth/`
- `src/modules/shared/backend/lib/rate-limiter.ts`

## 鉴权

1. 受保护 API 必须验签 JWT；禁止把缺失用户当成 SYSTEM。
2. 不接受浏览器传来的 `x-user-id` / `x-permissions` 当真。
3. 开放面 HMAC + 时间戳 + nonce 防重放；服务间用服务身份，不用用户 JWT。
4. 生产拒绝默认 JWT 密钥、匿名超管、Prisma mock 当生产库。

## SQL 注入

1. 只走 Prisma/Kysely 参数化绑定。
2. 禁止把用户输入拼进 SQL 字符串、order-by 白名单外字段、表名。
3. 动态排序字段必须枚举映射。
4. 低代码/Online 查询必须经引擎校验，禁止把任意 SQL 交给浏览器。

## 扫描与密钥

1. 发版前：依赖漏洞扫描（npm audit 或 CI 等价）、密钥不进 Git。
2. 日志与 OpenAPI 示例不得带真实口令、token。
3. 管理端与 App CORS/Cookie 按环境收紧；生产全站 HTTPS。

## 风控

登录、验证码、支付回调、开放签名：限流 + 审计。暴力破解记风控事件，不只 401。

## 禁止

关闭鉴权“先跑通”；用前端加密代替 TLS；把扫描告警标成已修复却未升级依赖。
