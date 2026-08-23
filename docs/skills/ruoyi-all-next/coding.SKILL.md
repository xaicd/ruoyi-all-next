---
name: coding
description: 按分层写业务代码。实现 Route/Service/页面/客户端模块时启用。
---

# 编码

## 权威

- `AGENTS.md` §4
- `docs/guides/service-design-patterns.md`
- `docs/guides/api-route-conventions.md`

## 分层

| 层 | 做 | 不做 |
|---|---|---|
| Route | 解析、鉴权、调 Service、统一响应 | 事务、编排 |
| Validator | Zod | 把裸 body 传进 Service |
| Service | 事务、状态机、审计、跨域策略 | console.* |
| Repository | SQL/Kysely | 拼字符串 SQL |
| Page / 客户端 | 调版本化 HTTP | import 后端类型 |

跨域只经 Facade。同域可用本地 port。客户端按 `clients/<channel>/modules/<domain>/{api,models,pages,components}`。

## 清单

1. 新 API 有 permission code；菜单可见性与权限码一致。
2. 写路径有 schema；错误码语义稳定。
3. 关键路径有 event 日志，资金/权限变更有 audit。
4. 单文件趋势超过 200 行则拆子服务，保留门面。
5. 生成代码不得跨域直 import Service。
6. 不提交密钥；`.env` 不进 Git。

## 门禁

改代码后跑相关测试；跨域/治理变更跑 `npm run check`。

## 禁止

`any` 糊弄边界；在客户端硬编码平台名；用 `roles.includes("admin")` 当长期授权。
