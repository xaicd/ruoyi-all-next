-- CreateTable
CREATE TABLE "system_user" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "salt" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(50),
    "avatar" VARCHAR(500),
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "dept_id" TEXT,
    "remark" VARCHAR(500),
    "login_ip" VARCHAR(50),
    "login_date" TIMESTAMP(3),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "remark" VARCHAR(500),
    "data_scope" VARCHAR(20) NOT NULL DEFAULT 'ALL',
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_role" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "system_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_menu" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "permission" VARCHAR(100),
    "type" VARCHAR(10) NOT NULL,
    "parent_id" TEXT,
    "path" VARCHAR(200),
    "component" VARCHAR(200),
    "icon" VARCHAR(100),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "keep_alive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_menu" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,

    CONSTRAINT "system_role_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dept" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "parent_id" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "leader_id" TEXT,
    "phone" VARCHAR(20),
    "email" VARCHAR(50),
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_dept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_post" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "remark" VARCHAR(500),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_post" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "system_user_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dict_type" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_dict_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dict_data" (
    "id" TEXT NOT NULL,
    "dict_type_id" TEXT NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "color_type" VARCHAR(20),
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_dict_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_tenant" (
    "id" TEXT NOT NULL,
    "tenant_code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "contact_name" VARCHAR(30),
    "contact_phone" VARCHAR(20),
    "domain" VARCHAR(100),
    "package_id" TEXT,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "effective_at" TIMESTAMP(3) NOT NULL,
    "expire_time" TIMESTAMP(3),
    "account_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_tenant_subscription" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "effective_at" TIMESTAMP(3) NOT NULL,
    "expire_at" TIMESTAMP(3),
    "account_limit" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "change_type" VARCHAR(20) NOT NULL,
    "remark" VARCHAR(500),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_tenant_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_tenant_package" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "account_limit" INTEGER,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_tenant_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_tenant_package_menu" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,

    CONSTRAINT "system_tenant_package_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notice" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_area" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "parent_id" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notify_template" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "channel" VARCHAR(10) NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "params" TEXT NOT NULL DEFAULT '[]',
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_notify_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notify_message" (
    "id" TEXT NOT NULL,
    "template_code" VARCHAR(64) NOT NULL,
    "template_name" VARCHAR(100) NOT NULL,
    "channel" VARCHAR(10) NOT NULL,
    "receiver" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "read_status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_notify_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_login_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "username" VARCHAR(50) NOT NULL,
    "user_ip" VARCHAR(50) NOT NULL,
    "user_agent" VARCHAR(500),
    "result" VARCHAR(10) NOT NULL,
    "remark" VARCHAR(500),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_operate_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "module" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "request_method" VARCHAR(10) NOT NULL,
    "request_url" VARCHAR(500) NOT NULL,
    "content" TEXT,
    "result_code" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "user_ip" VARCHAR(50),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_operate_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(100),
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "key" VARCHAR(200) NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "approval_task" (
    "id" TEXT NOT NULL,
    "biz_type" VARCHAR(100) NOT NULL,
    "title" VARCHAR(500),
    "applicant_name" VARCHAR(100),
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "reviewed_at" TIMESTAMP(3),
    "review_remark" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_config" (
    "id" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL DEFAULT 'DEFAULT',
    "name" VARCHAR(100) NOT NULL,
    "config_key" VARCHAR(100) NOT NULL,
    "value" VARCHAR(500) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "infra_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_job" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "handler_name" VARCHAR(200) NOT NULL,
    "handler_param" VARCHAR(500),
    "cron_expression" VARCHAR(50) NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "retry_interval" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "infra_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_job_log" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "handler_name" VARCHAR(200) NOT NULL,
    "begin_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(10) NOT NULL,
    "result" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_job_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_api_access_log" (
    "id" TEXT NOT NULL,
    "trace_id" VARCHAR(64),
    "user_id" TEXT,
    "tenant_id" VARCHAR(64),
    "application_name" VARCHAR(50) NOT NULL,
    "request_method" VARCHAR(10) NOT NULL,
    "request_url" VARCHAR(500) NOT NULL,
    "request_params" TEXT,
    "response_body" TEXT,
    "result_code" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "user_ip" VARCHAR(50),
    "user_agent" VARCHAR(500),
    "operation" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_api_access_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_api_error_log" (
    "id" TEXT NOT NULL,
    "trace_id" VARCHAR(64),
    "user_id" TEXT,
    "tenant_id" VARCHAR(64),
    "application_name" VARCHAR(50) NOT NULL,
    "request_method" VARCHAR(10) NOT NULL,
    "request_url" VARCHAR(500) NOT NULL,
    "request_params" TEXT,
    "exception_name" VARCHAR(200) NOT NULL,
    "exception_message" TEXT NOT NULL,
    "exception_stack" TEXT,
    "error_code" VARCHAR(64),
    "root_cause" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'UNPROCESSED',
    "processed_at" TIMESTAMP(3),
    "processed_by" TEXT,
    "process_note" VARCHAR(500),
    "user_ip" VARCHAR(50),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_api_error_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_file_config" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "storage" VARCHAR(20) NOT NULL,
    "config" TEXT NOT NULL,
    "master" BOOLEAN NOT NULL DEFAULT false,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "infra_file_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_data_source_config" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "driver" VARCHAR(30) NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "encrypted_password" VARCHAR(2048) NOT NULL,
    "remark" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "infra_data_source_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_file" (
    "id" TEXT NOT NULL,
    "config_id" TEXT NOT NULL,
    "name" VARCHAR(200),
    "path" VARCHAR(500) NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "type" VARCHAR(100),
    "size" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_message_outbox" (
    "id" TEXT NOT NULL,
    "event_id" VARCHAR(64) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "type" VARCHAR(120) NOT NULL,
    "source" VARCHAR(64) NOT NULL,
    "payload" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "tenant_id" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "infra_message_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_message_inbox" (
    "id" TEXT NOT NULL,
    "consumer" VARCHAR(120) NOT NULL,
    "event_id" VARCHAR(64) NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infra_message_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_definition" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "model_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "current_draft_revision_id" TEXT,
    "published_release_id" TEXT,
    "lock_version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_revision" (
    "id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "schema_revision" INTEGER NOT NULL DEFAULT 0,
    "model_json" JSONB NOT NULL DEFAULT '{}',
    "interaction_json" JSONB NOT NULL DEFAULT '{}',
    "policy_json" JSONB NOT NULL DEFAULT '{}',
    "workflow_json" JSONB NOT NULL DEFAULT '{}',
    "validation_report" JSONB,
    "created_by" TEXT NOT NULL,
    "published_by" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_field" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "field_type" VARCHAR(30) NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "length" INTEGER,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_index" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "fields_json" JSONB NOT NULL,
    "unique" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_relation" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "relation_type" VARCHAR(30) NOT NULL,
    "target_definition_code" VARCHAR(64),
    "target_release_id" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_view" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "kind" VARCHAR(30) NOT NULL,
    "puck_data_json" JSONB,
    "component_config_json" JSONB NOT NULL DEFAULT '{}',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_action" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "action_type" VARCHAR(30) NOT NULL,
    "handler_key" VARCHAR(100),
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_policy" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "policy_type" VARCHAR(30) NOT NULL,
    "subject_config" JSONB NOT NULL DEFAULT '{}',
    "rule_config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_workflow_binding" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "process_key" VARCHAR(100) NOT NULL,
    "status_field" VARCHAR(64) NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_workflow_binding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_release" (
    "id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "release_no" INTEGER NOT NULL,
    "snapshot_json" JSONB NOT NULL,
    "schema_revision" INTEGER NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "released_by" TEXT NOT NULL,
    "released_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rollback_of_release_id" TEXT,

    CONSTRAINT "online_release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_managed_table" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "physical_table_name" VARCHAR(64) NOT NULL,
    "schema_revision" INTEGER NOT NULL DEFAULT 0,
    "model_fingerprint" VARCHAR(64) NOT NULL,
    "last_plan_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_managed_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_schema_change" (
    "id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "plan_json" JSONB NOT NULL,
    "risk" VARCHAR(20) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "approval" JSONB,
    "execution_log" JSONB,
    "expected_schema_revision" INTEGER NOT NULL,
    "applied_schema_revision" INTEGER,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "online_schema_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_test_session" (
    "id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "release_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "schema_revision" INTEGER NOT NULL,
    "environment" VARCHAR(30) NOT NULL,
    "sandbox" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "online_test_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_record" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "definition_id" TEXT NOT NULL,
    "release_id" TEXT NOT NULL,
    "test_session_id" TEXT NOT NULL,
    "schema_revision" INTEGER NOT NULL,
    "data_json" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "online_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_channel" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "base_url" VARCHAR(500),
    "api_key" VARCHAR(500),
    "models" JSONB NOT NULL DEFAULT '[]',
    "model_map" JSONB NOT NULL DEFAULT '{}',
    "weight" INTEGER NOT NULL DEFAULT 100,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "auto_disable" BOOLEAN NOT NULL DEFAULT true,
    "fail_count" INTEGER NOT NULL DEFAULT 0,
    "protocol" VARCHAR(20) NOT NULL DEFAULT 'openai',
    "tenant_id" TEXT,
    "created_by" VARCHAR(64),
    "updated_by" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_access_token" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "remain_quota" BIGINT NOT NULL DEFAULT 500000,
    "unlimited" BOOLEAN NOT NULL DEFAULT false,
    "models" JSONB NOT NULL DEFAULT '[]',
    "ip_allowlist" JSONB NOT NULL DEFAULT '[]',
    "group" VARCHAR(50) NOT NULL DEFAULT 'default',
    "expires_at" TIMESTAMP(3),
    "tenant_id" TEXT,
    "created_by" VARCHAR(64),
    "updated_by" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_access_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" TEXT NOT NULL,
    "token_id" TEXT,
    "channel_id" TEXT,
    "model" VARCHAR(100) NOT NULL,
    "prompt_tokens" INTEGER NOT NULL DEFAULT 0,
    "completion_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "latency_ms" INTEGER NOT NULL DEFAULT 0,
    "error" VARCHAR(500),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "model_key" VARCHAR(100) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "input_ratio" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "output_ratio" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(500),
    "tenant_id" TEXT,
    "created_by" VARCHAR(64),
    "updated_by" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_conversation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "system_prompt" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "tenant_id" TEXT,
    "created_by" VARCHAR(64),
    "updated_by" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_chat_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_message" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_username_key" ON "system_user"("username");

-- CreateIndex
CREATE INDEX "system_user_tenant_id_idx" ON "system_user"("tenant_id");

-- CreateIndex
CREATE INDEX "system_user_dept_id_idx" ON "system_user"("dept_id");

-- CreateIndex
CREATE INDEX "system_user_status_idx" ON "system_user"("status");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_code_key" ON "system_role"("code");

-- CreateIndex
CREATE INDEX "system_role_tenant_id_idx" ON "system_role"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_role_user_id_role_id_key" ON "system_user_role"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "system_menu_parent_id_idx" ON "system_menu"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_menu_role_id_menu_id_key" ON "system_role_menu"("role_id", "menu_id");

-- CreateIndex
CREATE INDEX "system_dept_parent_id_idx" ON "system_dept"("parent_id");

-- CreateIndex
CREATE INDEX "system_dept_tenant_id_idx" ON "system_dept"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_post_code_key" ON "system_post"("code");

-- CreateIndex
CREATE INDEX "system_post_tenant_id_idx" ON "system_post"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_post_user_id_post_id_key" ON "system_user_post"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_dict_type_type_key" ON "system_dict_type"("type");

-- CreateIndex
CREATE INDEX "system_dict_data_dict_type_id_idx" ON "system_dict_data"("dict_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_tenant_tenant_code_key" ON "system_tenant"("tenant_code");

-- CreateIndex
CREATE INDEX "system_tenant_package_id_idx" ON "system_tenant"("package_id");

-- CreateIndex
CREATE INDEX "system_tenant_subscription_tenant_id_created_at_idx" ON "system_tenant_subscription"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "system_tenant_subscription_status_idx" ON "system_tenant_subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "system_tenant_package_name_key" ON "system_tenant_package"("name");

-- CreateIndex
CREATE INDEX "system_tenant_package_status_idx" ON "system_tenant_package"("status");

-- CreateIndex
CREATE INDEX "system_tenant_package_menu_menu_id_idx" ON "system_tenant_package_menu"("menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_tenant_package_menu_package_id_menu_id_key" ON "system_tenant_package_menu"("package_id", "menu_id");

-- CreateIndex
CREATE INDEX "system_area_parent_id_idx" ON "system_area"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_notify_template_code_key" ON "system_notify_template"("code");

-- CreateIndex
CREATE INDEX "system_notify_message_template_code_idx" ON "system_notify_message"("template_code");

-- CreateIndex
CREATE INDEX "system_login_log_user_id_idx" ON "system_login_log"("user_id");

-- CreateIndex
CREATE INDEX "system_login_log_created_at_idx" ON "system_login_log"("created_at");

-- CreateIndex
CREATE INDEX "system_operate_log_user_id_idx" ON "system_operate_log"("user_id");

-- CreateIndex
CREATE INDEX "system_operate_log_module_idx" ON "system_operate_log"("module");

-- CreateIndex
CREATE INDEX "system_operate_log_created_at_idx" ON "system_operate_log"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_phone_key" ON "admin"("phone");

-- CreateIndex
CREATE INDEX "approval_task_biz_type_idx" ON "approval_task"("biz_type");

-- CreateIndex
CREATE INDEX "approval_task_status_idx" ON "approval_task"("status");

-- CreateIndex
CREATE INDEX "approval_task_created_at_idx" ON "approval_task"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "infra_config_config_key_key" ON "infra_config"("config_key");

-- CreateIndex
CREATE INDEX "infra_job_log_job_id_idx" ON "infra_job_log"("job_id");

-- CreateIndex
CREATE INDEX "infra_job_log_created_at_idx" ON "infra_job_log"("created_at");

-- CreateIndex
CREATE INDEX "infra_api_access_log_user_id_idx" ON "infra_api_access_log"("user_id");

-- CreateIndex
CREATE INDEX "infra_api_access_log_trace_id_idx" ON "infra_api_access_log"("trace_id");

-- CreateIndex
CREATE INDEX "infra_api_access_log_tenant_id_created_at_idx" ON "infra_api_access_log"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "infra_api_access_log_created_at_idx" ON "infra_api_access_log"("created_at");

-- CreateIndex
CREATE INDEX "infra_api_error_log_user_id_idx" ON "infra_api_error_log"("user_id");

-- CreateIndex
CREATE INDEX "infra_api_error_log_trace_id_idx" ON "infra_api_error_log"("trace_id");

-- CreateIndex
CREATE INDEX "infra_api_error_log_tenant_id_created_at_idx" ON "infra_api_error_log"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "infra_api_error_log_status_idx" ON "infra_api_error_log"("status");

-- CreateIndex
CREATE INDEX "infra_api_error_log_created_at_idx" ON "infra_api_error_log"("created_at");

-- CreateIndex
CREATE INDEX "infra_data_source_config_name_idx" ON "infra_data_source_config"("name");

-- CreateIndex
CREATE INDEX "infra_data_source_config_deleted_idx" ON "infra_data_source_config"("deleted");

-- CreateIndex
CREATE INDEX "infra_data_source_config_tenant_id_deleted_updated_at_idx" ON "infra_data_source_config"("tenant_id", "deleted", "updated_at");

-- CreateIndex
CREATE INDEX "infra_file_config_id_idx" ON "infra_file"("config_id");

-- CreateIndex
CREATE UNIQUE INDEX "infra_message_outbox_event_id_key" ON "infra_message_outbox"("event_id");

-- CreateIndex
CREATE INDEX "infra_message_outbox_status_created_at_idx" ON "infra_message_outbox"("status", "created_at");

-- CreateIndex
CREATE INDEX "infra_message_outbox_tenant_id_status_idx" ON "infra_message_outbox"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "infra_message_inbox_consumer_event_id_key" ON "infra_message_inbox"("consumer", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "online_definition_current_draft_revision_id_key" ON "online_definition"("current_draft_revision_id");

-- CreateIndex
CREATE UNIQUE INDEX "online_definition_published_release_id_key" ON "online_definition"("published_release_id");

-- CreateIndex
CREATE INDEX "online_definition_tenant_id_status_updated_at_idx" ON "online_definition"("tenant_id", "status", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "online_definition_tenant_id_code_key" ON "online_definition"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "online_revision_tenant_id_definition_id_status_idx" ON "online_revision"("tenant_id", "definition_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "online_revision_tenant_id_definition_id_sequence_key" ON "online_revision"("tenant_id", "definition_id", "sequence");

-- CreateIndex
CREATE INDEX "online_field_tenant_id_revision_id_sort_idx" ON "online_field"("tenant_id", "revision_id", "sort");

-- CreateIndex
CREATE UNIQUE INDEX "online_field_tenant_id_revision_id_code_key" ON "online_field"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "online_index_tenant_id_revision_id_code_key" ON "online_index"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE INDEX "online_relation_tenant_id_target_release_id_idx" ON "online_relation"("tenant_id", "target_release_id");

-- CreateIndex
CREATE UNIQUE INDEX "online_relation_tenant_id_revision_id_code_key" ON "online_relation"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "online_view_tenant_id_revision_id_code_key" ON "online_view"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "online_action_tenant_id_revision_id_code_key" ON "online_action"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "online_policy_tenant_id_revision_id_code_key" ON "online_policy"("tenant_id", "revision_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "online_workflow_binding_tenant_id_revision_id_process_key_key" ON "online_workflow_binding"("tenant_id", "revision_id", "process_key");

-- CreateIndex
CREATE INDEX "online_release_tenant_id_definition_id_released_at_idx" ON "online_release"("tenant_id", "definition_id", "released_at");

-- CreateIndex
CREATE UNIQUE INDEX "online_release_tenant_id_definition_id_release_no_key" ON "online_release"("tenant_id", "definition_id", "release_no");

-- CreateIndex
CREATE UNIQUE INDEX "online_managed_table_definition_id_key" ON "online_managed_table"("definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "online_managed_table_physical_table_name_key" ON "online_managed_table"("physical_table_name");

-- CreateIndex
CREATE INDEX "online_managed_table_tenant_id_physical_table_name_idx" ON "online_managed_table"("tenant_id", "physical_table_name");

-- CreateIndex
CREATE INDEX "online_schema_change_tenant_id_definition_id_status_idx" ON "online_schema_change"("tenant_id", "definition_id", "status");

-- CreateIndex
CREATE INDEX "online_test_session_tenant_id_definition_id_started_at_idx" ON "online_test_session"("tenant_id", "definition_id", "started_at");

-- CreateIndex
CREATE INDEX "online_record_tenant_id_definition_id_release_id_updated_at_idx" ON "online_record"("tenant_id", "definition_id", "release_id", "updated_at");

-- CreateIndex
CREATE INDEX "online_record_tenant_id_test_session_id_updated_at_idx" ON "online_record"("tenant_id", "test_session_id", "updated_at");

-- CreateIndex
CREATE INDEX "ai_channel_tenant_id_idx" ON "ai_channel"("tenant_id");

-- CreateIndex
CREATE INDEX "ai_channel_status_priority_idx" ON "ai_channel"("status", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "ai_access_token_key_key" ON "ai_access_token"("key");

-- CreateIndex
CREATE INDEX "ai_access_token_tenant_id_idx" ON "ai_access_token"("tenant_id");

-- CreateIndex
CREATE INDEX "ai_access_token_key_idx" ON "ai_access_token"("key");

-- CreateIndex
CREATE INDEX "ai_usage_tenant_id_created_at_idx" ON "ai_usage"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_usage_token_id_idx" ON "ai_usage"("token_id");

-- CreateIndex
CREATE INDEX "ai_usage_channel_id_idx" ON "ai_usage"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_model_model_key_key" ON "ai_model"("model_key");

-- CreateIndex
CREATE INDEX "ai_model_tenant_id_idx" ON "ai_model"("tenant_id");

-- CreateIndex
CREATE INDEX "ai_model_status_idx" ON "ai_model"("status");

-- CreateIndex
CREATE INDEX "ai_chat_conversation_tenant_id_user_id_idx" ON "ai_chat_conversation"("tenant_id", "user_id");

-- CreateIndex
CREATE INDEX "ai_chat_message_conversation_id_created_at_idx" ON "ai_chat_message"("conversation_id", "created_at");

-- AddForeignKey
ALTER TABLE "system_user" ADD CONSTRAINT "system_user_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "system_dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_menu" ADD CONSTRAINT "system_menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_menu" ADD CONSTRAINT "system_role_menu_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_menu" ADD CONSTRAINT "system_role_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "system_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dept" ADD CONSTRAINT "system_dept_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_post" ADD CONSTRAINT "system_user_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_post" ADD CONSTRAINT "system_user_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "system_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dict_data" ADD CONSTRAINT "system_dict_data_dict_type_id_fkey" FOREIGN KEY ("dict_type_id") REFERENCES "system_dict_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_tenant" ADD CONSTRAINT "system_tenant_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_tenant_subscription" ADD CONSTRAINT "system_tenant_subscription_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_tenant_subscription" ADD CONSTRAINT "system_tenant_subscription_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_tenant_package_menu" ADD CONSTRAINT "system_tenant_package_menu_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_tenant_package_menu" ADD CONSTRAINT "system_tenant_package_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "system_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infra_job_log" ADD CONSTRAINT "infra_job_log_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "infra_job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infra_data_source_config" ADD CONSTRAINT "infra_data_source_config_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_current_draft_revision_id_fkey" FOREIGN KEY ("current_draft_revision_id") REFERENCES "online_revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_published_release_id_fkey" FOREIGN KEY ("published_release_id") REFERENCES "online_release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_revision" ADD CONSTRAINT "online_revision_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_revision" ADD CONSTRAINT "online_revision_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_field" ADD CONSTRAINT "online_field_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_field" ADD CONSTRAINT "online_field_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_index" ADD CONSTRAINT "online_index_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_index" ADD CONSTRAINT "online_index_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_relation" ADD CONSTRAINT "online_relation_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_relation" ADD CONSTRAINT "online_relation_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_relation" ADD CONSTRAINT "online_relation_target_release_id_fkey" FOREIGN KEY ("target_release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_view" ADD CONSTRAINT "online_view_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_view" ADD CONSTRAINT "online_view_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_action" ADD CONSTRAINT "online_action_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_action" ADD CONSTRAINT "online_action_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_policy" ADD CONSTRAINT "online_policy_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_policy" ADD CONSTRAINT "online_policy_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_workflow_binding" ADD CONSTRAINT "online_workflow_binding_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_workflow_binding" ADD CONSTRAINT "online_workflow_binding_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_rollback_of_release_id_fkey" FOREIGN KEY ("rollback_of_release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_managed_table" ADD CONSTRAINT "online_managed_table_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_managed_table" ADD CONSTRAINT "online_managed_table_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_record" ADD CONSTRAINT "online_record_test_session_id_fkey" FOREIGN KEY ("test_session_id") REFERENCES "online_test_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "ai_access_token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "ai_channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_message" ADD CONSTRAINT "ai_chat_message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "ai_chat_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

