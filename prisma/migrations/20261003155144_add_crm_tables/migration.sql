-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/crm-source-tables.ts#CRM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- CRM 商机
CREATE TABLE IF NOT EXISTS "crm_business" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "customer_id" TEXT,
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" TEXT,
    "status_type_id" TEXT,
    "status_id" TEXT,
    "end_status" INTEGER,
    "end_remark" VARCHAR(255),
    "deal_time" TIMESTAMP(3),
    "total_product_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_business" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "follow_up_status" BOOLEAN;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "contact_last_time" TIMESTAMP(3);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "contact_next_time" TIMESTAMP(3);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_business" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "status_type_id" TEXT;
ALTER TABLE "crm_business" ALTER COLUMN "status_type_id" TYPE TEXT USING "status_type_id"::TEXT;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "status_id" TEXT;
ALTER TABLE "crm_business" ALTER COLUMN "status_id" TYPE TEXT USING "status_id"::TEXT;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "end_status" INTEGER;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "end_remark" VARCHAR(255);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "deal_time" TIMESTAMP(3);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_business" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_business_tenant_id_idx" ON "crm_business"("tenant_id");

-- CRM 商机产品关联表 DOCrmBusinessDO : CrmBusines
CREATE TABLE IF NOT EXISTS "crm_business_product" (
    "id" TEXT NOT NULL,
    "business_id" TEXT,
    "product_id" TEXT,
    "product_price" DECIMAL(18,2),
    "business_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "business_id" TEXT;
ALTER TABLE "crm_business_product" ALTER COLUMN "business_id" TYPE TEXT USING "business_id"::TEXT;
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "crm_business_product" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "business_price" DECIMAL(18,2);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_business_product" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_product" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_business_product_tenant_id_idx" ON "crm_business_product"("tenant_id");

-- CRM 商机状态 DO注意，它是个配置表
CREATE TABLE IF NOT EXISTS "crm_business_status" (
    "id" TEXT NOT NULL,
    "type_id" TEXT,
    "name" VARCHAR(255),
    "percent" INTEGER,
    "sort" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_status_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "type_id" TEXT;
ALTER TABLE "crm_business_status" ALTER COLUMN "type_id" TYPE TEXT USING "type_id"::TEXT;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "percent" INTEGER;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_business_status" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_status" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_business_status_tenant_id_idx" ON "crm_business_status"("tenant_id");

-- CRM 商机状态组 DO注意，它是个配置表
CREATE TABLE IF NOT EXISTS "crm_business_status_type" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "dept_ids" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_status_type_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "dept_ids" TEXT;
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_business_status_type" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_business_status_type" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_business_status_type_tenant_id_idx" ON "crm_business_status_type"("tenant_id");

-- CRM 线索
CREATE TABLE IF NOT EXISTS "crm_clue" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" TEXT,
    "transform_status" BOOLEAN,
    "customer_id" TEXT,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "qq" VARCHAR(255),
    "wechat" VARCHAR(255),
    "email" VARCHAR(255),
    "area_id" TEXT,
    "detail_address" VARCHAR(255),
    "industry_id" TEXT,
    "level" INTEGER,
    "source" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_clue_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "follow_up_status" BOOLEAN;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "contact_last_time" TIMESTAMP(3);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "contact_last_content" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "contact_next_time" TIMESTAMP(3);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_clue" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "transform_status" BOOLEAN;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_clue" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "qq" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "wechat" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "area_id" TEXT;
ALTER TABLE "crm_clue" ALTER COLUMN "area_id" TYPE TEXT USING "area_id"::TEXT;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "detail_address" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "industry_id" TEXT;
ALTER TABLE "crm_clue" ALTER COLUMN "industry_id" TYPE TEXT USING "industry_id"::TEXT;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "source" INTEGER;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_clue" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_clue" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_clue_tenant_id_idx" ON "crm_clue"("tenant_id");

-- CRM 联系人
CREATE TABLE IF NOT EXISTS "crm_contact" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "customer_id" TEXT,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" TEXT,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "email" VARCHAR(255),
    "qq" BIGINT,
    "wechat" VARCHAR(255),
    "area_id" TEXT,
    "detail_address" VARCHAR(255),
    "sex" INTEGER,
    "master" BOOLEAN,
    "post" VARCHAR(255),
    "parent_id" TEXT,
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contact_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_contact" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "contact_last_time" TIMESTAMP(3);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "contact_last_content" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "contact_next_time" TIMESTAMP(3);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_contact" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "qq" BIGINT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "wechat" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "area_id" TEXT;
ALTER TABLE "crm_contact" ALTER COLUMN "area_id" TYPE TEXT USING "area_id"::TEXT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "detail_address" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "sex" INTEGER;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "master" BOOLEAN;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "post" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
ALTER TABLE "crm_contact" ALTER COLUMN "parent_id" TYPE TEXT USING "parent_id"::TEXT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_contact" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contact" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_contact_tenant_id_idx" ON "crm_contact"("tenant_id");

-- CRM 联系人与商机的关联
CREATE TABLE IF NOT EXISTS "crm_contact_business" (
    "id" TEXT NOT NULL,
    "contact_id" TEXT,
    "business_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contact_business_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "contact_id" TEXT;
ALTER TABLE "crm_contact_business" ALTER COLUMN "contact_id" TYPE TEXT USING "contact_id"::TEXT;
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "business_id" TEXT;
ALTER TABLE "crm_contact_business" ALTER COLUMN "business_id" TYPE TEXT USING "business_id"::TEXT;
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_contact_business" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contact_business" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_contact_business_tenant_id_idx" ON "crm_contact_business"("tenant_id");

-- CRM 合同
CREATE TABLE IF NOT EXISTS "crm_contract" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "no" VARCHAR(255),
    "customer_id" TEXT,
    "business_id" TEXT,
    "contact_last_time" TIMESTAMP(3),
    "owner_user_id" TEXT,
    "process_instance_id" TEXT,
    "audit_status" INTEGER,
    "order_date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "total_product_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "sign_contact_id" TEXT,
    "sign_user_id" TEXT,
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "business_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "business_id" TYPE TEXT USING "business_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "contact_last_time" TIMESTAMP(3);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "process_instance_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "process_instance_id" TYPE TEXT USING "process_instance_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "audit_status" INTEGER;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "order_date" TIMESTAMP(3);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "sign_contact_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "sign_contact_id" TYPE TEXT USING "sign_contact_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "sign_user_id" TEXT;
ALTER TABLE "crm_contract" ALTER COLUMN "sign_user_id" TYPE TEXT USING "sign_user_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_contract" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_contract_tenant_id_idx" ON "crm_contract"("tenant_id");

-- 编号
CREATE TABLE IF NOT EXISTS "crm_contract_config" (
    "id" TEXT NOT NULL,
    "notify_enabled" BOOLEAN,
    "notify_days" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "notify_enabled" BOOLEAN;
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "notify_days" INTEGER;
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_contract_config" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_contract_config_tenant_id_idx" ON "crm_contract_config"("tenant_id");

-- CRM 合同产品关联表
CREATE TABLE IF NOT EXISTS "crm_contract_product" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT,
    "product_id" TEXT,
    "product_price" DECIMAL(18,2),
    "contract_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "contract_id" TEXT;
ALTER TABLE "crm_contract_product" ALTER COLUMN "contract_id" TYPE TEXT USING "contract_id"::TEXT;
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "crm_contract_product" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "contract_price" DECIMAL(18,2);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_contract_product" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_contract_product" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_contract_product_tenant_id_idx" ON "crm_contract_product"("tenant_id");

-- CRM 客户
CREATE TABLE IF NOT EXISTS "crm_customer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" TEXT,
    "owner_time" TIMESTAMP(3),
    "lock_status" BOOLEAN,
    "deal_status" BOOLEAN,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "qq" VARCHAR(255),
    "wechat" VARCHAR(255),
    "email" VARCHAR(255),
    "area_id" TEXT,
    "detail_address" VARCHAR(255),
    "industry_id" TEXT,
    "level" INTEGER,
    "source" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "follow_up_status" BOOLEAN;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "contact_last_time" TIMESTAMP(3);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "contact_last_content" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "contact_next_time" TIMESTAMP(3);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_customer" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "owner_time" TIMESTAMP(3);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "lock_status" BOOLEAN;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "deal_status" BOOLEAN;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "qq" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "wechat" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "area_id" TEXT;
ALTER TABLE "crm_customer" ALTER COLUMN "area_id" TYPE TEXT USING "area_id"::TEXT;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "detail_address" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "industry_id" TEXT;
ALTER TABLE "crm_customer" ALTER COLUMN "industry_id" TYPE TEXT USING "industry_id"::TEXT;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "source" INTEGER;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_customer" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_customer_tenant_id_idx" ON "crm_customer"("tenant_id");

-- 客户限制配置
CREATE TABLE IF NOT EXISTS "crm_customer_limit_config" (
    "id" TEXT NOT NULL,
    "type" INTEGER,
    "user_ids" TEXT,
    "dept_ids" TEXT,
    "max_count" INTEGER,
    "deal_count_enabled" BOOLEAN,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_limit_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "user_ids" TEXT;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "dept_ids" TEXT;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "max_count" INTEGER;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "deal_count_enabled" BOOLEAN;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_customer_limit_config" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer_limit_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_customer_limit_config_tenant_id_idx" ON "crm_customer_limit_config"("tenant_id");

-- 客户公海配置
CREATE TABLE IF NOT EXISTS "crm_customer_pool_config" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN,
    "contact_expire_days" INTEGER,
    "deal_expire_days" INTEGER,
    "notify_enabled" BOOLEAN,
    "notify_days" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_pool_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "enabled" BOOLEAN;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "contact_expire_days" INTEGER;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "deal_expire_days" INTEGER;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "notify_enabled" BOOLEAN;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "notify_days" INTEGER;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_customer_pool_config" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_customer_pool_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_customer_pool_config_tenant_id_idx" ON "crm_customer_pool_config"("tenant_id");

-- 跟进记录 DO用于记录客户、联系人的每一次跟进
CREATE TABLE IF NOT EXISTS "crm_follow_up_record" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "next_time" TIMESTAMP(3),
    "pic_urls" TEXT,
    "file_urls" TEXT,
    "business_ids" TEXT,
    "contact_ids" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_follow_up_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "crm_follow_up_record" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "next_time" TIMESTAMP(3);
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "pic_urls" TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "file_urls" TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "business_ids" TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "contact_ids" TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_follow_up_record" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_follow_up_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_follow_up_record_tenant_id_idx" ON "crm_follow_up_record"("tenant_id");

-- CRM 负责人变更记录
CREATE TABLE IF NOT EXISTS "crm_owner_record" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "pre_owner_user_id" TEXT,
    "post_owner_user_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_owner_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "crm_owner_record" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "pre_owner_user_id" TEXT;
ALTER TABLE "crm_owner_record" ALTER COLUMN "pre_owner_user_id" TYPE TEXT USING "pre_owner_user_id"::TEXT;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "post_owner_user_id" TEXT;
ALTER TABLE "crm_owner_record" ALTER COLUMN "post_owner_user_id" TYPE TEXT USING "post_owner_user_id"::TEXT;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_owner_record" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_owner_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_owner_record_tenant_id_idx" ON "crm_owner_record"("tenant_id");

-- CRM 业绩目标
CREATE TABLE IF NOT EXISTS "crm_performance_config" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "object_id" TEXT,
    "object_type" INTEGER,
    "year" INTEGER,
    "year_target_price" DECIMAL(18,2),
    "january_target_price" DECIMAL(18,2),
    "february_target_price" DECIMAL(18,2),
    "march_target_price" DECIMAL(18,2),
    "april_target_price" DECIMAL(18,2),
    "may_target_price" DECIMAL(18,2),
    "june_target_price" DECIMAL(18,2),
    "july_target_price" DECIMAL(18,2),
    "august_target_price" DECIMAL(18,2),
    "september_target_price" DECIMAL(18,2),
    "october_target_price" DECIMAL(18,2),
    "november_target_price" DECIMAL(18,2),
    "december_target_price" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_performance_config_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "object_id" TEXT;
ALTER TABLE "crm_performance_config" ALTER COLUMN "object_id" TYPE TEXT USING "object_id"::TEXT;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "object_type" INTEGER;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "year" INTEGER;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "year_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "january_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "february_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "march_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "april_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "may_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "june_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "july_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "august_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "september_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "october_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "november_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "december_target_price" DECIMAL(18,2);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_performance_config" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_performance_config" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_performance_config_tenant_id_idx" ON "crm_performance_config"("tenant_id");

-- CRM 数据权限
CREATE TABLE IF NOT EXISTS "crm_permission" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "user_id" TEXT,
    "level" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_permission_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "crm_permission" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "crm_permission" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "level" INTEGER;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_permission" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_permission" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_permission_tenant_id_idx" ON "crm_permission"("tenant_id");

-- CRM 产品
CREATE TABLE IF NOT EXISTS "crm_product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "no" VARCHAR(255),
    "unit" INTEGER NOT NULL,
    "price" DECIMAL(18,2),
    "status" INTEGER,
    "category_id" TEXT,
    "description" VARCHAR(255),
    "owner_user_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "unit" INTEGER NOT NULL;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "price" DECIMAL(18,2);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "category_id" TEXT;
ALTER TABLE "crm_product" ALTER COLUMN "category_id" TYPE TEXT USING "category_id"::TEXT;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_product" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_product" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_product" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_product_tenant_id_idx" ON "crm_product"("tenant_id");

-- 产品分类
CREATE TABLE IF NOT EXISTS "crm_product_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "parent_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_product_category_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
ALTER TABLE "crm_product_category" ALTER COLUMN "parent_id" TYPE TEXT USING "parent_id"::TEXT;
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_product_category" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_product_category" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_product_category_tenant_id_idx" ON "crm_product_category"("tenant_id");

-- 回款
CREATE TABLE IF NOT EXISTS "crm_receivable" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "plan_id" TEXT,
    "customer_id" TEXT,
    "contract_id" TEXT,
    "owner_user_id" TEXT,
    "return_time" TIMESTAMP(3),
    "return_type" INTEGER,
    "price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "process_instance_id" TEXT,
    "audit_status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_receivable_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "plan_id" TEXT;
ALTER TABLE "crm_receivable" ALTER COLUMN "plan_id" TYPE TEXT USING "plan_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_receivable" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "contract_id" TEXT;
ALTER TABLE "crm_receivable" ALTER COLUMN "contract_id" TYPE TEXT USING "contract_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_receivable" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "return_time" TIMESTAMP(3);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "return_type" INTEGER;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "price" DECIMAL(18,2);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "process_instance_id" TEXT;
ALTER TABLE "crm_receivable" ALTER COLUMN "process_instance_id" TYPE TEXT USING "process_instance_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "audit_status" INTEGER;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_receivable" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_receivable" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_receivable_tenant_id_idx" ON "crm_receivable"("tenant_id");

-- CRM 回款计划
CREATE TABLE IF NOT EXISTS "crm_receivable_plan" (
    "id" TEXT NOT NULL,
    "period" INTEGER,
    "customer_id" TEXT,
    "contract_id" TEXT,
    "owner_user_id" TEXT,
    "return_time" TIMESTAMP(3),
    "return_type" INTEGER,
    "price" DECIMAL(18,2),
    "receivable_id" TEXT,
    "remind_days" INTEGER,
    "remind_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_receivable_plan_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "period" INTEGER;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "crm_receivable_plan" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "contract_id" TEXT;
ALTER TABLE "crm_receivable_plan" ALTER COLUMN "contract_id" TYPE TEXT USING "contract_id"::TEXT;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "crm_receivable_plan" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "return_time" TIMESTAMP(3);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "return_type" INTEGER;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "price" DECIMAL(18,2);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "receivable_id" TEXT;
ALTER TABLE "crm_receivable_plan" ALTER COLUMN "receivable_id" TYPE TEXT USING "receivable_id"::TEXT;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "remind_days" INTEGER;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "remind_time" TIMESTAMP(3);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "crm_receivable_plan" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "crm_receivable_plan" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "crm_receivable_plan_tenant_id_idx" ON "crm_receivable_plan"("tenant_id");
