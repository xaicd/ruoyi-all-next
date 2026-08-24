-- ============================================================
-- 1. 应算通 (Yingsuan) 核心业务数据表
-- ============================================================

-- 1.1 企业租户主体表
CREATE TABLE IF NOT EXISTS "ys_enterprise_account" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "code" VARCHAR(64) NOT NULL,
  "credit_code" VARCHAR(50),
  "province" VARCHAR(50) DEFAULT '广东',
  "city" VARCHAR(50) DEFAULT '广州',
  "industry" VARCHAR(50) DEFAULT '互联网/软件',
  "contact_name" VARCHAR(50),
  "contact_phone" VARCHAR(20),
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_enterprise_tenant" ON "ys_enterprise_account" ("tenant_id");
CREATE INDEX IF NOT EXISTS "idx_ys_enterprise_code" ON "ys_enterprise_account" ("code");

-- 1.2 原厂坐席与应用绑定表
CREATE TABLE IF NOT EXISTS "ys_seat" (
  "id" VARCHAR(64) PRIMARY KEY,
  "enterprise_id" VARCHAR(64) NOT NULL,
  "user_id" VARCHAR(64),
  "user_name" VARCHAR(64) NOT NULL,
  "user_email" VARCHAR(100),
  "app_type" VARCHAR(30) NOT NULL, -- WORKBUDDY | QODER | TRAE
  "vendor_seat_id" VARCHAR(100),
  "monthly_token_cap" BIGINT DEFAULT 10000000,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_seat_tenant_ent" ON "ys_seat" ("tenant_id", "enterprise_id");

-- 1.3 企业额度账户表
CREATE TABLE IF NOT EXISTS "ys_quota_account" (
  "id" VARCHAR(64) PRIMARY KEY,
  "enterprise_id" VARCHAR(64) NOT NULL UNIQUE,
  "total_quota" BIGINT DEFAULT 100000000,
  "used_quota" BIGINT DEFAULT 0,
  "frozen_quota" BIGINT DEFAULT 0,
  "warn_threshold" INTEGER DEFAULT 80,
  "auto_throttle" BOOLEAN DEFAULT true,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_quota_tenant" ON "ys_quota_account" ("tenant_id");

-- 1.4 双轨权限与岗位限额策略表
CREATE TABLE IF NOT EXISTS "ys_policy" (
  "id" VARCHAR(64) PRIMARY KEY,
  "enterprise_id" VARCHAR(64) NOT NULL,
  "post_code" VARCHAR(50) NOT NULL,
  "post_name" VARCHAR(100) NOT NULL,
  "mode" VARCHAR(30) DEFAULT 'POOL_SHARED', -- SEAT_EXCLUSIVE | POOL_SHARED
  "monthly_token_cap" BIGINT DEFAULT 20000000,
  "daily_token_cap" BIGINT DEFAULT 1000000,
  "allowed_apps" JSONB DEFAULT '["WORKBUDDY","QODER","TRAE"]',
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_policy_tenant_ent" ON "ys_policy" ("tenant_id", "enterprise_id");

-- 1.5 渠道网络与二级账户表
CREATE TABLE IF NOT EXISTS "ys_channel_node" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "code" VARCHAR(64) NOT NULL,
  "node_type" VARCHAR(30) NOT NULL, -- PROVINCE | CITY | MANAGER | PARTNER | SECONDARY
  "parent_id" VARCHAR(64),
  "manager_name" VARCHAR(50),
  "manager_phone" VARCHAR(20),
  "commission_rate" DOUBLE PRECISION DEFAULT 0.10,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_channel_tenant_parent" ON "ys_channel_node" ("tenant_id", "parent_id");

-- 1.6 用量计量明细表
CREATE TABLE IF NOT EXISTS "ys_meter_record" (
  "id" VARCHAR(64) PRIMARY KEY,
  "request_id" VARCHAR(100) NOT NULL,
  "enterprise_id" VARCHAR(64) NOT NULL,
  "seat_id" VARCHAR(64),
  "app_type" VARCHAR(30) NOT NULL,
  "model" VARCHAR(100) NOT NULL,
  "prompt_tokens" INTEGER DEFAULT 0 NOT NULL,
  "completion_tokens" INTEGER DEFAULT 0 NOT NULL,
  "total_tokens" INTEGER DEFAULT 0 NOT NULL,
  "time_slot" VARCHAR(20) DEFAULT 'PEAK', -- PEAK | OFF_PEAK
  "operator_site" VARCHAR(50) DEFAULT '广东移动智算中心',
  "cost_cny" DOUBLE PRECISION DEFAULT 0.0,
  "tenant_id" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_meter_tenant_ent_created" ON "ys_meter_record" ("tenant_id", "enterprise_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_ys_meter_req" ON "ys_meter_record" ("request_id");

-- 1.7 分时计价与费率表
CREATE TABLE IF NOT EXISTS "ys_tariff_rule" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "slot_type" VARCHAR(20) NOT NULL, -- PEAK | OFF_PEAK
  "start_time" VARCHAR(10) NOT NULL, -- '09:00'
  "end_time" VARCHAR(10) NOT NULL,   -- '21:00'
  "rate_ratio" DOUBLE PRECISION DEFAULT 1.0,
  "allow_batch_task" BOOLEAN DEFAULT true,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_tariff_tenant" ON "ys_tariff_rule" ("tenant_id");

-- 1.8 调度限额与熔断表
CREATE TABLE IF NOT EXISTS "ys_dispatch_limit" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "target_type" VARCHAR(30) NOT NULL, -- ENTERPRISE | APP | POST | DIGITAL_STAFF
  "target_id" VARCHAR(64) NOT NULL,
  "max_concurrency" INTEGER DEFAULT 50,
  "rate_per_min" INTEGER DEFAULT 200,
  "exhaust_action" VARCHAR(30) DEFAULT 'DEGRADE_BASIC', -- REJECT | DEGRADE_BASIC | THROTTLE
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_dispatch_tenant" ON "ys_dispatch_limit" ("tenant_id");

-- 1.9 运营方案工厂表
CREATE TABLE IF NOT EXISTS "ys_operation_scheme" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "code" VARCHAR(64) NOT NULL UNIQUE,
  "template_code" VARCHAR(50) NOT NULL, -- T-GRID-RETAIL | T-UNBUNDLE | T-GEN-DIRECT 等
  "collector_party" VARCHAR(50) DEFAULT 'OPERATOR',
  "invoicer_party" VARCHAR(50) DEFAULT 'OPERATOR',
  "billing_structure" VARCHAR(50) DEFAULT 'TWO_PART',
  "split_pipeline_id" VARCHAR(64),
  "description" VARCHAR(500),
  "version" VARCHAR(20) DEFAULT 'v1.0.0',
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_scheme_tenant" ON "ys_operation_scheme" ("tenant_id");

-- 1.10 货架资费与套餐 SKU 表
CREATE TABLE IF NOT EXISTS "ys_product_sku" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "sku_code" VARCHAR(64) NOT NULL UNIQUE,
  "package_type" VARCHAR(30) NOT NULL, -- OFFICE | DEV | HYBRID | CUSTOM
  "price_cny" DOUBLE PRECISION DEFAULT 10000.0,
  "included_seats" INTEGER DEFAULT 20,
  "included_tokens" BIGINT DEFAULT 100000000,
  "overage_token_price" DOUBLE PRECISION DEFAULT 0.0001,
  "boss_product_code" VARCHAR(64),
  "allowed_apps" JSONB DEFAULT '["WORKBUDDY","QODER","TRAE"]',
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_sku_tenant" ON "ys_product_sku" ("tenant_id");

-- 1.11 分账规则流水线表
CREATE TABLE IF NOT EXISTS "ys_split_pipeline" (
  "id" VARCHAR(64) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "pipeline_code" VARCHAR(64) NOT NULL UNIQUE,
  "operator_ratio" DOUBLE PRECISION DEFAULT 0.48,
  "vendor_ratio" DOUBLE PRECISION DEFAULT 0.38,
  "platform_ratio" DOUBLE PRECISION DEFAULT 0.14,
  "min_guarantee_cny" DOUBLE PRECISION DEFAULT 0.0,
  "rules_config" JSONB DEFAULT '{}',
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_split_tenant" ON "ys_split_pipeline" ("tenant_id");

-- 1.12 合同账期表
CREATE TABLE IF NOT EXISTS "ys_contract" (
  "id" VARCHAR(64) PRIMARY KEY,
  "contract_no" VARCHAR(64) NOT NULL UNIQUE,
  "title" VARCHAR(100) NOT NULL,
  "enterprise_id" VARCHAR(64) NOT NULL,
  "scheme_id" VARCHAR(64) NOT NULL,
  "sku_id" VARCHAR(64) NOT NULL,
  "amount_cny" DOUBLE PRECISION DEFAULT 10000.0,
  "payment_terms_days" INTEGER DEFAULT 30,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3) NOT NULL,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_contract_tenant_ent" ON "ys_contract" ("tenant_id", "enterprise_id");

-- 1.13 结算清分批次表
CREATE TABLE IF NOT EXISTS "ys_settlement_batch" (
  "id" VARCHAR(64) PRIMARY KEY,
  "batch_no" VARCHAR(64) NOT NULL UNIQUE,
  "settlement_month" VARCHAR(20) NOT NULL, -- '2026-08'
  "enterprise_id" VARCHAR(64) NOT NULL,
  "total_tokens" BIGINT DEFAULT 0,
  "total_amount_cny" DOUBLE PRECISION DEFAULT 0.0,
  "operator_amount_cny" DOUBLE PRECISION DEFAULT 0.0,
  "vendor_amount_cny" DOUBLE PRECISION DEFAULT 0.0,
  "platform_amount_cny" DOUBLE PRECISION DEFAULT 0.0,
  "channel_amount_cny" DOUBLE PRECISION DEFAULT 0.0,
  "reconcile_status" VARCHAR(30) DEFAULT 'MATCHED', -- MATCHED | DISCREPANCY | ADJUSTED
  "status" VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT | LOCKED | POSTED | PAID | REVERSED
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_batch_tenant_ent_month" ON "ys_settlement_batch" ("tenant_id", "enterprise_id", "settlement_month");

-- 1.14 分账分录流水表
CREATE TABLE IF NOT EXISTS "ys_ledger_entry" (
  "id" VARCHAR(64) PRIMARY KEY,
  "batch_id" VARCHAR(64) NOT NULL,
  "party_type" VARCHAR(30) NOT NULL, -- OPERATOR | VENDOR_TENCENT | VENDOR_ALIBABA | VENDOR_BYTEDANCE | PLATFORM | CHANNEL
  "subject_code" VARCHAR(50) NOT NULL, -- COMPUTE_FEE | SEAT_ROYALTY | PLATFORM_SERVICE | CHANNEL_COMMISSION
  "direction" VARCHAR(10) DEFAULT 'CREDIT', -- DEBIT | CREDIT
  "amount_cny" DOUBLE PRECISION NOT NULL,
  "tax_cny" DOUBLE PRECISION DEFAULT 0.0,
  "status" VARCHAR(20) DEFAULT 'POSTED',
  "tenant_id" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_ledger_tenant_batch" ON "ys_ledger_entry" ("tenant_id", "batch_id");

-- 1.15 开票与收款单据表
CREATE TABLE IF NOT EXISTS "ys_invoice_payment" (
  "id" VARCHAR(64) PRIMARY KEY,
  "invoice_no" VARCHAR(64) NOT NULL UNIQUE,
  "contract_id" VARCHAR(64),
  "batch_id" VARCHAR(64),
  "enterprise_id" VARCHAR(64) NOT NULL,
  "amount_cny" DOUBLE PRECISION NOT NULL,
  "invoice_title" VARCHAR(100) NOT NULL,
  "tax_no" VARCHAR(50),
  "invoice_type" VARCHAR(30) DEFAULT 'SINGLE_GENERAL', -- SINGLE_GENERAL | SPLIT_SERVICE_COMPUTE
  "payment_status" VARCHAR(20) DEFAULT 'UNPAID', -- UNPAID | PARTIAL | PAID | VOIDED
  "paid_at" TIMESTAMP(3),
  "tenant_id" VARCHAR(64),
  "created_by" VARCHAR(64),
  "updated_by" VARCHAR(64),
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_ys_invoice_tenant_ent" ON "ys_invoice_payment" ("tenant_id", "enterprise_id");

-- ============================================================
-- 2. 应算通严格四字菜单 (DIR & MENU) 插入 system_menu
-- ============================================================

INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES
  -- 2.1 运营总览
  ('ys-dir-overview', '运营总览', 'meter:dashboard:query', 'DIR', NULL, '/admin/overview', NULL, 'ep:odometer', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-dashboard', '运营看板', 'meter:dashboard:query', 'MENU', 'ys-dir-overview', 'dashboard', 'overview/dashboard/index', 'ep:data-board', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-todolist', '工作待办', 'settlement:batch:query', 'MENU', 'ys-dir-overview', 'todolist', 'overview/todolist/index', 'ep:tickets', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.2 身份权益
  ('ys-dir-entitlement', '身份权益', 'entitlement:enterprise:query', 'DIR', NULL, '/admin/entitlement', NULL, 'ep:user-filled', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-enterprise', '企业账户', 'entitlement:enterprise:query', 'MENU', 'ys-dir-entitlement', 'enterprises', 'entitlement/enterprise/index', 'ep:office-building', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-seat', '坐席管理', 'entitlement:seat:query', 'MENU', 'ys-dir-entitlement', 'seats', 'entitlement/seat/index', 'ep:avatar', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-quota', '额度账户', 'entitlement:quota:query', 'MENU', 'ys-dir-entitlement', 'quotas', 'entitlement/quota/index', 'ep:coin', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-policy', '岗位限额', 'entitlement:policy:query', 'MENU', 'ys-dir-entitlement', 'policies', 'entitlement/policy/index', 'ep:operation', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.3 模型网关 (复用与增强已有 aigw 菜单)
  ('ai-gateway-dir', '模型网关', 'aigw:channel:view', 'DIR', NULL, '/admin/aigw', NULL, 'ep:aim', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.4 用量策略
  ('ys-dir-meter', '用量策略', 'meter:usage:query', 'DIR', NULL, '/admin/meter', NULL, 'ep:data-line', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-meter-usage', '用量计量', 'meter:usage:query', 'MENU', 'ys-dir-meter', 'usages', 'meter/usage/index', 'ep:histogram', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-meter-tariff', '分时计价', 'meter:tariff:query', 'MENU', 'ys-dir-meter', 'tariffs', 'meter/tariff/index', 'ep:timer', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-meter-dispatch', '调度限额', 'meter:dispatch:query', 'MENU', 'ys-dir-meter', 'dispatches', 'meter/dispatch/index', 'ep:cpu', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.5 运营清分
  ('ys-dir-scheme', '运营清分', 'scheme:factory:query', 'DIR', NULL, '/admin/scheme', NULL, 'ep:money', 5, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-scheme-factory', '方案工厂', 'scheme:factory:query', 'MENU', 'ys-dir-scheme', 'factories', 'scheme/factory/index', 'ep:magic-stick', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-scheme-sku', '货架资费', 'scheme:sku:query', 'MENU', 'ys-dir-scheme', 'skus', 'scheme/sku/index', 'ep:goods', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-split-pipeline', '分账规则', 'split:pipeline:query', 'MENU', 'ys-dir-scheme', 'splits', 'split/pipeline/index', 'ep:share', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-settle-batch', '结算清分', 'settlement:batch:query', 'MENU', 'ys-dir-scheme', 'batches', 'settlement/batch/index', 'ep:finished', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.6 渠道开户
  ('ys-dir-channel', '渠道开户', 'entitlement:channel:query', 'DIR', NULL, '/admin/channel', NULL, 'ep:guide', 6, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-channel-tree', '渠道网络', 'entitlement:channel:query', 'MENU', 'ys-dir-channel', 'tree', 'channel/tree/index', 'ep:connection', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-contract', '合同账期', 'settlement:contract:query', 'MENU', 'ys-dir-channel', 'contracts', 'settlement/contract/index', 'ep:document', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),

  -- 2.7 票款账务
  ('ys-dir-invoice', '票款账务', 'settlement:invoice:query', 'DIR', NULL, '/admin/invoice', NULL, 'ep:wallet', 7, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ys-menu-invoice-pay', '开票收款', 'settlement:invoice:query', 'MENU', 'ys-dir-invoice', 'bills', 'invoice/bill/index', 'ep:printer', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)

ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "permission" = EXCLUDED."permission",
  "type" = EXCLUDED."type",
  "parent_id" = EXCLUDED."parent_id",
  "path" = EXCLUDED."path",
  "component" = EXCLUDED."component",
  "icon" = EXCLUDED."icon",
  "sort" = EXCLUDED."sort",
  "status" = EXCLUDED."status",
  "visible" = EXCLUDED."visible",
  "keep_alive" = EXCLUDED."keep_alive",
  "updated_at" = CURRENT_TIMESTAMP,
  "deleted" = false;

-- ============================================================
-- 3. 授权给系统管理员角色
-- ============================================================
INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ys-role-', role."id", '-', menu."id"), role."id", menu."id"
FROM "system_role" AS role
CROSS JOIN "system_menu" AS menu
WHERE (role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%')
  AND menu."id" LIKE 'ys-%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;
