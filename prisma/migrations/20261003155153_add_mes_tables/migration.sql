-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/mes-source-tables.ts#MES_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- MES 假期设置
CREATE TABLE IF NOT EXISTS "mes_cal_holiday" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3),
    "type" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_holiday_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "day" TIMESTAMP(3);
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_holiday" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_holiday_tenant_id_idx" ON "mes_cal_holiday"("tenant_id");

-- MES 排班计划
CREATE TABLE IF NOT EXISTS "mes_cal_plan" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "calendar_type" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "shift_type" INTEGER,
    "shift_method" INTEGER,
    "shift_count" INTEGER,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_plan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "calendar_type" INTEGER;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "start_date" TIMESTAMP(3);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMP(3);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "shift_type" INTEGER;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "shift_method" INTEGER;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "shift_count" INTEGER;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_plan_tenant_id_idx" ON "mes_cal_plan"("tenant_id");

-- MES 计划班次
CREATE TABLE IF NOT EXISTS "mes_cal_plan_shift" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "sort" INTEGER,
    "name" VARCHAR(255),
    "start_time" VARCHAR(255),
    "end_time" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_plan_shift_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "start_time" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "end_time" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan_shift" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_plan_shift_tenant_id_idx" ON "mes_cal_plan_shift"("tenant_id");

-- MES 计划班组关联
CREATE TABLE IF NOT EXISTS "mes_cal_plan_team" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "team_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_plan_team_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "team_id" BIGINT;
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_plan_team" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_plan_team_tenant_id_idx" ON "mes_cal_plan_team"("tenant_id");

-- MES 班组
CREATE TABLE IF NOT EXISTS "mes_cal_team" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "calendar_type" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_team_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "calendar_type" INTEGER;
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_team_tenant_id_idx" ON "mes_cal_team"("tenant_id");

-- MES 班组成员
CREATE TABLE IF NOT EXISTS "mes_cal_team_member" (
    "id" TEXT NOT NULL,
    "team_id" BIGINT,
    "user_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_team_member_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "team_id" BIGINT;
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team_member" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_team_member_tenant_id_idx" ON "mes_cal_team_member"("tenant_id");

-- MES 班组排班
CREATE TABLE IF NOT EXISTS "mes_cal_team_shift" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "team_id" BIGINT,
    "shift_id" BIGINT,
    "day" TIMESTAMP(3),
    "sort" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_cal_team_shift_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "team_id" BIGINT;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "shift_id" BIGINT;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "day" TIMESTAMP(3);
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_cal_team_shift" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_cal_team_shift_tenant_id_idx" ON "mes_cal_team_shift"("tenant_id");

-- MES 点检保养方案
CREATE TABLE IF NOT EXISTS "mes_dv_check_plan" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "cycle_type" INTEGER,
    "cycle_count" INTEGER,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_check_plan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "start_date" TIMESTAMP(3);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMP(3);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "cycle_type" INTEGER;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "cycle_count" INTEGER;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_check_plan_tenant_id_idx" ON "mes_dv_check_plan"("tenant_id");

-- MES 点检保养方案设备
CREATE TABLE IF NOT EXISTS "mes_dv_check_plan_machinery" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "machinery_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_check_plan_machinery_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "machinery_id" BIGINT;
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan_machinery" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_check_plan_machinery_tenant_id_idx" ON "mes_dv_check_plan_machinery"("tenant_id");

-- MES 点检保养方案项目
CREATE TABLE IF NOT EXISTS "mes_dv_check_plan_subject" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "subject_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_check_plan_subject_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "subject_id" BIGINT;
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_plan_subject" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_check_plan_subject_tenant_id_idx" ON "mes_dv_check_plan_subject"("tenant_id");

-- MES 设备点检记录
CREATE TABLE IF NOT EXISTS "mes_dv_check_record" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "machinery_id" BIGINT,
    "check_time" TIMESTAMP(3),
    "user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_check_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "machinery_id" BIGINT;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "check_time" TIMESTAMP(3);
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_check_record_tenant_id_idx" ON "mes_dv_check_record"("tenant_id");

-- MES 设备点检记录明细
CREATE TABLE IF NOT EXISTS "mes_dv_check_record_line" (
    "id" TEXT NOT NULL,
    "record_id" BIGINT,
    "subject_id" BIGINT,
    "check_status" INTEGER,
    "check_result" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_check_record_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "record_id" BIGINT;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "subject_id" BIGINT;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "check_status" INTEGER;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "check_result" VARCHAR(255);
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_check_record_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_check_record_line_tenant_id_idx" ON "mes_dv_check_record_line"("tenant_id");

-- MES 设备台账
CREATE TABLE IF NOT EXISTS "mes_dv_machinery" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "brand" VARCHAR(255),
    "specification" VARCHAR(255),
    "machinery_type_id" BIGINT,
    "workshop_id" BIGINT,
    "status" INTEGER,
    "last_mainten_time" TIMESTAMP(3),
    "last_check_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_machinery_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "brand" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "specification" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "machinery_type_id" BIGINT;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "workshop_id" BIGINT;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "last_mainten_time" TIMESTAMP(3);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "last_check_time" TIMESTAMP(3);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_machinery" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_machinery_tenant_id_idx" ON "mes_dv_machinery"("tenant_id");

-- MES 设备类型
CREATE TABLE IF NOT EXISTS "mes_dv_machinery_type" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "parent_id" BIGINT,
    "status" INTEGER,
    "sort" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_machinery_type_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "parent_id" BIGINT;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_machinery_type" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_machinery_type_tenant_id_idx" ON "mes_dv_machinery_type"("tenant_id");

-- MES 设备保养记录
CREATE TABLE IF NOT EXISTS "mes_dv_mainten_record" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "machinery_id" BIGINT,
    "mainten_time" TIMESTAMP(3),
    "user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_mainten_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "machinery_id" BIGINT;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "mainten_time" TIMESTAMP(3);
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_mainten_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_mainten_record_tenant_id_idx" ON "mes_dv_mainten_record"("tenant_id");

-- MES 设备保养记录明细
CREATE TABLE IF NOT EXISTS "mes_dv_mainten_record_line" (
    "id" TEXT NOT NULL,
    "record_id" BIGINT,
    "subject_id" BIGINT,
    "status" INTEGER,
    "result" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_mainten_record_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "record_id" BIGINT;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "subject_id" BIGINT;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "result" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_mainten_record_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_mainten_record_line_tenant_id_idx" ON "mes_dv_mainten_record_line"("tenant_id");

-- MES 维修工单
CREATE TABLE IF NOT EXISTS "mes_dv_repair" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "machinery_id" BIGINT,
    "require_date" TIMESTAMP(3),
    "finish_date" TIMESTAMP(3),
    "confirm_date" TIMESTAMP(3),
    "result" INTEGER,
    "accepted_user_id" BIGINT,
    "confirm_user_id" BIGINT,
    "source_doc_type" INTEGER,
    "source_doc_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_repair_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "machinery_id" BIGINT;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "require_date" TIMESTAMP(3);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "finish_date" TIMESTAMP(3);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "confirm_date" TIMESTAMP(3);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "result" INTEGER;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "accepted_user_id" BIGINT;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "confirm_user_id" BIGINT;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "source_doc_type" INTEGER;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_repair" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_repair_tenant_id_idx" ON "mes_dv_repair"("tenant_id");

-- MES 维修工单行
CREATE TABLE IF NOT EXISTS "mes_dv_repair_line" (
    "id" TEXT NOT NULL,
    "repair_id" BIGINT,
    "subject_id" BIGINT,
    "malfunction" VARCHAR(255),
    "malfunction_url" VARCHAR(255),
    "description" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_repair_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "repair_id" BIGINT;
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "subject_id" BIGINT;
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "malfunction" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "malfunction_url" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_repair_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_repair_line_tenant_id_idx" ON "mes_dv_repair_line"("tenant_id");

-- MES 点检保养项目
CREATE TABLE IF NOT EXISTS "mes_dv_subject" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "content" VARCHAR(255),
    "standard" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_dv_subject_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "standard" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_dv_subject" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_dv_subject_tenant_id_idx" ON "mes_dv_subject"("tenant_id");

-- MES 编码规则组成
CREATE TABLE IF NOT EXISTS "mes_md_auto_code_part" (
    "id" TEXT NOT NULL,
    "rule_id" BIGINT,
    "sort" INTEGER,
    "type" INTEGER,
    "length" INTEGER,
    "date_format" VARCHAR(255),
    "fix_character" VARCHAR(255),
    "serial_start_no" INTEGER,
    "serial_step" INTEGER,
    "cycle_flag" BOOLEAN,
    "cycle_method" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_auto_code_part_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "rule_id" BIGINT;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "length" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "date_format" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "fix_character" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "serial_start_no" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "serial_step" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "cycle_flag" BOOLEAN;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "cycle_method" INTEGER;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_part" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_auto_code_part_tenant_id_idx" ON "mes_md_auto_code_part"("tenant_id");

-- MES 编码生成记录
CREATE TABLE IF NOT EXISTS "mes_md_auto_code_record" (
    "id" TEXT NOT NULL,
    "rule_id" BIGINT,
    "result" VARCHAR(255),
    "serial_no" BIGINT,
    "input_char" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_auto_code_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "rule_id" BIGINT;
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "result" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "serial_no" BIGINT;
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "input_char" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_auto_code_record_tenant_id_idx" ON "mes_md_auto_code_record"("tenant_id");

-- MES 编码规则
CREATE TABLE IF NOT EXISTS "mes_md_auto_code_rule" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "max_length" INTEGER,
    "padded" BOOLEAN,
    "padded_char" VARCHAR(255),
    "padded_method" INTEGER,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_auto_code_rule_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "max_length" INTEGER;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "padded" BOOLEAN;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "padded_char" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "padded_method" INTEGER;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_auto_code_rule" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_auto_code_rule_tenant_id_idx" ON "mes_md_auto_code_rule"("tenant_id");

-- MES 客户
CREATE TABLE IF NOT EXISTS "mes_md_client" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "nickname" VARCHAR(255),
    "english_name" VARCHAR(255),
    "description" VARCHAR(255),
    "logo" VARCHAR(255),
    "type" INTEGER,
    "address" VARCHAR(255),
    "website" VARCHAR(255),
    "email" VARCHAR(255),
    "telephone" VARCHAR(255),
    "contact1_name" VARCHAR(255),
    "contact1_telephone" VARCHAR(255),
    "contact1_email" VARCHAR(255),
    "contact2_name" VARCHAR(255),
    "contact2_telephone" VARCHAR(255),
    "contact2_email" VARCHAR(255),
    "credit_code" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_client_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "english_name" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "logo" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "website" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact1_name" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact1_telephone" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact1_email" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact2_name" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact2_telephone" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "contact2_email" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "credit_code" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_client" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_client_tenant_id_idx" ON "mes_md_client"("tenant_id");

-- MES 物料产品
CREATE TABLE IF NOT EXISTS "mes_md_item" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "specification" VARCHAR(255),
    "unit_measure_id" BIGINT,
    "item_type_id" BIGINT,
    "status" INTEGER,
    "safe_stock_flag" BOOLEAN,
    "min_stock" DECIMAL(18,2),
    "max_stock" DECIMAL(18,2),
    "high_value" BOOLEAN,
    "batch_flag" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "specification" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "item_type_id" BIGINT;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "safe_stock_flag" BOOLEAN;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "min_stock" DECIMAL(18,2);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "max_stock" DECIMAL(18,2);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "high_value" BOOLEAN;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "batch_flag" BOOLEAN;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_item_tenant_id_idx" ON "mes_md_item"("tenant_id");

-- MES 物料批次属性配置
CREATE TABLE IF NOT EXISTS "mes_md_item_batch_config" (
    "id" TEXT NOT NULL,
    "item_id" BIGINT,
    "produce_date_flag" BOOLEAN,
    "expire_date_flag" BOOLEAN,
    "receipt_date_flag" BOOLEAN,
    "vendor_flag" BOOLEAN,
    "client_flag" BOOLEAN,
    "sales_order_code_flag" BOOLEAN,
    "purchase_order_code_flag" BOOLEAN,
    "work_order_flag" BOOLEAN,
    "task_flag" BOOLEAN,
    "workstation_flag" BOOLEAN,
    "tool_flag" BOOLEAN,
    "mold_flag" BOOLEAN,
    "lot_number_flag" BOOLEAN,
    "quality_status_flag" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_item_batch_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "produce_date_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "expire_date_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "receipt_date_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "vendor_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "client_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "sales_order_code_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "purchase_order_code_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "work_order_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "task_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "workstation_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "tool_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "mold_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "lot_number_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "quality_status_flag" BOOLEAN;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item_batch_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_item_batch_config_tenant_id_idx" ON "mes_md_item_batch_config"("tenant_id");

-- MES 物料产品分类
CREATE TABLE IF NOT EXISTS "mes_md_item_type" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "parent_id" BIGINT,
    "item_or_product" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_item_type_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "parent_id" BIGINT;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "item_or_product" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_item_type" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_item_type_tenant_id_idx" ON "mes_md_item_type"("tenant_id");

-- MES 产品 BOM
CREATE TABLE IF NOT EXISTS "mes_md_product_bom" (
    "id" TEXT NOT NULL,
    "item_id" BIGINT,
    "bom_item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_product_bom_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "bom_item_id" BIGINT;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_bom" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_product_bom_tenant_id_idx" ON "mes_md_product_bom"("tenant_id");

-- MES 产品SIP
CREATE TABLE IF NOT EXISTS "mes_md_product_sip" (
    "id" TEXT NOT NULL,
    "item_id" BIGINT,
    "sort" INTEGER,
    "process_id" BIGINT,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_product_sip_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_sip" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_product_sip_tenant_id_idx" ON "mes_md_product_sip"("tenant_id");

-- MES 产品SOP
CREATE TABLE IF NOT EXISTS "mes_md_product_sop" (
    "id" TEXT NOT NULL,
    "item_id" BIGINT,
    "sort" INTEGER,
    "process_id" BIGINT,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_product_sop_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_product_sop" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_product_sop_tenant_id_idx" ON "mes_md_product_sop"("tenant_id");

-- MES 计量单位
CREATE TABLE IF NOT EXISTS "mes_md_unit_measure" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "primary_flag" BOOLEAN,
    "primary_id" BIGINT,
    "change_rate" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_unit_measure_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "primary_flag" BOOLEAN;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "primary_id" BIGINT;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "change_rate" DECIMAL(18,2);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_unit_measure" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_unit_measure_tenant_id_idx" ON "mes_md_unit_measure"("tenant_id");

-- MES 供应商
CREATE TABLE IF NOT EXISTS "mes_md_vendor" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "nickname" VARCHAR(255),
    "english_name" VARCHAR(255),
    "description" VARCHAR(255),
    "logo" VARCHAR(255),
    "level" VARCHAR(255),
    "score" INTEGER,
    "address" VARCHAR(255),
    "website" VARCHAR(255),
    "email" VARCHAR(255),
    "telephone" VARCHAR(255),
    "contact1_name" VARCHAR(255),
    "contact1_telephone" VARCHAR(255),
    "contact1_email" VARCHAR(255),
    "contact2_name" VARCHAR(255),
    "contact2_telephone" VARCHAR(255),
    "contact2_email" VARCHAR(255),
    "credit_code" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_vendor_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "english_name" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "logo" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "level" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "score" INTEGER;
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "website" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact1_name" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact1_telephone" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact1_email" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact2_name" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact2_telephone" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "contact2_email" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "credit_code" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_vendor" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_vendor_tenant_id_idx" ON "mes_md_vendor"("tenant_id");

-- MES 车间
CREATE TABLE IF NOT EXISTS "mes_md_workshop" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "area" DECIMAL(18,2),
    "charge_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_workshop_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "area" DECIMAL(18,2);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "charge_user_id" BIGINT;
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workshop" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_workshop_tenant_id_idx" ON "mes_md_workshop"("tenant_id");

-- MES 工作站
CREATE TABLE IF NOT EXISTS "mes_md_workstation" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "address" VARCHAR(255),
    "workshop_id" BIGINT,
    "process_id" BIGINT,
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_workstation_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "workshop_id" BIGINT;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_workstation_tenant_id_idx" ON "mes_md_workstation"("tenant_id");

-- MES 设备资源
CREATE TABLE IF NOT EXISTS "mes_md_workstation_machine" (
    "id" TEXT NOT NULL,
    "workstation_id" BIGINT,
    "machinery_id" BIGINT,
    "quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_workstation_machine_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "machinery_id" BIGINT;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_machine" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_workstation_machine_tenant_id_idx" ON "mes_md_workstation_machine"("tenant_id");

-- MES 工装夹具资源
CREATE TABLE IF NOT EXISTS "mes_md_workstation_tool" (
    "id" TEXT NOT NULL,
    "workstation_id" BIGINT,
    "tool_type_id" BIGINT,
    "quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_workstation_tool_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "tool_type_id" BIGINT;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_tool" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_workstation_tool_tenant_id_idx" ON "mes_md_workstation_tool"("tenant_id");

-- MES 人力资源
CREATE TABLE IF NOT EXISTS "mes_md_workstation_worker" (
    "id" TEXT NOT NULL,
    "workstation_id" BIGINT,
    "post_id" BIGINT,
    "quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_md_workstation_worker_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "post_id" BIGINT;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_md_workstation_worker" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_md_workstation_worker_tenant_id_idx" ON "mes_md_workstation_worker"("tenant_id");

-- MES 安灯呼叫配置
CREATE TABLE IF NOT EXISTS "mes_pro_andon_config" (
    "id" TEXT NOT NULL,
    "reason" VARCHAR(255),
    "level" INTEGER,
    "handler_role_id" BIGINT,
    "handler_user_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_andon_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "reason" VARCHAR(255);
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "handler_role_id" BIGINT;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "handler_user_id" BIGINT;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_andon_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_andon_config_tenant_id_idx" ON "mes_pro_andon_config"("tenant_id");

-- MES 安灯呼叫记录
CREATE TABLE IF NOT EXISTS "mes_pro_andon_record" (
    "id" TEXT NOT NULL,
    "config_id" BIGINT,
    "workstation_id" BIGINT,
    "user_id" BIGINT,
    "work_order_id" BIGINT,
    "process_id" BIGINT,
    "reason" VARCHAR(255),
    "level" INTEGER,
    "status" INTEGER,
    "handle_time" TIMESTAMP(3),
    "handler_user_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_andon_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "config_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "reason" VARCHAR(255);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "handle_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "handler_user_id" BIGINT;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_andon_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_andon_record_tenant_id_idx" ON "mes_pro_andon_record"("tenant_id");

-- MES 生产流转卡
CREATE TABLE IF NOT EXISTS "mes_pro_card" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "work_order_id" BIGINT,
    "item_id" BIGINT,
    "batch_code" VARCHAR(255),
    "transfered_quantity" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_card_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "transfered_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_card" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_card_tenant_id_idx" ON "mes_pro_card"("tenant_id");

-- MES 流转卡工序记录
CREATE TABLE IF NOT EXISTS "mes_pro_card_process" (
    "id" TEXT NOT NULL,
    "card_id" BIGINT,
    "sort" INTEGER,
    "process_id" BIGINT,
    "input_time" TIMESTAMP(3),
    "output_time" TIMESTAMP(3),
    "input_quantity" DECIMAL(18,2),
    "output_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "workstation_id" BIGINT,
    "user_id" BIGINT,
    "ipqc_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_card_process_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "card_id" BIGINT;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "input_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "output_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "input_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "output_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "ipqc_id" BIGINT;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_card_process" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_card_process_tenant_id_idx" ON "mes_pro_card_process"("tenant_id");

-- MES 生产报工
CREATE TABLE IF NOT EXISTS "mes_pro_feedback" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "type" INTEGER,
    "channel" VARCHAR(255),
    "feedback_time" TIMESTAMP(3),
    "workstation_id" BIGINT,
    "route_id" BIGINT,
    "process_id" BIGINT,
    "work_order_id" BIGINT,
    "task_id" BIGINT,
    "item_id" BIGINT,
    "expire_date" TIMESTAMP(3),
    "lot_number" VARCHAR(255),
    "scheduled_quantity" DECIMAL(18,2),
    "feedback_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "uncheck_quantity" DECIMAL(18,2),
    "labor_scrap_quantity" DECIMAL(18,2),
    "material_scrap_quantity" DECIMAL(18,2),
    "other_scrap_quantity" DECIMAL(18,2),
    "feedback_user_id" BIGINT,
    "approve_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_feedback_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "channel" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "feedback_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "route_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "lot_number" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "scheduled_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "feedback_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "uncheck_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "labor_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "material_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "other_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "feedback_user_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "approve_user_id" BIGINT;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_feedback" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_feedback_tenant_id_idx" ON "mes_pro_feedback"("tenant_id");

-- MES 生产工序
CREATE TABLE IF NOT EXISTS "mes_pro_process" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "attention" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_process_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "attention" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_process" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_process_tenant_id_idx" ON "mes_pro_process"("tenant_id");

-- MES 生产工序内容
CREATE TABLE IF NOT EXISTS "mes_pro_process_content" (
    "id" TEXT NOT NULL,
    "process_id" BIGINT,
    "sort" INTEGER,
    "content" VARCHAR(255),
    "device" VARCHAR(255),
    "material" VARCHAR(255),
    "doc_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_process_content_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "device" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "material" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "doc_url" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_process_content" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_process_content_tenant_id_idx" ON "mes_pro_process_content"("tenant_id");

-- MES 工艺路线
CREATE TABLE IF NOT EXISTS "mes_pro_route" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_route_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_route_tenant_id_idx" ON "mes_pro_route"("tenant_id");

-- MES 工艺路线工序
CREATE TABLE IF NOT EXISTS "mes_pro_route_process" (
    "id" TEXT NOT NULL,
    "route_id" BIGINT,
    "process_id" BIGINT,
    "sort" INTEGER,
    "next_process_id" BIGINT,
    "link_type" INTEGER,
    "prepare_time" INTEGER,
    "wait_time" INTEGER,
    "color_code" VARCHAR(255),
    "key_flag" BOOLEAN,
    "check_flag" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_route_process_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "route_id" BIGINT;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "next_process_id" BIGINT;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "link_type" INTEGER;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "prepare_time" INTEGER;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "wait_time" INTEGER;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "color_code" VARCHAR(255);
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "key_flag" BOOLEAN;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "check_flag" BOOLEAN;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_process" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_route_process_tenant_id_idx" ON "mes_pro_route_process"("tenant_id");

-- MES 工艺路线产品
CREATE TABLE IF NOT EXISTS "mes_pro_route_product" (
    "id" TEXT NOT NULL,
    "route_id" BIGINT,
    "item_id" BIGINT,
    "quantity" INTEGER,
    "production_time" DECIMAL(18,2),
    "time_unit_type" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_route_product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "route_id" BIGINT;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "production_time" DECIMAL(18,2);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "time_unit_type" VARCHAR(255);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_product" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_route_product_tenant_id_idx" ON "mes_pro_route_product"("tenant_id");

-- MES 工艺路线产品 BOM
CREATE TABLE IF NOT EXISTS "mes_pro_route_product_bom" (
    "id" TEXT NOT NULL,
    "route_id" BIGINT,
    "process_id" BIGINT,
    "product_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_route_product_bom_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "route_id" BIGINT;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "product_id" BIGINT;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_route_product_bom" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_route_product_bom_tenant_id_idx" ON "mes_pro_route_product_bom"("tenant_id");

-- MES 生产任务
CREATE TABLE IF NOT EXISTS "mes_pro_task" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "work_order_id" BIGINT,
    "workstation_id" BIGINT,
    "route_id" BIGINT,
    "process_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "produced_quantity" DECIMAL(18,2),
    "qualify_quantity" DECIMAL(18,2),
    "unqualify_quantity" DECIMAL(18,2),
    "changed_quantity" DECIMAL(18,2),
    "client_id" BIGINT,
    "start_time" TIMESTAMP(3),
    "duration" INTEGER,
    "end_time" TIMESTAMP(3),
    "color_code" VARCHAR(255),
    "finish_date" TIMESTAMP(3),
    "cancel_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_task_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "route_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "produced_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "qualify_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "unqualify_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "changed_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "duration" INTEGER;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "color_code" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "finish_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "cancel_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_task" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_task_tenant_id_idx" ON "mes_pro_task"("tenant_id");

-- MES 生产任务投料
CREATE TABLE IF NOT EXISTS "mes_pro_task_issue" (
    "id" TEXT NOT NULL,
    "task_id" BIGINT,
    "work_order_id" BIGINT,
    "workstation_id" BIGINT,
    "source_doc_type" VARCHAR(255),
    "source_doc_id" BIGINT,
    "source_line_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "batch_code" VARCHAR(255),
    "item_id" BIGINT,
    "unit_measure_id" BIGINT,
    "issued_quantity" DECIMAL(18,2),
    "available_quantity" DECIMAL(18,2),
    "used_quantity" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_task_issue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "source_doc_type" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "source_line_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "issued_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "available_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "used_quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_task_issue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_task_issue_tenant_id_idx" ON "mes_pro_task_issue"("tenant_id");

-- MES 生产工单
CREATE TABLE IF NOT EXISTS "mes_pro_work_order" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "order_source_type" INTEGER,
    "order_source_code" VARCHAR(255),
    "product_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "quantity_produced" DECIMAL(18,2),
    "quantity_changed" DECIMAL(18,2),
    "quantity_scheduled" DECIMAL(18,2),
    "client_id" BIGINT,
    "vendor_id" BIGINT,
    "batch_code" VARCHAR(255),
    "request_date" TIMESTAMP(3),
    "parent_id" BIGINT,
    "finish_date" TIMESTAMP(3),
    "cancel_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_work_order_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "order_source_type" INTEGER;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "order_source_code" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "product_id" BIGINT;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "quantity_produced" DECIMAL(18,2);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "quantity_changed" DECIMAL(18,2);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "quantity_scheduled" DECIMAL(18,2);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "request_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "parent_id" BIGINT;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "finish_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "cancel_date" TIMESTAMP(3);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_order" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_work_order_tenant_id_idx" ON "mes_pro_work_order"("tenant_id");

-- MES 生产工单 BOM
CREATE TABLE IF NOT EXISTS "mes_pro_work_order_bom" (
    "id" TEXT NOT NULL,
    "work_order_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_work_order_bom_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_order_bom" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_work_order_bom_tenant_id_idx" ON "mes_pro_work_order_bom"("tenant_id");

-- MES 用户工作站绑定关系（当前快照）
CREATE TABLE IF NOT EXISTS "mes_pro_work_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "workstation_id" BIGINT,
    "type" INTEGER,
    "clock_in_time" TIMESTAMP(3),
    "clock_out_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_work_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "clock_in_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "clock_out_time" TIMESTAMP(3);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_work_record_tenant_id_idx" ON "mes_pro_work_record"("tenant_id");

-- MES 上下工记录流水
CREATE TABLE IF NOT EXISTS "mes_pro_work_record_log" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "workstation_id" BIGINT,
    "type" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_pro_work_record_log_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_pro_work_record_log" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_pro_work_record_log_tenant_id_idx" ON "mes_pro_work_record_log"("tenant_id");

-- MES 缺陷类型
CREATE TABLE IF NOT EXISTS "mes_qc_defect" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "level" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_defect_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_defect" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_defect_tenant_id_idx" ON "mes_qc_defect"("tenant_id");

-- MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、
CREATE TABLE IF NOT EXISTS "mes_qc_defect_record" (
    "id" TEXT NOT NULL,
    "qc_type" INTEGER,
    "qc_id" BIGINT,
    "line_id" BIGINT,
    "name" VARCHAR(255),
    "level" INTEGER,
    "quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_defect_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "qc_type" INTEGER;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "qc_id" BIGINT;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_defect_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_defect_record_tenant_id_idx" ON "mes_qc_defect_record"("tenant_id");

-- MES 质检指标
CREATE TABLE IF NOT EXISTS "mes_qc_indicator" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "tool" VARCHAR(255),
    "result_type" INTEGER,
    "result_specification" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_indicator_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "tool" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "result_type" INTEGER;
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "result_specification" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_indicator_tenant_id_idx" ON "mes_qc_indicator"("tenant_id");

-- MES 检验结果记录
CREATE TABLE IF NOT EXISTS "mes_qc_indicator_result" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "qc_id" BIGINT,
    "qc_type" INTEGER,
    "item_id" BIGINT,
    "sn" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_indicator_result_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "qc_id" BIGINT;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "qc_type" INTEGER;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "sn" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator_result" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_indicator_result_tenant_id_idx" ON "mes_qc_indicator_result"("tenant_id");

-- MES 检验结果明细记录
CREATE TABLE IF NOT EXISTS "mes_qc_indicator_result_detail" (
    "id" TEXT NOT NULL,
    "result_id" BIGINT,
    "indicator_id" BIGINT,
    "value" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_indicator_result_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "result_id" BIGINT;
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "value" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_indicator_result_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_indicator_result_detail_tenant_id_idx" ON "mes_qc_indicator_result_detail"("tenant_id");

-- MES 过程检验单（IPQC, In-Process Quality Contr
CREATE TABLE IF NOT EXISTS "mes_qc_ipqc" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "template_id" BIGINT,
    "source_doc_type" INTEGER,
    "source_doc_id" BIGINT,
    "source_line_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "work_order_id" BIGINT,
    "task_id" BIGINT,
    "workstation_id" BIGINT,
    "process_id" BIGINT,
    "item_id" BIGINT,
    "check_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "labor_scrap_quantity" DECIMAL(18,2),
    "material_scrap_quantity" DECIMAL(18,2),
    "other_scrap_quantity" DECIMAL(18,2),
    "critical_rate" DECIMAL(18,2),
    "major_rate" DECIMAL(18,2),
    "minor_rate" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "check_result" INTEGER,
    "inspect_date" TIMESTAMP(3),
    "inspector_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_ipqc_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "source_doc_type" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "source_line_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "check_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "labor_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "material_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "other_scrap_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "critical_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "major_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "minor_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "check_result" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "inspect_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "inspector_user_id" BIGINT;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_ipqc" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_ipqc_tenant_id_idx" ON "mes_qc_ipqc"("tenant_id");

-- MES 过程检验单行
CREATE TABLE IF NOT EXISTS "mes_qc_ipqc_line" (
    "id" TEXT NOT NULL,
    "ipqc_id" BIGINT,
    "indicator_id" BIGINT,
    "tool" VARCHAR(255),
    "check_method" VARCHAR(255),
    "standard_value" DECIMAL(18,2),
    "unit_measure_id" BIGINT,
    "max_threshold" DECIMAL(18,2),
    "min_threshold" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_ipqc_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "ipqc_id" BIGINT;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "tool" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "check_method" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "standard_value" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "max_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "min_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_ipqc_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_ipqc_line_tenant_id_idx" ON "mes_qc_ipqc_line"("tenant_id");

-- MES 来料检验单（IQC, Incoming Quality Control）
CREATE TABLE IF NOT EXISTS "mes_qc_iqc" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "template_id" BIGINT,
    "source_doc_type" INTEGER,
    "source_doc_id" BIGINT,
    "source_line_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "vendor_id" BIGINT,
    "vendor_batch" VARCHAR(255),
    "item_id" BIGINT,
    "received_quantity" DECIMAL(18,2),
    "check_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "critical_rate" DECIMAL(18,2),
    "major_rate" DECIMAL(18,2),
    "minor_rate" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "check_result" INTEGER,
    "receive_date" TIMESTAMP(3),
    "inspect_date" TIMESTAMP(3),
    "inspector_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_iqc_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "source_doc_type" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "source_line_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "vendor_batch" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "received_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "check_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "critical_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "major_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "minor_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "check_result" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "receive_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "inspect_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "inspector_user_id" BIGINT;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_iqc" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_iqc_tenant_id_idx" ON "mes_qc_iqc"("tenant_id");

-- MES 来料检验单行
CREATE TABLE IF NOT EXISTS "mes_qc_iqc_line" (
    "id" TEXT NOT NULL,
    "iqc_id" BIGINT,
    "indicator_id" BIGINT,
    "tool" VARCHAR(255),
    "check_method" VARCHAR(255),
    "standard_value" DECIMAL(18,2),
    "unit_measure_id" BIGINT,
    "max_threshold" DECIMAL(18,2),
    "min_threshold" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_iqc_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "iqc_id" BIGINT;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "tool" VARCHAR(255);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "check_method" VARCHAR(255);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "standard_value" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "max_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "min_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_iqc_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_iqc_line_tenant_id_idx" ON "mes_qc_iqc_line"("tenant_id");

-- MES 出货检验单（OQC, Outgoing Quality Control）
CREATE TABLE IF NOT EXISTS "mes_qc_oqc" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "template_id" BIGINT,
    "source_doc_type" INTEGER,
    "source_doc_id" BIGINT,
    "source_line_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "client_id" BIGINT,
    "batch_code" VARCHAR(255),
    "item_id" BIGINT,
    "min_check_quantity" INTEGER,
    "max_unqualified_quantity" INTEGER,
    "out_quantity" DECIMAL(18,2),
    "check_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "critical_rate" DECIMAL(18,2),
    "major_rate" DECIMAL(18,2),
    "minor_rate" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "check_result" INTEGER,
    "out_date" TIMESTAMP(3),
    "inspect_date" TIMESTAMP(3),
    "inspector_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_oqc_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "source_doc_type" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "source_line_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "min_check_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "max_unqualified_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "out_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "check_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "critical_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "major_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "minor_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "check_result" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "out_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "inspect_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "inspector_user_id" BIGINT;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_oqc" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_oqc_tenant_id_idx" ON "mes_qc_oqc"("tenant_id");

-- MES 出货检验单行
CREATE TABLE IF NOT EXISTS "mes_qc_oqc_line" (
    "id" TEXT NOT NULL,
    "oqc_id" BIGINT,
    "indicator_id" BIGINT,
    "tool" VARCHAR(255),
    "check_method" VARCHAR(255),
    "standard_value" DECIMAL(18,2),
    "unit_measure_id" BIGINT,
    "max_threshold" DECIMAL(18,2),
    "min_threshold" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_oqc_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "oqc_id" BIGINT;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "tool" VARCHAR(255);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "check_method" VARCHAR(255);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "standard_value" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "max_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "min_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_oqc_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_oqc_line_tenant_id_idx" ON "mes_qc_oqc_line"("tenant_id");

-- MES 退货检验单（RQC, Return Quality Control）
CREATE TABLE IF NOT EXISTS "mes_qc_rqc" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "template_id" BIGINT,
    "source_doc_type" INTEGER,
    "source_doc_id" BIGINT,
    "source_line_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "type" INTEGER,
    "item_id" BIGINT,
    "batch_code" VARCHAR(255),
    "check_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "unqualified_quantity" DECIMAL(18,2),
    "critical_rate" DECIMAL(18,2),
    "major_rate" DECIMAL(18,2),
    "minor_rate" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "check_result" INTEGER,
    "inspect_date" TIMESTAMP(3),
    "inspector_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_rqc_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "source_doc_type" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "source_line_id" BIGINT;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "check_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "unqualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "critical_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "major_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "minor_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "check_result" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "inspect_date" TIMESTAMP(3);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "inspector_user_id" BIGINT;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_rqc" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_rqc_tenant_id_idx" ON "mes_qc_rqc"("tenant_id");

-- MES 退货检验行
CREATE TABLE IF NOT EXISTS "mes_qc_rqc_line" (
    "id" TEXT NOT NULL,
    "rqc_id" BIGINT,
    "indicator_id" BIGINT,
    "tool" VARCHAR(255),
    "check_method" VARCHAR(255),
    "standard_value" DECIMAL(18,2),
    "unit_measure_id" BIGINT,
    "max_threshold" DECIMAL(18,2),
    "min_threshold" DECIMAL(18,2),
    "critical_quantity" INTEGER,
    "major_quantity" INTEGER,
    "minor_quantity" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_rqc_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "rqc_id" BIGINT;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "tool" VARCHAR(255);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "check_method" VARCHAR(255);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "standard_value" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "max_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "min_threshold" DECIMAL(18,2);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "critical_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "major_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "minor_quantity" INTEGER;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_rqc_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_rqc_line_tenant_id_idx" ON "mes_qc_rqc_line"("tenant_id");

-- MES 质检方案
CREATE TABLE IF NOT EXISTS "mes_qc_template" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "types" TEXT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_template_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "types" TEXT;
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_template_tenant_id_idx" ON "mes_qc_template"("tenant_id");

-- MES 质检方案-检测指标项
CREATE TABLE IF NOT EXISTS "mes_qc_template_indicator" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "indicator_id" BIGINT,
    "check_method" VARCHAR(255),
    "standard_value" DECIMAL(18,2),
    "unit_measure_id" BIGINT,
    "threshold_max" DECIMAL(18,2),
    "threshold_min" DECIMAL(18,2),
    "doc_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_template_indicator_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "indicator_id" BIGINT;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "check_method" VARCHAR(255);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "standard_value" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "unit_measure_id" BIGINT;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "threshold_max" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "threshold_min" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "doc_url" VARCHAR(255);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template_indicator" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_template_indicator_tenant_id_idx" ON "mes_qc_template_indicator"("tenant_id");

-- MES 质检方案-产品关联
CREATE TABLE IF NOT EXISTS "mes_qc_template_item" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "item_id" BIGINT,
    "quantity_check" INTEGER,
    "quantity_unqualified" INTEGER,
    "critical_rate" DECIMAL(18,2),
    "major_rate" DECIMAL(18,2),
    "minor_rate" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_qc_template_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "template_id" BIGINT;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "quantity_check" INTEGER;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "quantity_unqualified" INTEGER;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "critical_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "major_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "minor_rate" DECIMAL(18,2);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_qc_template_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_qc_template_item_tenant_id_idx" ON "mes_qc_template_item"("tenant_id");

-- MES 工具台账
CREATE TABLE IF NOT EXISTS "mes_tm_tool" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "brand" VARCHAR(255),
    "specification" VARCHAR(255),
    "tool_type_id" BIGINT,
    "quantity" INTEGER,
    "available_quantity" INTEGER,
    "mainten_type" INTEGER,
    "next_mainten_period" INTEGER,
    "next_mainten_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_tm_tool_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "brand" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "specification" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "tool_type_id" BIGINT;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "available_quantity" INTEGER;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "mainten_type" INTEGER;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "next_mainten_period" INTEGER;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "next_mainten_date" TIMESTAMP(3);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_tm_tool" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_tm_tool_tenant_id_idx" ON "mes_tm_tool"("tenant_id");

-- MES 工具类型
CREATE TABLE IF NOT EXISTS "mes_tm_tool_type" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "code_flag" BOOLEAN,
    "mainten_type" INTEGER,
    "mainten_period" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_tm_tool_type_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "code_flag" BOOLEAN;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "mainten_type" INTEGER;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "mainten_period" INTEGER;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_tm_tool_type" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_tm_tool_type_tenant_id_idx" ON "mes_tm_tool_type"("tenant_id");

-- MES 到货通知单
CREATE TABLE IF NOT EXISTS "mes_wm_arrival_notice" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "purchase_order_code" VARCHAR(255),
    "vendor_id" BIGINT,
    "arrival_date" TIMESTAMP(3),
    "contact_name" VARCHAR(255),
    "contact_telephone" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_arrival_notice_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "purchase_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "arrival_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "contact_name" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "contact_telephone" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_arrival_notice_tenant_id_idx" ON "mes_wm_arrival_notice"("tenant_id");

-- MES 到货通知单行
CREATE TABLE IF NOT EXISTS "mes_wm_arrival_notice_line" (
    "id" TEXT NOT NULL,
    "notice_id" BIGINT,
    "item_id" BIGINT,
    "arrival_quantity" DECIMAL(18,2),
    "qualified_quantity" DECIMAL(18,2),
    "iqc_check_flag" BOOLEAN,
    "iqc_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_arrival_notice_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "notice_id" BIGINT;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "arrival_quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "qualified_quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "iqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "iqc_id" BIGINT;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_arrival_notice_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_arrival_notice_line_tenant_id_idx" ON "mes_wm_arrival_notice_line"("tenant_id");

-- MES 条码清单
CREATE TABLE IF NOT EXISTS "mes_wm_barcode" (
    "id" TEXT NOT NULL,
    "config_id" BIGINT,
    "format" INTEGER,
    "biz_type" INTEGER,
    "content" VARCHAR(255),
    "biz_id" BIGINT,
    "biz_code" VARCHAR(255),
    "biz_name" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_barcode_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "config_id" BIGINT;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "format" INTEGER;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "biz_id" BIGINT;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "biz_code" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "biz_name" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_barcode" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_barcode_tenant_id_idx" ON "mes_wm_barcode"("tenant_id");

-- MES 条码配置
CREATE TABLE IF NOT EXISTS "mes_wm_barcode_config" (
    "id" TEXT NOT NULL,
    "format" INTEGER,
    "biz_type" INTEGER,
    "content_format" VARCHAR(255),
    "content_example" VARCHAR(255),
    "auto_generate_flag" BOOLEAN,
    "default_template" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_barcode_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "format" INTEGER;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "content_format" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "content_example" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "auto_generate_flag" BOOLEAN;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "default_template" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_barcode_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_barcode_config_tenant_id_idx" ON "mes_wm_barcode_config"("tenant_id");

-- 批次管理
CREATE TABLE IF NOT EXISTS "mes_wm_batch" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "item_id" BIGINT,
    "produce_date" TIMESTAMP(3),
    "expire_date" TIMESTAMP(3),
    "receipt_date" TIMESTAMP(3),
    "vendor_id" BIGINT,
    "client_id" BIGINT,
    "sales_order_code" VARCHAR(255),
    "purchase_order_code" VARCHAR(255),
    "work_order_id" BIGINT,
    "task_id" BIGINT,
    "workstation_id" BIGINT,
    "tool_id" BIGINT,
    "mold_id" BIGINT,
    "lot_number" VARCHAR(255),
    "quality_status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_batch_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "produce_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "receipt_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "sales_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "purchase_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "tool_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "mold_id" BIGINT;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "lot_number" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_batch" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_batch_tenant_id_idx" ON "mes_wm_batch"("tenant_id");

-- MES 物料消耗记录
CREATE TABLE IF NOT EXISTS "mes_wm_item_consume" (
    "id" TEXT NOT NULL,
    "work_order_id" BIGINT,
    "task_id" BIGINT,
    "workstation_id" BIGINT,
    "process_id" BIGINT,
    "feedback_id" BIGINT,
    "consume_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_consume_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "feedback_id" BIGINT;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "consume_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_consume_tenant_id_idx" ON "mes_wm_item_consume"("tenant_id");

-- MES 物料消耗记录明细 DO记录 line 级别的消耗按线边库 FIFO 分配
CREATE TABLE IF NOT EXISTS "mes_wm_item_consume_detail" (
    "id" TEXT NOT NULL,
    "consume_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_consume_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "consume_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_consume_detail_tenant_id_idx" ON "mes_wm_item_consume_detail"("tenant_id");

-- MES 物料消耗记录行
CREATE TABLE IF NOT EXISTS "mes_wm_item_consume_line" (
    "id" TEXT NOT NULL,
    "consume_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_consume_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "consume_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_consume_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_consume_line_tenant_id_idx" ON "mes_wm_item_consume_line"("tenant_id");

-- MES 采购入库单
CREATE TABLE IF NOT EXISTS "mes_wm_item_receipt" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "iqc_id" BIGINT,
    "notice_id" BIGINT,
    "purchase_order_code" VARCHAR(255),
    "vendor_id" BIGINT,
    "receipt_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_receipt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "iqc_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "notice_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "purchase_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "receipt_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_receipt_tenant_id_idx" ON "mes_wm_item_receipt"("tenant_id");

-- MES 采购入库明细
CREATE TABLE IF NOT EXISTS "mes_wm_item_receipt_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_receipt_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_receipt_detail_tenant_id_idx" ON "mes_wm_item_receipt_detail"("tenant_id");

-- MES 采购入库单行
CREATE TABLE IF NOT EXISTS "mes_wm_item_receipt_line" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "arrival_notice_line_id" BIGINT,
    "item_id" BIGINT,
    "received_quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "production_date" TIMESTAMP(3),
    "expire_date" TIMESTAMP(3),
    "lot_number" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_item_receipt_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "arrival_notice_line_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "received_quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "production_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "lot_number" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_item_receipt_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_item_receipt_line_tenant_id_idx" ON "mes_wm_item_receipt_line"("tenant_id");

-- MES 库存台账（仓库现有量）
CREATE TABLE IF NOT EXISTS "mes_wm_material_stock" (
    "id" TEXT NOT NULL,
    "item_type_id" BIGINT,
    "item_id" BIGINT,
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "vendor_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "receipt_time" TIMESTAMP(3),
    "frozen" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_material_stock_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "item_type_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "receipt_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_material_stock" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_material_stock_tenant_id_idx" ON "mes_wm_material_stock"("tenant_id");

-- MES 杂项出库单
CREATE TABLE IF NOT EXISTS "mes_wm_misc_issue" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "source_doc_type" VARCHAR(255),
    "source_doc_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "issue_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_issue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "source_doc_type" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "issue_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_issue_tenant_id_idx" ON "mes_wm_misc_issue"("tenant_id");

-- MES 杂项出库明细
CREATE TABLE IF NOT EXISTS "mes_wm_misc_issue_detail" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_issue_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_issue_detail_tenant_id_idx" ON "mes_wm_misc_issue_detail"("tenant_id");

-- MES 杂项出库单行
CREATE TABLE IF NOT EXISTS "mes_wm_misc_issue_line" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "source_doc_line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_issue_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "source_doc_line_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_issue_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_issue_line_tenant_id_idx" ON "mes_wm_misc_issue_line"("tenant_id");

-- MES 杂项入库单
CREATE TABLE IF NOT EXISTS "mes_wm_misc_receipt" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "source_doc_type" VARCHAR(255),
    "source_doc_id" BIGINT,
    "source_doc_code" VARCHAR(255),
    "receipt_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_receipt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "source_doc_type" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "source_doc_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "source_doc_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "receipt_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_receipt_tenant_id_idx" ON "mes_wm_misc_receipt"("tenant_id");

-- MES 杂项入库明细
CREATE TABLE IF NOT EXISTS "mes_wm_misc_receipt_detail" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "line_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_receipt_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_receipt_detail_tenant_id_idx" ON "mes_wm_misc_receipt_detail"("tenant_id");

-- MES 杂项入库单行
CREATE TABLE IF NOT EXISTS "mes_wm_misc_receipt_line" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_misc_receipt_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_misc_receipt_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_misc_receipt_line_tenant_id_idx" ON "mes_wm_misc_receipt_line"("tenant_id");

-- MES 外协发料单
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_issue" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "vendor_id" BIGINT,
    "work_order_id" BIGINT,
    "issue_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_issue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "issue_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_issue_tenant_id_idx" ON "mes_wm_outsource_issue"("tenant_id");

-- MES 外协发料单明细
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_issue_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "issue_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_issue_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_issue_detail_tenant_id_idx" ON "mes_wm_outsource_issue_detail"("tenant_id");

-- MES 外协发料单行
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_issue_line" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_issue_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_issue_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_issue_line_tenant_id_idx" ON "mes_wm_outsource_issue_line"("tenant_id");

-- MES 外协入库单
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_receipt" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "work_order_id" BIGINT,
    "vendor_id" BIGINT,
    "receipt_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_receipt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "receipt_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_receipt_tenant_id_idx" ON "mes_wm_outsource_receipt"("tenant_id");

-- MES 外协入库明细
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_receipt_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_receipt_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_receipt_detail_tenant_id_idx" ON "mes_wm_outsource_receipt_detail"("tenant_id");

-- MES 外协入库单行
CREATE TABLE IF NOT EXISTS "mes_wm_outsource_receipt_line" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "production_date" TIMESTAMP(3),
    "expire_date" TIMESTAMP(3),
    "lot_number" VARCHAR(255),
    "remark" VARCHAR(255),
    "iqc_id" BIGINT,
    "iqc_check_flag" BOOLEAN,
    "quality_status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_outsource_receipt_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "production_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "lot_number" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "iqc_id" BIGINT;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "iqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_outsource_receipt_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_outsource_receipt_line_tenant_id_idx" ON "mes_wm_outsource_receipt_line"("tenant_id");

-- MES 装箱单
CREATE TABLE IF NOT EXISTS "mes_wm_package" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "parent_id" BIGINT,
    "package_date" TIMESTAMP(3),
    "sales_order_code" VARCHAR(255),
    "invoice_code" VARCHAR(255),
    "client_id" BIGINT,
    "length" DECIMAL(18,2),
    "width" DECIMAL(18,2),
    "height" DECIMAL(18,2),
    "size_unit_id" BIGINT,
    "net_weight" DECIMAL(18,2),
    "gross_weight" DECIMAL(18,2),
    "weight_unit_id" BIGINT,
    "inspector_user_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_package_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "parent_id" BIGINT;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "package_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "sales_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "invoice_code" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "length" DECIMAL(18,2);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "width" DECIMAL(18,2);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "height" DECIMAL(18,2);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "size_unit_id" BIGINT;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "net_weight" DECIMAL(18,2);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "gross_weight" DECIMAL(18,2);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "weight_unit_id" BIGINT;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "inspector_user_id" BIGINT;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_package" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_package_tenant_id_idx" ON "mes_wm_package"("tenant_id");

-- MES 装箱明细
CREATE TABLE IF NOT EXISTS "mes_wm_package_line" (
    "id" TEXT NOT NULL,
    "package_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "work_order_id" BIGINT,
    "expire_date" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_package_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "package_id" BIGINT;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_package_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_package_line_tenant_id_idx" ON "mes_wm_package_line"("tenant_id");

-- MES 领料出库单
CREATE TABLE IF NOT EXISTS "mes_wm_product_issue" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "workstation_id" BIGINT,
    "work_order_id" BIGINT,
    "task_id" BIGINT,
    "issue_date" TIMESTAMP(3),
    "required_time" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_issue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "issue_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "required_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_issue_tenant_id_idx" ON "mes_wm_product_issue"("tenant_id");

-- MES 领料出库明细
CREATE TABLE IF NOT EXISTS "mes_wm_product_issue_detail" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_issue_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_issue_detail_tenant_id_idx" ON "mes_wm_product_issue_detail"("tenant_id");

-- MES 领料出库单行
CREATE TABLE IF NOT EXISTS "mes_wm_product_issue_line" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_issue_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_issue_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_issue_line_tenant_id_idx" ON "mes_wm_product_issue_line"("tenant_id");

-- MES 生产入库单
CREATE TABLE IF NOT EXISTS "mes_wm_product_produce" (
    "id" TEXT NOT NULL,
    "work_order_id" BIGINT,
    "feedback_id" BIGINT,
    "task_id" BIGINT,
    "workstation_id" BIGINT,
    "process_id" BIGINT,
    "produce_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_produce_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "feedback_id" BIGINT;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "process_id" BIGINT;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "produce_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_produce_tenant_id_idx" ON "mes_wm_product_produce"("tenant_id");

-- MES 生产入库明细
CREATE TABLE IF NOT EXISTS "mes_wm_product_produce_detail" (
    "id" TEXT NOT NULL,
    "produce_id" BIGINT,
    "line_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_produce_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "produce_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_produce_detail_tenant_id_idx" ON "mes_wm_product_produce_detail"("tenant_id");

-- MES 生产入库单行
CREATE TABLE IF NOT EXISTS "mes_wm_product_produce_line" (
    "id" TEXT NOT NULL,
    "produce_id" BIGINT,
    "feedback_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "expire_date" TIMESTAMP(3),
    "lot_number" VARCHAR(255),
    "quality_status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_produce_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "produce_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "feedback_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "expire_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "lot_number" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_produce_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_produce_line_tenant_id_idx" ON "mes_wm_product_produce_line"("tenant_id");

-- MES 产品收货（入库）单
CREATE TABLE IF NOT EXISTS "mes_wm_product_receipt" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "work_order_id" BIGINT,
    "item_id" BIGINT,
    "receipt_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_receipt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "receipt_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_receipt_tenant_id_idx" ON "mes_wm_product_receipt"("tenant_id");

-- MES 产品收货（入库）单明细
CREATE TABLE IF NOT EXISTS "mes_wm_product_receipt_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_receipt_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_receipt_detail_tenant_id_idx" ON "mes_wm_product_receipt_detail"("tenant_id");

-- MES 产品收货（入库）单行
CREATE TABLE IF NOT EXISTS "mes_wm_product_receipt_line" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "item_id" BIGINT,
    "material_stock_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_receipt_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "receipt_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_receipt_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_receipt_line_tenant_id_idx" ON "mes_wm_product_receipt_line"("tenant_id");

-- MES 销售出库单
CREATE TABLE IF NOT EXISTS "mes_wm_product_sales" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "client_id" BIGINT,
    "sales_order_code" VARCHAR(255),
    "notice_id" BIGINT,
    "sales_date" TIMESTAMP(3),
    "contact_name" VARCHAR(255),
    "contact_telephone" VARCHAR(255),
    "contact_address" VARCHAR(255),
    "carrier" VARCHAR(255),
    "shipping_number" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_sales_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "sales_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "notice_id" BIGINT;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "sales_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "contact_name" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "contact_telephone" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "contact_address" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "carrier" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "shipping_number" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_sales_tenant_id_idx" ON "mes_wm_product_sales"("tenant_id");

-- MES 销售出库明细
CREATE TABLE IF NOT EXISTS "mes_wm_product_sales_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "sales_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "material_stock_id" BIGINT,
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_sales_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "sales_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_sales_detail_tenant_id_idx" ON "mes_wm_product_sales_detail"("tenant_id");

-- MES 销售出库单行
CREATE TABLE IF NOT EXISTS "mes_wm_product_sales_line" (
    "id" TEXT NOT NULL,
    "sales_id" BIGINT,
    "notice_line_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "material_stock_id" BIGINT,
    "oqc_check_flag" BOOLEAN,
    "oqc_id" BIGINT,
    "quality_status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_product_sales_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "sales_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "notice_line_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "oqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "oqc_id" BIGINT;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_product_sales_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_product_sales_line_tenant_id_idx" ON "mes_wm_product_sales_line"("tenant_id");

-- MES 生产退料单
CREATE TABLE IF NOT EXISTS "mes_wm_return_issue" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "work_order_id" BIGINT,
    "workstation_id" BIGINT,
    "type" INTEGER,
    "return_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_issue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "workstation_id" BIGINT;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "return_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_issue_tenant_id_idx" ON "mes_wm_return_issue"("tenant_id");

-- MES 生产退料明细
CREATE TABLE IF NOT EXISTS "mes_wm_return_issue_detail" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_issue_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_issue_detail_tenant_id_idx" ON "mes_wm_return_issue_detail"("tenant_id");

-- MES 生产退料单行
CREATE TABLE IF NOT EXISTS "mes_wm_return_issue_line" (
    "id" TEXT NOT NULL,
    "issue_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "rqc_id" BIGINT,
    "rqc_check_flag" BOOLEAN,
    "quality_status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_issue_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "issue_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "rqc_id" BIGINT;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "rqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_issue_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_issue_line_tenant_id_idx" ON "mes_wm_return_issue_line"("tenant_id");

-- MES 销售退货单
CREATE TABLE IF NOT EXISTS "mes_wm_return_sales" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "sales_order_code" VARCHAR(255),
    "client_id" BIGINT,
    "return_date" TIMESTAMP(3),
    "return_reason" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_sales_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "sales_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "return_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "return_reason" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_sales_tenant_id_idx" ON "mes_wm_return_sales"("tenant_id");

-- MES 销售退货明细
CREATE TABLE IF NOT EXISTS "mes_wm_return_sales_detail" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "line_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_sales_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "return_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_sales_detail_tenant_id_idx" ON "mes_wm_return_sales_detail"("tenant_id");

-- MES 销售退货单行
CREATE TABLE IF NOT EXISTS "mes_wm_return_sales_line" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "rqc_id" BIGINT,
    "rqc_check_flag" BOOLEAN,
    "quality_status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_sales_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "return_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "rqc_id" BIGINT;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "rqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "quality_status" INTEGER;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_sales_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_sales_line_tenant_id_idx" ON "mes_wm_return_sales_line"("tenant_id");

-- MES 供应商退货单
CREATE TABLE IF NOT EXISTS "mes_wm_return_vendor" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "purchase_order_code" VARCHAR(255),
    "vendor_id" BIGINT,
    "return_date" TIMESTAMP(3),
    "return_reason" VARCHAR(255),
    "transport_code" VARCHAR(255),
    "transport_telephone" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_vendor_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "purchase_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "vendor_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "return_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "return_reason" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "transport_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "transport_telephone" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_vendor_tenant_id_idx" ON "mes_wm_return_vendor"("tenant_id");

-- MES 供应商退货明细
CREATE TABLE IF NOT EXISTS "mes_wm_return_vendor_detail" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_vendor_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "return_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_vendor_detail_tenant_id_idx" ON "mes_wm_return_vendor_detail"("tenant_id");

-- MES 供应商退货单行
CREATE TABLE IF NOT EXISTS "mes_wm_return_vendor_line" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_return_vendor_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "return_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_return_vendor_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_return_vendor_line_tenant_id_idx" ON "mes_wm_return_vendor_line"("tenant_id");

-- MES 发货通知单
CREATE TABLE IF NOT EXISTS "mes_wm_sales_notice" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "sales_order_code" VARCHAR(255),
    "client_id" BIGINT,
    "sales_date" TIMESTAMP(3),
    "recipient_name" VARCHAR(255),
    "recipient_telephone" VARCHAR(255),
    "recipient_address" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_sales_notice_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "sales_order_code" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "client_id" BIGINT;
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "sales_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "recipient_name" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "recipient_telephone" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "recipient_address" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sales_notice" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_sales_notice_tenant_id_idx" ON "mes_wm_sales_notice"("tenant_id");

-- MES 发货通知单行
CREATE TABLE IF NOT EXISTS "mes_wm_sales_notice_line" (
    "id" TEXT NOT NULL,
    "notice_id" BIGINT,
    "item_id" BIGINT,
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "quantity" DECIMAL(18,2),
    "oqc_check_flag" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_sales_notice_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "notice_id" BIGINT;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "oqc_check_flag" BOOLEAN;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sales_notice_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_sales_notice_line_tenant_id_idx" ON "mes_wm_sales_notice_line"("tenant_id");

-- MES SN 码
CREATE TABLE IF NOT EXISTS "mes_wm_sn" (
    "id" TEXT NOT NULL,
    "uuid" VARCHAR(255),
    "code" VARCHAR(255),
    "item_id" BIGINT,
    "batch_code" VARCHAR(255),
    "work_order_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_sn_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "uuid" VARCHAR(255);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "work_order_id" BIGINT;
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_sn" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_sn_tenant_id_idx" ON "mes_wm_sn"("tenant_id");

-- MES 盘点方案
CREATE TABLE IF NOT EXISTS "mes_wm_stock_taking_plan" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "blind_flag" BOOLEAN,
    "frozen" BOOLEAN,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_stock_taking_plan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "blind_flag" BOOLEAN;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_stock_taking_plan_tenant_id_idx" ON "mes_wm_stock_taking_plan"("tenant_id");

-- MES 盘点方案参数
CREATE TABLE IF NOT EXISTS "mes_wm_stock_taking_plan_param" (
    "id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "type" INTEGER,
    "value_id" BIGINT,
    "value_code" VARCHAR(255),
    "value_name" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_stock_taking_plan_param_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "value_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "value_code" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "value_name" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_plan_param" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_stock_taking_plan_param_tenant_id_idx" ON "mes_wm_stock_taking_plan_param"("tenant_id");

-- MES 盘点任务
CREATE TABLE IF NOT EXISTS "mes_wm_stock_taking_task" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "taking_date" TIMESTAMP(3),
    "type" INTEGER,
    "user_id" BIGINT,
    "plan_id" BIGINT,
    "blind_flag" BOOLEAN,
    "frozen" BOOLEAN,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_stock_taking_task_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "taking_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "user_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "plan_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "blind_flag" BOOLEAN;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_stock_taking_task_tenant_id_idx" ON "mes_wm_stock_taking_task"("tenant_id");

-- MES 盘点任务行
CREATE TABLE IF NOT EXISTS "mes_wm_stock_taking_task_line" (
    "id" TEXT NOT NULL,
    "task_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "quantity" DECIMAL(18,2),
    "taking_quantity" DECIMAL(18,2),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_stock_taking_task_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "taking_quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_stock_taking_task_line_tenant_id_idx" ON "mes_wm_stock_taking_task_line"("tenant_id");

-- MES 盘点结果
CREATE TABLE IF NOT EXISTS "mes_wm_stock_taking_task_result" (
    "id" TEXT NOT NULL,
    "task_id" BIGINT,
    "line_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "taking_quantity" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_stock_taking_task_result_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "task_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "taking_quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_stock_taking_task_result" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_stock_taking_task_result_tenant_id_idx" ON "mes_wm_stock_taking_task_result"("tenant_id");

-- MES 库存事务流水 DO记录每一笔库存增减事件，系统自动生成，只读查询，不允许
CREATE TABLE IF NOT EXISTS "mes_wm_transaction" (
    "id" TEXT NOT NULL,
    "type" INTEGER,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "biz_code" VARCHAR(255),
    "biz_line_id" BIGINT,
    "material_stock_id" BIGINT,
    "related_transaction_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "batch_code" VARCHAR(255),
    "warehouse_id" BIGINT,
    "location_id" BIGINT,
    "area_id" BIGINT,
    "transaction_time" TIMESTAMP(3),
    "erp_time" TIMESTAMP(3),
    "receipt_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_transaction_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "biz_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "biz_code" VARCHAR(255);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "biz_line_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "related_transaction_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "batch_code" VARCHAR(255);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "area_id" BIGINT;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "transaction_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "erp_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "receipt_time" TIMESTAMP(3);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transaction" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_transaction_tenant_id_idx" ON "mes_wm_transaction"("tenant_id");

-- MES 转移单
CREATE TABLE IF NOT EXISTS "mes_wm_transfer" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "type" INTEGER,
    "delivery_flag" BOOLEAN,
    "recipient_name" VARCHAR(255),
    "recipient_telephone" VARCHAR(255),
    "destination_address" VARCHAR(255),
    "carrier" VARCHAR(255),
    "shipping_number" VARCHAR(255),
    "confirm_flag" BOOLEAN,
    "transfer_date" TIMESTAMP(3),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_transfer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "delivery_flag" BOOLEAN;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "recipient_name" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "recipient_telephone" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "destination_address" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "carrier" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "shipping_number" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "confirm_flag" BOOLEAN;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "transfer_date" TIMESTAMP(3);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_transfer_tenant_id_idx" ON "mes_wm_transfer"("tenant_id");

-- MES 调拨明细
CREATE TABLE IF NOT EXISTS "mes_wm_transfer_detail" (
    "id" TEXT NOT NULL,
    "line_id" BIGINT,
    "transfer_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "to_warehouse_id" BIGINT,
    "to_location_id" BIGINT,
    "to_area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_transfer_detail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "line_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "transfer_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "to_warehouse_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "to_location_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "to_area_id" BIGINT;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer_detail" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_transfer_detail_tenant_id_idx" ON "mes_wm_transfer_detail"("tenant_id");

-- MES 转移单行
CREATE TABLE IF NOT EXISTS "mes_wm_transfer_line" (
    "id" TEXT NOT NULL,
    "transfer_id" BIGINT,
    "material_stock_id" BIGINT,
    "item_id" BIGINT,
    "quantity" DECIMAL(18,2),
    "batch_id" BIGINT,
    "from_warehouse_id" BIGINT,
    "from_location_id" BIGINT,
    "from_area_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_transfer_line_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "transfer_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "material_stock_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "item_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "quantity" DECIMAL(18,2);
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "batch_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "from_warehouse_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "from_location_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "from_area_id" BIGINT;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_transfer_line" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_transfer_line_tenant_id_idx" ON "mes_wm_transfer_line"("tenant_id");

-- MES 仓库
CREATE TABLE IF NOT EXISTS "mes_wm_warehouse" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "address" VARCHAR(255),
    "area" DECIMAL(18,2),
    "charge_user_id" BIGINT,
    "frozen" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_warehouse_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "area" DECIMAL(18,2);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "charge_user_id" BIGINT;
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_warehouse_tenant_id_idx" ON "mes_wm_warehouse"("tenant_id");

-- MES 库位
CREATE TABLE IF NOT EXISTS "mes_wm_warehouse_area" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "location_id" BIGINT,
    "area" DECIMAL(18,2),
    "max_load" DECIMAL(18,2),
    "position_x" INTEGER,
    "position_y" INTEGER,
    "position_z" INTEGER,
    "status" INTEGER,
    "frozen" BOOLEAN,
    "allow_item_mixing" BOOLEAN,
    "allow_batch_mixing" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_warehouse_area_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "location_id" BIGINT;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "area" DECIMAL(18,2);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "max_load" DECIMAL(18,2);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "position_x" INTEGER;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "position_y" INTEGER;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "position_z" INTEGER;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "allow_item_mixing" BOOLEAN;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "allow_batch_mixing" BOOLEAN;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse_area" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_warehouse_area_tenant_id_idx" ON "mes_wm_warehouse_area"("tenant_id");

-- MES 库区
CREATE TABLE IF NOT EXISTS "mes_wm_warehouse_location" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "warehouse_id" BIGINT,
    "area" DECIMAL(18,2),
    "frozen" BOOLEAN,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mes_wm_warehouse_location_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "warehouse_id" BIGINT;
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "area" DECIMAL(18,2);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "frozen" BOOLEAN;
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "tenant_id" VARCHAR(64) NOT NULL;
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mes_wm_warehouse_location" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mes_wm_warehouse_location_tenant_id_idx" ON "mes_wm_warehouse_location"("tenant_id");
