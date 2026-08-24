-- CreateTable: aigw_tenant_quota_ledger (算力配额增量台账流水表)
CREATE TABLE IF NOT EXISTS "aigw_tenant_quota_ledger" (
    "id" VARCHAR(64) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "change_type" VARCHAR(64) NOT NULL,
    "delta_tokens" BIGINT NOT NULL,
    "balance_after" BIGINT NOT NULL,
    "model_pattern" VARCHAR(128) DEFAULT '*',
    "ref_id" VARCHAR(128),
    "operator_id" VARCHAR(64),
    "remark" VARCHAR(512),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aigw_tenant_quota_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable: system_tenant_package_ai_quota (租户套餐-AI配额关联表)
CREATE TABLE IF NOT EXISTS "system_tenant_package_ai_quota" (
    "id" VARCHAR(64) NOT NULL,
    "package_id" VARCHAR(64) NOT NULL,
    "model_pattern" VARCHAR(128) NOT NULL DEFAULT '*',
    "quota_tokens" BIGINT NOT NULL,
    "refresh_cycle" VARCHAR(32) NOT NULL DEFAULT 'MONTHLY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_tenant_package_ai_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable: system_tenant_package_ai_seat (租户套餐-AI坐席关联表)
CREATE TABLE IF NOT EXISTS "system_tenant_package_ai_seat" (
    "id" VARCHAR(64) NOT NULL,
    "package_id" VARCHAR(64) NOT NULL,
    "seat_type" VARCHAR(32) NOT NULL DEFAULT 'STANDARD',
    "max_seats" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_tenant_package_ai_seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable: system_tenant_package_ai_tariff (租户套餐-AI资费关联表)
CREATE TABLE IF NOT EXISTS "system_tenant_package_ai_tariff" (
    "id" VARCHAR(64) NOT NULL,
    "package_id" VARCHAR(64) NOT NULL,
    "tariff_id" VARCHAR(64) NOT NULL,
    "overage_policy" VARCHAR(32) NOT NULL DEFAULT 'BLOCK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "system_tenant_package_ai_tariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable: aigw_carrier_agent (运营商分销渠道表)
CREATE TABLE IF NOT EXISTS "aigw_carrier_agent" (
    "id" VARCHAR(64) NOT NULL,
    "carrier_code" VARCHAR(64) NOT NULL,
    "carrier_name" VARCHAR(128) NOT NULL,
    "province" VARCHAR(64) NOT NULL,
    "revenue_share_ratio" DECIMAL(5, 2) NOT NULL DEFAULT 30.00,
    "contact_name" VARCHAR(64),
    "contact_phone" VARCHAR(32),
    "status" VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "aigw_carrier_agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "aigw_tenant_quota_ledger_tenant_id_idx" ON "aigw_tenant_quota_ledger"("tenant_id");
CREATE INDEX IF NOT EXISTS "aigw_tenant_quota_ledger_created_at_idx" ON "aigw_tenant_quota_ledger"("created_at");
CREATE INDEX IF NOT EXISTS "system_tenant_package_ai_quota_package_id_idx" ON "system_tenant_package_ai_quota"("package_id");
CREATE INDEX IF NOT EXISTS "system_tenant_package_ai_seat_package_id_idx" ON "system_tenant_package_ai_seat"("package_id");
CREATE INDEX IF NOT EXISTS "system_tenant_package_ai_tariff_package_id_idx" ON "system_tenant_package_ai_tariff"("package_id");
CREATE UNIQUE INDEX IF NOT EXISTS "aigw_carrier_agent_carrier_code_province_key" ON "aigw_carrier_agent"("carrier_code", "province");
