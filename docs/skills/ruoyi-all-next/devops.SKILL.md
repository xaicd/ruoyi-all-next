---
name: devops
description: 部署、域名、TLS、更新回滚。本地交付、预发、生产发布时启用。
---

# DevOps

## 权威

- `deploy/README.md`
- `deploy/docker-compose.prod.yml`（Traefik + PG + Redis）
- `AGENTS.md` §9–10

## 部署形态

| 环境 | 文件 | 说明 |
|---|---|---|
| local | docker-compose.local.yml | 内存，快速验证 |
| dev | docker-compose.dev.yml | PostgreSQL |
| test | docker-compose.test.yml | MySQL 兼容验证 |
| prod | docker-compose.prod.yml | Traefik 入口 |
| 拆分 | docker-compose.domains.yml / `npm run domain:up` | BFF + 域进程 |

一体：`docker build -t ruoyi-all-next .`  
域镜像：`Dockerfile.domain`  
发布前：`lint` + `test` + `build` + `check`（strict）。

## 域名映射

1. 对外只暴露网关/BFF（默认 3100），域进程不直接暴露公网。
2. Traefik/Nginx 按 host 路由到 BFF；WebSocket/SSE 如有则单独超时。
3. 公开 URL 与内部 upstream 分环境变量配置，禁止页面写死内网 IP。

## SSL 证书

1. 生产必须 HTTPS；证书由入口（Traefik ACME 或运维签发）终止 TLS。
2. 私钥不进 Git、不进镜像层、不进日志。
3. 证书轮换不影响应用镜像；应用只信入口传来的 TLS。
4. 内部 RPC 生产用 `RUOYI_RPC_TOKEN`（或 mTLS），与浏览器证书分离。

## 更新与回滚

1. 镜像打版本标签，禁止只覆盖 `latest` 当回滚手段。
2. 数据库迁移与应用版本绑定；先备份再 migrate。
3. 拆分域独立升级时契约必须向后兼容，否则先扩 DTO 再切流量。
4. 健康失败不接流量；就绪后再摘旧副本。

## 清单

1. `deploy/.env.prod` 来自 `.env.prod.example`，密钥已替换。
2. 迁移在有 Prisma 的环境执行，不假设生产容器内有 CLI（见 deploy README）。
3. 多副本时会话与限流不依赖单机内存。

## 禁止

SSH 上生产手改容器内文件；把调试端口映射到公网；无备份执行破坏性迁移。
