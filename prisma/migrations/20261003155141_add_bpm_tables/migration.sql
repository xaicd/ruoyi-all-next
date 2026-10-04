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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_category_tenant_id_idx" ON "bpm_category"("tenant_id");

-- BPM 工作流的表单定义用于工作流的申请表单，需要动态配置的场景
CREATE TABLE IF NOT EXISTS "bpm_form" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "conf" VARCHAR(255),
    "fields" TEXT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_form_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_form_tenant_id_idx" ON "bpm_form"("tenant_id");

-- OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天
CREATE TABLE IF NOT EXISTS "bpm_oa_leave" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "type" INTEGER,
    "reason" VARCHAR(255),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "day" BIGINT,
    "status" INTEGER,
    "process_instance_id" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_oa_leave_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_oa_leave_tenant_id_idx" ON "bpm_oa_leave"("tenant_id");

-- BPM 流程定义的拓信息主要解决 Flowable 不支持拓展字段，所以新建该表
CREATE TABLE IF NOT EXISTS "bpm_process_definition_info" (
    "id" TEXT NOT NULL,
    "process_definition_id" VARCHAR(255),
    "model_id" VARCHAR(255),
    "model_type" INTEGER,
    "category" VARCHAR(255),
    "icon" VARCHAR(255),
    "description" VARCHAR(255),
    "form_type" INTEGER,
    "form_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_definition_info_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_process_definition_info_tenant_id_idx" ON "bpm_process_definition_info"("tenant_id");

-- BPM 流程表达式
CREATE TABLE IF NOT EXISTS "bpm_process_expression" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "expression" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_expression_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_process_expression_tenant_id_idx" ON "bpm_process_expression"("tenant_id");

-- 流程抄送
CREATE TABLE IF NOT EXISTS "bpm_process_instance_copy" (
    "id" TEXT NOT NULL,
    "start_user_id" BIGINT,
    "process_instance_name" VARCHAR(255),
    "process_instance_id" VARCHAR(255),
    "process_definition_id" VARCHAR(255),
    "category" VARCHAR(255),
    "activity_id" VARCHAR(255),
    "activity_name" VARCHAR(255),
    "task_id" VARCHAR(255),
    "user_id" BIGINT,
    "reason" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_instance_copy_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_process_instance_copy_tenant_id_idx" ON "bpm_process_instance_copy"("tenant_id");

-- BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计时，直接选择这些模版
CREATE TABLE IF NOT EXISTS "bpm_process_listener" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "type" VARCHAR(255),
    "event" VARCHAR(255),
    "value_type" VARCHAR(255),
    "value" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_process_listener_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_process_listener_tenant_id_idx" ON "bpm_process_listener"("tenant_id");

-- BPM 用户组
CREATE TABLE IF NOT EXISTS "bpm_user_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "user_ids" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bpm_user_group_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "bpm_user_group_tenant_id_idx" ON "bpm_user_group"("tenant_id");
