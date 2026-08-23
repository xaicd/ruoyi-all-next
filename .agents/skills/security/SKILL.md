---
name: security
description: 身份鉴权、SQL 防注入、敏感脱敏、防重放、接口限流与安全风控。
---

# 安全防护与风控合规规范

## 1. 适用场景
- 编写公开接口、敏感资金/权限操作、第三方回调。
- 实施数据加解密、防 SQL 注入、多租户防越权与敏感字段脱敏。

## 2. 权威依据
- `AGENTS.md` §3.3 (受信任服务身份与跨域凭证传递)
- `AGENTS.md` §4.4 (权限码规范，禁止硬编码角色)
- `AGENTS.md` §4.5 (日志脱敏与审计要求)
- `AGENTS.md` §12 (常见安全禁止项)
- `docs/specs/api-security-persistence-spec.md`
- `src/modules/shared/backend/auth/`

## 3. 核心安全防御矩阵

### 1. 身份与令牌鉴权 (Authentication)
- Admin 端与 Member 端 Token 体系完全隔离，签名密钥与有效载荷独立。
- 禁止信任调用方伪造的 `x-user-id` 或 `x-tenant-id` Header（必须从验证通过的 JWT 中解析）。

### 2. 开放接口防重放 (HMAC + Nonce + Timestamp)
- 开放接口 (`/api/v1/open`) 必须包含：
  - `X-Timestamp`：请求时间戳（服务器时钟漂移容忍 <= 300 秒）。
  - `X-Nonce`：一次性随机串（Redis 记录 5 分钟排重）。
  - `X-Signature`：基于 Secret 计算的 HMAC-SHA256 签名。

### 3. SQL 注入防御 (SQL Injection Prevention)
- 所有查询必须走 Prisma / Kysely 参数化查询。
- 动态排序（OrderBy）字段必须通过严格的白名单枚举校验：
  ```typescript
  const ALLOWED_SORT_FIELDS = ["create_time", "price", "sales"] as const
  const sortField = ALLOWED_SORT_FIELDS.includes(input.sortBy) ? input.sortBy : "create_time"
  ```

### 4. 敏感数据脱敏与保护 (Data Masking)
- 手机号（前 3 后 4 脱敏：`138****1234`）、身份证号、银行卡号在日志与列表响应中脱敏展示。
- 密码必须使用强散列（Bcrypt / Argon2）加盐存储，严禁明文存储。

### 5. 审计日志 (Audit Logging)
- 密码修改、权限变更、租户配置、资金结算等敏感操作必须记录独立 Audit 审计日志，包含操作人、IP、时间、变更前后 Diff。

## 4. 绝对禁止项
- 严禁为了“本地调通”而临时注释鉴权中间件并提交到仓库。
- 严禁将密码、API Key、Token 或未脱敏数据打印到日志中。
- 严禁将扫描发现的安全漏洞（CVE）直接标记为修复而不升级安全依赖。
