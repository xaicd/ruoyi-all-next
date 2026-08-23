---
name: api-design
description: 版本化 HTTP/RPC 契约。新增或修改 API、DTO、OpenAPI、客户端对接时启用。
---

# API 设计

## 权威

- `docs/guides/api-route-conventions.md`
- `docs/specs/api-security-persistence-spec.md`
- `src/modules/<domain>/contract/`
- `src/modules/shared/contract/client-channels.json`

## 面

| 面 | 前缀 | 鉴权 |
|---|---|---|
| admin | `/api/v1/admin` | 管理端 JWT + 权限码 |
| app | `/api/v1/app` | 会员 JWT |
| open | `/api/v1/open` | 公开或签名 |
| internal | `/api/internal` | 服务令牌；浏览器/App 禁用 |

客户端请求带 `X-Client-Channel`。admin JWT 与 member JWT 不得混用。

## 清单

1. 先契约后 Route：actions schema、Facade、manifest 与 HTTP 同源。
2. 资源路径，动词用 HTTP method；写接口必有 Zod。
3. 错误：400 / 401 / 403 / 409 / 429，信封稳定。
4. 新 API 必须有 permission code，禁止长期 hardcode roles。
5. 浏览器 DTO 不来自 Prisma/Kysely 类型。
6. 跨域走 Facade / broker，不直连他域 Service。
7. OpenAPI/错误目录走 `/api/v1/open`。

## 通用参考（可覆盖）

社区 REST/OpenAPI Skill 可用于命名与状态码；本仓库路径与双模 RPC 优先。

## 禁止

另开 `/api/h5` 之类前缀；Route 里写事务；信任客户端伪造的 tenant/user header。
