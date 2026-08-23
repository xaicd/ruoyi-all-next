---
name: devops
description: 容器化编排、Traefik 网关、SSL 证书自动签发轮换、平滑发布与回滚。
---

# DevOps 运维部署与发布规范

## 1. 适用场景
- 本地开发、测试、预发与生产环境部署。
- 配置域名映射、反向代理、自动化 SSL 证书申请与平滑更新。

## 2. 权威依据
- `AGENTS.md` §9 (本地开发与运行步骤)
- `AGENTS.md` §10 (构建部署与发布门禁)
- `deploy/README.md`
- `deploy/docker-compose.prod.yml` (Traefik + PostgreSQL + Redis + App)

## 3. 多环境编排矩阵

| 环境 | 编排文件 | 数据库形态 | 网关与端口 | 适用场景 |
|---|---|---|---|---|
| **Local** | `deploy/docker-compose.local.yml` | 内存 / SQLite | 直连 3100 | 单机极速体验 |
| **Dev** | `deploy/docker-compose.dev.yml` | 独立 PostgreSQL 容器 | 直连 3100 | 本地功能开发 |
| **Prod** | `deploy/docker-compose.prod.yml` | 生产 PostgreSQL + Redis | Traefik (80/443) | 预发与正式生产 |
| **Split** | `deploy/docker-compose.domains.yml` | BFF + 独立域服务 | Traefik 路由 | 拆分部署验证 |

## 4. 域名映射与 Traefik SSL 证书自动续期

生产环境使用 Traefik 作为反向代理入口，自动通过 Let's Encrypt 申请并续期 SSL 证书：

```yaml
services:
  traefik:
    image: traefik:v3.1
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=admin@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
```

## 5. 平滑发布与零停机更新 (Zero-Downtime Rolling Update)
1. **健康检查探针**：容器必须配置 `HEALTHCHECK` 探针调用 `/api/v1/open/health`。
2. **滚动替换**：新版本容器就绪（Healthy）后，Traefik 自动切换流量至新容器，并优雅终止旧容器。
3. **版本回滚 SOP**：若新版本异常，直接拉起前一个带版本 Tag 的镜像标签（如 `v1.0.2`），严禁依赖覆盖 `latest` 标签。

## 6. 绝对禁止项
- 严禁通过 SSH 手工进入生产容器修改源代码。
- 严禁将调试端口（5432, 6379, 9229）直接暴露至公网。
- 严禁在未做数据库备份的情况下执行任何 DDL 迁移。
