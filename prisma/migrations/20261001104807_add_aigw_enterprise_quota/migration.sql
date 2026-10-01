-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/aigw-tables.ts#AIGW_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- AI 网关入驻企业（转录自 rome-all 迁移）
CREATE TABLE "aigw_enterprise" (
    "id" TEXT NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "credit_code" VARCHAR(64),
    "province" VARCHAR(50) NOT NULL DEFAULT '山东省',
    "city" VARCHAR(50) NOT NULL DEFAULT '济南市',
    "industry" VARCHAR(100) NOT NULL DEFAULT '互联网/软件',
    "contact_name" VARCHAR(50),
    "contact_phone" VARCHAR(20),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "aigw_enterprise_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "aigw_enterprise_tenant_id_idx" ON "aigw_enterprise"("tenant_id");

-- AI 网关企业 token 配额（转录自 rome-all 迁移）
CREATE TABLE "aigw_quota" (
    "id" TEXT NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "enterprise_id" TEXT NOT NULL,
    "enterprise_name" VARCHAR(200) NOT NULL,
    "monthly_token_cap" INTEGER NOT NULL DEFAULT 0,
    "used_token_count" INTEGER NOT NULL DEFAULT 0,
    "warn_threshold_ratio" INTEGER NOT NULL DEFAULT 80,
    "auto_throttle" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "aigw_quota_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "aigw_quota_tenant_id_idx" ON "aigw_quota"("tenant_id");
