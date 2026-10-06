-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/report-source-tables.ts#REPORT_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- GoView 项目表每个大屏图标，对应一个项目
CREATE TABLE IF NOT EXISTS "report_go_view_project" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "content" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "report_go_view_project_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "pic_url" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "report_go_view_project" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "report_go_view_project_tenant_id_idx" ON "report_go_view_project"("tenant_id");
