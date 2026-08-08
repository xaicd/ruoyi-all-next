# ruoyi-all-next 部署指南

## 环境说明

| 环境 | 文件 | 数据库 | 用途 |
|---|---|---|---|
| **local** | docker-compose.local.yml | 内存 | 快速验证，零依赖 |
| **dev** | docker-compose.dev.yml | PostgreSQL | 团队开发联调 |
| **test** | docker-compose.test.yml | MySQL | QA 测试 |
| **prod** | docker-compose.prod.yml | PostgreSQL + Nginx | 生产部署 |

## 快速启动

### Local（零配置）

```bash
docker compose -f deploy/docker-compose.local.yml up --build
# 访问 http://localhost:3100
```

### Dev（PostgreSQL）

```bash
docker compose -f deploy/docker-compose.dev.yml up -d
# 首次启动后执行数据库迁移：
# docker compose -f deploy/docker-compose.dev.yml exec app npx prisma db push
```

### Test（MySQL）

```bash
docker compose -f deploy/docker-compose.test.yml up -d
```

### Prod（生产）

```bash
# 1. 配置环境变量
cp deploy/.env.prod.example deploy/.env.prod

# 2. 编辑 .env.prod 修改密码和密钥

# 3. 启动
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.prod up -d

# 4. 首次迁移
docker compose -f deploy/docker-compose.prod.yml exec app npx prisma db push
```

## 常用运维命令

```bash
# 查看日志
docker compose -f deploy/docker-compose.prod.yml logs -f app

# 重启应用（不重启数据库）
docker compose -f deploy/docker-compose.prod.yml restart app

# 扩容到 3 副本
docker compose -f deploy/docker-compose.prod.yml up -d --scale app=3

# 数据库备份
docker compose -f deploy/docker-compose.prod.yml exec postgres pg_dump -U ruoyi ruoyi_next > backup.sql

# 进入应用容器
docker compose -f deploy/docker-compose.prod.yml exec app sh
```

## 目录结构

```
deploy/
├── docker-compose.local.yml    # 本地环境（内存模式）
├── docker-compose.dev.yml      # 开发环境（PostgreSQL）
├── docker-compose.test.yml     # 测试环境（MySQL）
├── docker-compose.prod.yml     # 生产环境（Traefik + PG + Redis）
├── .env.prod.example           # 生产环境变量模板
└── README.md                   # 本文件
```

## 数据库切换

项目支持多种数据库，切换只需修改环境变量：

```bash
# PostgreSQL
DB_DRIVER=postgresql
DATABASE_URL=postgresql://user:pass@host:5432/db

# MySQL
DB_DRIVER=mysql
DATABASE_URL=mysql://user:pass@host:3306/db

# TiDB（MySQL 兼容）
DB_DRIVER=tidb
DATABASE_URL=mysql://user:pass@tidb-host:4000/db

# OceanBase（MySQL 兼容）
DB_DRIVER=oceanbase
DATABASE_URL=mysql://user:pass@ob-host:2883/db

# openGauss（PostgreSQL 兼容）
DB_DRIVER=opengauss
DATABASE_URL=postgresql://user:pass@opengauss-host:5432/db
```
