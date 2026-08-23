---
name: architecture-design
description: 单体与拆分、前后端分离、网关、服务调用。定部署形态或跨域边界时启用。
---

# 架构设计

## 同时启用

拆分阶段 A/B/C 时加 `microservice-evolution.SKILL.md`。超时熔断限流追踪加 `service-governance.SKILL.md`。

## 权威

- `AGENTS.md` §3
- `docs/architecture/ruoyi-all-next-architecture.md`
- `docs/architecture/ruoyi-all-next-microservice-governance.md`
- `docs/architecture/ruoyi-all-next-module-rpc.md`
- `src/modules/shared/backend/constants/domain-catalog.json`

## 默认形态

**模块化单体（阶段 A）**。Next.js 是 BFF/网关，`src/modules/<domain>` 是服务。未证明流量、所有权和数据边界前，禁止为新功能新建微服务。

| 概念 | 本仓库做法 |
|---|---|
| 单体 | 同进程 Facade = SDK 内存调用 |
| 微服务 | 阶段 C：同 Facade 切 RPC，`POST /api/internal/rpc` |
| 前后端分离 | 浏览器只打版本化 HTTP；禁止 import Service/Prisma |
| 网关 | Next Route + `src/proxy.ts` 按 catalog 转 upstream |
| 服务调用 | `broker.call` / Domain Facade；subject `ruoyi.cmd.<domain>.<method>` |
| 运行时 | 自研 NATS 语义；禁止引入 Moleculer/Nest 运行时 |

`system`/`infra` 不对业务域整体开放。公开面仅字典与登录用户信息。`shared` 不是微服务。

## 清单

1. 先写调用面、超时、鉴权、失败语义，再谈进程数。
2. 拆分只换 adapter；URL、DTO、权限、租户不得变。
3. 不信任调用方伪造的 tenant/user/permission header。
4. 新 Go 服务要有身份、trace、健康检查、契约兼容。
5. 容量用 SLO 与压测说话，不承诺无限扩展。
6. 客户端独立包，不在 `clients/` 再造一套后台。

## 禁止

业务域直连他域 Repository；用用户 JWT 当服务间认证。
