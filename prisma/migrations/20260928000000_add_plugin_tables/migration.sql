-- §6.2 可安装插件系统的持久化（Paperclip PLUGIN_SPEC §21.3 子集）。
--
-- 设计要点：插件数据**不开自有表**，统一落 plugin_state 的 scoped KV。
-- 依据 §21.1（插件数据先落通用扩展表，且先 scope 到既有对象、再考虑新表）
-- 与 §21.5（首个插件系统不允许任意第三方迁移；namespace 迁移仅对受信任编排插件
-- 开放且由宿主派生）。
--
-- 与 spec 的一处刻意偏差：config 的租户列用 tenant_id 而非 company_id（本仓术语），
-- 且按 AGENTS.md §4.8 租户必须取自全局上下文，禁止调用方显式透传。

CREATE TABLE "plugin" (
  "id" TEXT PRIMARY KEY,
  "plugin_key" VARCHAR(128) NOT NULL,
  "package_name" VARCHAR(200) NOT NULL,
  "package_path" VARCHAR(500),
  "version" VARCHAR(50) NOT NULL,
  "api_version" INTEGER NOT NULL,
  "categories" TEXT[] NOT NULL,
  "manifest_json" JSONB NOT NULL,
  -- installed | ready | error | upgrade_pending（§21.3）
  "status" VARCHAR(20) NOT NULL DEFAULT 'installed',
  "install_order" INTEGER,
  "last_error" VARCHAR(1000),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted" BOOLEAN NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX "plugin_plugin_key_key" ON "plugin" ("plugin_key");
CREATE INDEX "plugin_status_idx" ON "plugin" ("status");

CREATE TABLE "plugin_state" (
  "id" TEXT PRIMARY KEY,
  "plugin_id" TEXT NOT NULL,
  -- instance | tenant | project | agent | issue | run（§21.3）
  "scope_kind" VARCHAR(30) NOT NULL,
  -- instance 作用域用空串而非 NULL：PG 唯一索引视 NULL 互不相等，
  -- 用 NULL 会让 instance 作用域静默失去唯一性保证。
  "scope_id" VARCHAR(128) NOT NULL DEFAULT '',
  "namespace" VARCHAR(100) NOT NULL DEFAULT 'default',
  "state_key" VARCHAR(200) NOT NULL,
  "value_json" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "plugin_state_plugin_id_fkey" FOREIGN KEY ("plugin_id")
    REFERENCES "plugin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "plugin_state_scope_key"
  ON "plugin_state" ("plugin_id", "scope_kind", "scope_id", "namespace", "state_key");

CREATE TABLE "plugin_config" (
  "id" TEXT PRIMARY KEY,
  "plugin_id" TEXT NOT NULL,
  "tenant_id" VARCHAR(64) NOT NULL,
  "config_json" JSONB NOT NULL,
  "last_error" VARCHAR(1000),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "plugin_config_plugin_id_fkey" FOREIGN KEY ("plugin_id")
    REFERENCES "plugin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "plugin_config_plugin_tenant_key" ON "plugin_config" ("plugin_id", "tenant_id");
