---
name: api-design
description: 版本化 HTTP/RPC 契约。融合 Microsoft REST Guidelines 与 OpenAPI 3.1 业界标准。
---

# API 契约与接口设计规范 (融合微软与 OpenAPI 标准)

## 1. 适用场景
- 新增或重构对外 HTTP API、DTO 数据传输对象、参数校验。
- 编写跨端客户端 API 调用层与微服务 RPC 通信契约。

## 2. 权威依据与吸收来源
- `AGENTS.md` §3.1, §3.3, §4.1, §4.3
- **Microsoft REST API Guidelines**：统一命名、错误模型、幂等重试机制、批量操作规范
- **OpenAPI 3.1 Specification**：JSON Schema 验证、多端自动代码生成契约
- **W3C Trace Context**：分布式全链路请求头传递

## 3. 标准 URL 命名与 HTTP 动词映射

| 动作类型 | HTTP 动词 | URL 示例 | 语义说明 |
|---|---|---|---|
| 列表分页查询 | `GET` | `/api/v1/admin/mall/spu` | 支持 `page`, `pageSize`, `keyword` |
| 获取单个详情 | `GET` | `/api/v1/admin/mall/spu/:id` | 资源不存在返回 404 |
| 创建新资源 | `POST` | `/api/v1/admin/mall/spu` | 成功返回 200/201 及新实体 |
| 完整更新资源 | `PUT` | `/api/v1/admin/mall/spu/:id` | 必须包含完整实体字段 |
| 局部状态变更 | `PATCH` | `/api/v1/admin/mall/spu/:id/status` | 仅更新状态字段 |
| 删除指定资源 | `DELETE` | `/api/v1/admin/mall/spu/:id` | 支持单删或批量 (`?ids=1,2,3`) |
| 复杂非 CRUD 操作 | `POST` | `/api/v1/admin/pay/order/:id/refund` | 使用特定动词子路径 |

## 4. 幂等性与防重提交机制 (Idempotency)
针对资金支付、订单创建等写接口，客户端必须在请求头中携带：
- `Idempotency-Key: <UUID / NanoID>`
- 服务端在 Redis 中缓存该 Key 的执行结果 5 分钟，若检测到重复 Key，直接返回初次执行结果，避免重复扣款/建单。

## 5. 统一标准响应与错误对象模型
```typescript
export interface ApiResponse<T = any> {
  code: number          // 0 为成功，非 0 业务错误码 (如 40001)
  data: T               // 业务负载数据
  msg: string           // 用户可读的友好提示文案
  traceId?: string      // W3C 链路追踪 ID (用于日志定位)
}

// 错误响应时的字段级详细 Issue (遵循 RFC 7807)
export interface ApiErrorDetail {
  field: string         // 出错字段 (如 "mobile")
  message: string       // 校验失败原因 (如 "手机号格式不正确")
}
```

## 6. 绝对禁止项
- 严禁在 URL 中出现大写字母或下划线（统一小写短横线 kebab-case）。
- 严禁成功请求返回非 200 HTTP 状态码但包含业务错误数据。
- 严禁客户端直接传入未做 Zod 校验与类型清洗的裸对象。
