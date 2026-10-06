-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/bpm-source-tables.ts#BPM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- BPM 流程分类
CREATE TABLE IF NOT EXISTS "bpm_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "sort" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_category_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_category" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_category" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_category_tenant_id_idx" ON "bpm_category"("tenant_id");

-- BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景
CREATE TABLE IF NOT EXISTS "bpm_form" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "conf" VARCHAR(255),
    "fields" TEXT,
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_form_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "conf" VARCHAR(255);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "fields" TEXT;
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_form" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_form" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_form_tenant_id_idx" ON "bpm_form"("tenant_id");

-- OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 
CREATE TABLE IF NOT EXISTS "bpm_oa_leave" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "type" INTEGER,
    "reason" VARCHAR(255),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "day" BIGINT,
    "status" INTEGER,
    "process_instance_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_oa_leave_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "bpm_oa_leave" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "reason" VARCHAR(255);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "day" BIGINT;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "process_instance_id" TEXT;
ALTER TABLE "bpm_oa_leave" ALTER COLUMN "process_instance_id" TYPE TEXT USING "process_instance_id"::TEXT;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_oa_leave" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_oa_leave" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_oa_leave_tenant_id_idx" ON "bpm_oa_leave"("tenant_id");

-- BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表
CREATE TABLE IF NOT EXISTS "bpm_process_definition_info" (
    "id" TEXT NOT NULL,
    "process_definition_id" TEXT,
    "model_id" TEXT,
    "model_type" INTEGER,
    "category" VARCHAR(255),
    "icon" VARCHAR(255),
    "description" VARCHAR(255),
    "form_type" INTEGER,
    "form_id" TEXT,
    "form_conf" VARCHAR(255),
    "form_fields" TEXT,
    "form_custom_create_path" VARCHAR(255),
    "form_custom_view_path" VARCHAR(255),
    "simple_model" VARCHAR(255),
    "visible" BOOLEAN,
    "sort" BIGINT,
    "start_user_ids" TEXT,
    "start_dept_ids" TEXT,
    "manager_user_ids" TEXT,
    "allow_cancel_running_process" BOOLEAN,
    "allow_withdraw_task" BOOLEAN,
    "process_id_rule" VARCHAR(255),
    "auto_approval_type" INTEGER,
    "title_setting" VARCHAR(255),
    "summary_setting" VARCHAR(255),
    "process_before_trigger_setting" VARCHAR(255),
    "process_after_trigger_setting" VARCHAR(255),
    "task_before_trigger_setting" VARCHAR(255),
    "task_after_trigger_setting" VARCHAR(255),
    "print_template_setting" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_definition_info_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "process_definition_id" TEXT;
ALTER TABLE "bpm_process_definition_info" ALTER COLUMN "process_definition_id" TYPE TEXT USING "process_definition_id"::TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "model_id" TEXT;
ALTER TABLE "bpm_process_definition_info" ALTER COLUMN "model_id" TYPE TEXT USING "model_id"::TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "model_type" INTEGER;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "category" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "icon" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_type" INTEGER;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_id" TEXT;
ALTER TABLE "bpm_process_definition_info" ALTER COLUMN "form_id" TYPE TEXT USING "form_id"::TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_conf" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_fields" TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_custom_create_path" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "form_custom_view_path" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "simple_model" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "visible" BOOLEAN;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "sort" BIGINT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "start_user_ids" TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "start_dept_ids" TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "manager_user_ids" TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "allow_cancel_running_process" BOOLEAN;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "allow_withdraw_task" BOOLEAN;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "process_id_rule" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "auto_approval_type" INTEGER;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "title_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "summary_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "process_before_trigger_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "process_after_trigger_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "task_before_trigger_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "task_after_trigger_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "print_template_setting" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_process_definition_info" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_definition_info" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_process_definition_info_tenant_id_idx" ON "bpm_process_definition_info"("tenant_id");

-- BPM 流程表达式
CREATE TABLE IF NOT EXISTS "bpm_process_expression" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "expression" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_expression_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "expression" VARCHAR(255);
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_process_expression" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_expression" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_process_expression_tenant_id_idx" ON "bpm_process_expression"("tenant_id");

-- 流程抄送
CREATE TABLE IF NOT EXISTS "bpm_process_instance_copy" (
    "id" TEXT NOT NULL,
    "start_user_id" TEXT,
    "process_instance_name" VARCHAR(255),
    "process_instance_id" TEXT,
    "process_definition_id" TEXT,
    "category" VARCHAR(255),
    "activity_id" TEXT,
    "activity_name" VARCHAR(255),
    "task_id" TEXT,
    "user_id" TEXT,
    "reason" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_instance_copy_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "start_user_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "start_user_id" TYPE TEXT USING "start_user_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "process_instance_name" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "process_instance_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "process_instance_id" TYPE TEXT USING "process_instance_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "process_definition_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "process_definition_id" TYPE TEXT USING "process_definition_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "category" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "activity_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "activity_id" TYPE TEXT USING "activity_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "activity_name" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "task_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "task_id" TYPE TEXT USING "task_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "reason" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_process_instance_copy" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_instance_copy" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_process_instance_copy_tenant_id_idx" ON "bpm_process_instance_copy"("tenant_id");

-- BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计
CREATE TABLE IF NOT EXISTS "bpm_process_listener" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "type" VARCHAR(255),
    "event" VARCHAR(255),
    "value_type" VARCHAR(255),
    "value" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_listener_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "event" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "value_type" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "value" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_process_listener" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_process_listener" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_process_listener_tenant_id_idx" ON "bpm_process_listener"("tenant_id");

-- BPM 用户组
CREATE TABLE IF NOT EXISTS "bpm_user_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "user_ids" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_user_group_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "user_ids" TEXT;
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "bpm_user_group" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "bpm_user_group" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bpm_user_group_tenant_id_idx" ON "bpm_user_group"("tenant_id");
