-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/system-tables.ts#SYSTEM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 渠道合作伙伴主档案（手写仓储，非 codegen 产物）
CREATE TABLE "system_partner" (
    "id" TEXT NOT NULL,
    "partner_code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "level" VARCHAR(255) NOT NULL,
    "registered_capital" INTEGER,
    "credit_code" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(255) NOT NULL,
    "region" VARCHAR(255) NOT NULL,
    "commission_rate" DECIMAL(8,4) NOT NULL,
    "promo_code" VARCHAR(255) NOT NULL,
    "balance" DECIMAL(18,2) NOT NULL,
    "total_commission" DECIMAL(18,2) NOT NULL,
    "allowed_tenant_ids" TEXT NOT NULL,
    "master_pool_tokens" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "system_partner_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "system_partner_tenant_id_idx" ON "system_partner"("tenant_id");
