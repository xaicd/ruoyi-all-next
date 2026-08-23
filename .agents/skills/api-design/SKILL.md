---
name: api-design
description: 版本化 HTTP/RPC 契约。新增或修改 API、DTO、OpenAPI、客户端对接时启用。
---

# API 契约与接口设计规范

## 1. 适用场景
- 新增或修改对外 HTTP 接口（Admin/App/Open）。
- 定义领域 DTO、Zod 校验 Schema 与 OpenAPI 文档。
- 定义微服务跨域 RPC / Proto / Facade 契约。

## 2. 权威依据
- `AGENTS.md` §3.1 (分层架构契约)
- `AGENTS.md` §3.3 (可替换后端与版本化契约边界：对外 HTTP 统一 `/api/v{n}/`)
- `AGENTS.md` §4.1 (Route 薄层约束：参数解析、鉴权、调 Service、统一响应)
- `AGENTS.md` §4.3 (Validator 与错误码契约)
- `docs/guides/api-route-conventions.md`
- `docs/specs/api-security-persistence-spec.md`

## 3. API 分面与路由前缀规范

| 面 | 路径前缀 | 目标终端 | 鉴权机制 |
|---|---|---|---|
| **Admin** | `/api/v1/admin/<domain>/<resource>` | 管理后台 | Admin JWT + Permission Code (`hasPermission`) |
| **App** | `/api/v1/app/<domain>/<resource>` | H5 / 小程序 / App | Member JWT (`requireMemberAuth`) |
| **Open** | `/api/v1/open/<domain>/<resource>` | 第三方 / 开放平台 | API Key / HMAC 签名 + Nonce |
| **Internal** | `/api/internal/rpc` | 服务间 RPC | `RUOYI_RPC_TOKEN` (外部网络严格隔离) |

## 4. 统一 HTTP 响应封套与状态码契约

所有 HTTP 接口必须返回统一 JSON 结构：

```typescript
export interface ApiResponse<T = any> {
  code: number          // 0 为成功，非 0 为错误码 (如 40001, 40100)
  data: T               // 业务载荷
  msg: string           // 用户提示信息
  traceId?: string      // 链路追踪标识
}
```

### HTTP 语义状态码规范：
- `200 OK`：成功请求。
- `400 Bad Request`：输入参数校验失败（Zod 抛出字段级 issues）。
- `401 Unauthorized`：未登录、Token 过期或签名无效。
- `403 Forbidden`：已登录但无此资源的操作权限码。
- `404 Not Found`：目标实体不存在。
- `409 Conflict`：唯一键冲突、状态机流转冲突或并发乐观锁冲突。
- `429 Too Many Requests`：触发分布式限流或防刷规则。
- `500 Internal Server Error`：服务端未捕获异常（记录详细 Error 日志）。

## 5. Zod Schema 强契约规范
所有写操作（POST / PUT / PATCH / DELETE）必须定义对应的 Zod Schema，禁止裸 body 传入 Service：

```typescript
export const userCreateSchema = z.object({
  username: z.string().trim().min(3).max(30),
  nickname: z.string().trim().min(1).max(50),
  email: z.string().email().optional(),
  mobile: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确").optional(),
  deptId: z.string().optional(),
  roleIds: z.array(z.string()).min(1, "至少分配一个角色"),
})
```

## 6. 绝对禁止项
- 禁止为特定客户端单独开设 `/api/h5/` 或 `/api/uniapp/` 前缀。
- 禁止浏览器端直接依赖 Prisma / Kysely 数据库实体类型作为 DTO。
- 禁止在 Route 层编写复杂业务编排、多表事务与直接 SQL 查询。
