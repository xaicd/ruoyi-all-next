-- CreateTable: member_user（C 端会员用户，app 端注册/登录主体）
--
-- 该表此前只声明在 prisma/schema.prisma 与 SQLite 开发 bootstrap（scripts/bootstrap-sqlite.ts），
-- PostgreSQL 迁移缺失，导致 hasRealDatabase() 分支查询到不存在的表。本次补齐并与两端对齐。
--
-- 会员按租户隔离（AGENTS.md §4.8）：
--   * account / email 由「全局唯一」改为「租户内唯一」（tenant_id + account / email 复合唯一）
--   * tenant_id 无数据库默认值，必须由调用方显式写入，禁止 'default' 隐式兜底
CREATE TABLE "member_user" (
    "id" TEXT NOT NULL,
    "account" VARCHAR(64) NOT NULL,
    "email" VARCHAR(120),
    "password_hash" VARCHAR(200) NOT NULL,
    "password_salt" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(60) NOT NULL,
    "avatar_url" VARCHAR(500),
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "member_level" VARCHAR(30) NOT NULL DEFAULT 'normal',
    "extra_fields" JSONB,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(64) NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(64) NOT NULL DEFAULT 'system',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),
    "remark" VARCHAR(500),

    CONSTRAINT "member_user_pkey" PRIMARY KEY ("id")
);

-- 租户内唯一：不同租户可以拥有同名账号/邮箱
CREATE UNIQUE INDEX "member_user_tenant_id_account_key" ON "member_user"("tenant_id", "account");
CREATE UNIQUE INDEX "member_user_tenant_id_email_key" ON "member_user"("tenant_id", "email");

-- 租户隔离查询路径：所有按租户过滤的读写都命中该索引
CREATE INDEX "member_user_tenant_id_idx" ON "member_user"("tenant_id");
