CREATE TABLE "online_definition" (
  "id" TEXT PRIMARY KEY, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL, "name" VARCHAR(100) NOT NULL,
  "model_type" VARCHAR(20) NOT NULL, "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  "current_draft_revision_id" TEXT UNIQUE, "published_release_id" TEXT UNIQUE, "lock_version" INTEGER NOT NULL DEFAULT 1,
  "created_by" TEXT NOT NULL, "updated_by" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "code")
);
CREATE TABLE "online_revision" (
  "id" TEXT PRIMARY KEY, "definition_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "sequence" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT', "schema_revision" INTEGER NOT NULL DEFAULT 0,
  "model_json" JSONB NOT NULL DEFAULT '{}', "interaction_json" JSONB NOT NULL DEFAULT '{}', "policy_json" JSONB NOT NULL DEFAULT '{}',
  "workflow_json" JSONB NOT NULL DEFAULT '{}', "validation_report" JSONB, "created_by" TEXT NOT NULL,
  "published_by" TEXT, "published_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, UNIQUE ("tenant_id", "definition_id", "sequence")
);
CREATE TABLE "online_field" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "label" VARCHAR(100) NOT NULL, "field_type" VARCHAR(30) NOT NULL, "required" BOOLEAN NOT NULL DEFAULT false,
  "length" INTEGER, "sort" INTEGER NOT NULL DEFAULT 0, "default_value" TEXT, "config" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_index" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "fields_json" JSONB NOT NULL, "unique" BOOLEAN NOT NULL DEFAULT false, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false, UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_relation" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "relation_type" VARCHAR(30) NOT NULL, "target_definition_code" VARCHAR(64), "config" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_view" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "kind" VARCHAR(30) NOT NULL, "puck_data_json" JSONB, "component_config_json" JSONB NOT NULL DEFAULT '{}', "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_action" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "action_type" VARCHAR(30) NOT NULL, "handler_key" VARCHAR(100), "config" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_policy" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "code" VARCHAR(64) NOT NULL,
  "policy_type" VARCHAR(30) NOT NULL, "subject_config" JSONB NOT NULL DEFAULT '{}', "rule_config" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "code")
);
CREATE TABLE "online_workflow_binding" (
  "id" TEXT PRIMARY KEY, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL, "provider" VARCHAR(50) NOT NULL,
  "process_key" VARCHAR(100) NOT NULL, "status_field" VARCHAR(64) NOT NULL, "config" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE ("tenant_id", "revision_id", "process_key")
);
CREATE TABLE "online_release" (
  "id" TEXT PRIMARY KEY, "definition_id" TEXT NOT NULL, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL,
  "release_no" INTEGER NOT NULL, "snapshot_json" JSONB NOT NULL, "schema_revision" INTEGER NOT NULL, "checksum" VARCHAR(64) NOT NULL,
  "released_by" TEXT NOT NULL, "released_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "rollback_of_release_id" TEXT,
  UNIQUE ("tenant_id", "definition_id", "release_no")
);
CREATE TABLE "online_schema_change" (
  "id" TEXT PRIMARY KEY, "definition_id" TEXT NOT NULL, "revision_id" TEXT NOT NULL, "tenant_id" TEXT NOT NULL,
  "plan_json" JSONB NOT NULL, "risk" VARCHAR(20) NOT NULL, "status" VARCHAR(30) NOT NULL, "approval" JSONB,
  "execution_log" JSONB, "expected_schema_revision" INTEGER NOT NULL, "applied_schema_revision" INTEGER,
  "created_by" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "online_test_session" (
  "id" TEXT PRIMARY KEY, "definition_id" TEXT NOT NULL, "revision_id" TEXT NOT NULL, "release_id" TEXT,
  "tenant_id" TEXT NOT NULL, "actor_id" TEXT NOT NULL, "schema_revision" INTEGER NOT NULL, "environment" VARCHAR(30) NOT NULL,
  "sandbox" BOOLEAN NOT NULL DEFAULT true, "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "ended_at" TIMESTAMP(3)
);
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_revision" ADD CONSTRAINT "online_revision_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_revision" ADD CONSTRAINT "online_revision_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_current_draft_revision_id_fkey" FOREIGN KEY ("current_draft_revision_id") REFERENCES "online_revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_definition" ADD CONSTRAINT "online_definition_published_release_id_fkey" FOREIGN KEY ("published_release_id") REFERENCES "online_release"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "online_release" ADD CONSTRAINT "online_release_rollback_of_release_id_fkey" FOREIGN KEY ("rollback_of_release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_field" ADD CONSTRAINT "online_field_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_index" ADD CONSTRAINT "online_index_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_relation" ADD CONSTRAINT "online_relation_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_view" ADD CONSTRAINT "online_view_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_action" ADD CONSTRAINT "online_action_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_policy" ADD CONSTRAINT "online_policy_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_workflow_binding" ADD CONSTRAINT "online_workflow_binding_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "online_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "online_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_release_id_fkey" FOREIGN KEY ("release_id") REFERENCES "online_release"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "online_definition_tenant_id_status_updated_at_idx" ON "online_definition"("tenant_id", "status", "updated_at");
CREATE INDEX "online_revision_tenant_id_definition_id_status_idx" ON "online_revision"("tenant_id", "definition_id", "status");
CREATE INDEX "online_field_tenant_id_revision_id_sort_idx" ON "online_field"("tenant_id", "revision_id", "sort");
CREATE INDEX "online_release_tenant_id_definition_id_released_at_idx" ON "online_release"("tenant_id", "definition_id", "released_at");
CREATE INDEX "online_schema_change_tenant_id_definition_id_status_idx" ON "online_schema_change"("tenant_id", "definition_id", "status");
CREATE INDEX "online_test_session_tenant_id_definition_id_started_at_idx" ON "online_test_session"("tenant_id", "definition_id", "started_at");
ALTER TABLE "online_field" ADD CONSTRAINT "online_field_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_index" ADD CONSTRAINT "online_index_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_relation" ADD CONSTRAINT "online_relation_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_view" ADD CONSTRAINT "online_view_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_action" ADD CONSTRAINT "online_action_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_policy" ADD CONSTRAINT "online_policy_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_workflow_binding" ADD CONSTRAINT "online_workflow_binding_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_schema_change" ADD CONSTRAINT "online_schema_change_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "online_test_session" ADD CONSTRAINT "online_test_session_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
