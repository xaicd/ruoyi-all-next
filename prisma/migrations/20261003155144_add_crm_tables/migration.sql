-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/crm-source-tables.ts#CRM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- CrmBusiness（源框架导入）
CREATE TABLE "crm_business" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "customer_id" BIGINT,
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" BIGINT,
    "status_type_id" BIGINT,
    "status_id" BIGINT,
    "end_status" INTEGER,
    "end_remark" VARCHAR(255),
    "deal_time" TIMESTAMP(3),
    "total_product_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_business_tenant_id_idx" ON "crm_business"("tenant_id");

-- CrmBusinessProduct（源框架导入）
CREATE TABLE "crm_business_product" (
    "id" TEXT NOT NULL,
    "business_id" BIGINT,
    "product_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "business_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_business_product_tenant_id_idx" ON "crm_business_product"("tenant_id");

-- CrmBusinessStatus（源框架导入）
CREATE TABLE "crm_business_status" (
    "id" TEXT NOT NULL,
    "type_id" BIGINT,
    "name" VARCHAR(255),
    "percent" INTEGER,
    "sort" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_status_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_business_status_tenant_id_idx" ON "crm_business_status"("tenant_id");

-- CrmBusinessStatusType（源框架导入）
CREATE TABLE "crm_business_status_type" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "dept_ids" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_business_status_type_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_business_status_type_tenant_id_idx" ON "crm_business_status_type"("tenant_id");

-- CrmClue（源框架导入）
CREATE TABLE "crm_clue" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" BIGINT,
    "transform_status" BOOLEAN,
    "customer_id" BIGINT,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "qq" VARCHAR(255),
    "wechat" VARCHAR(255),
    "email" VARCHAR(255),
    "area_id" INTEGER,
    "detail_address" VARCHAR(255),
    "industry_id" INTEGER,
    "level" INTEGER,
    "source" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_clue_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_clue_tenant_id_idx" ON "crm_clue"("tenant_id");

-- CrmContact（源框架导入）
CREATE TABLE "crm_contact" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "customer_id" BIGINT,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" BIGINT,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "email" VARCHAR(255),
    "qq" BIGINT,
    "wechat" VARCHAR(255),
    "area_id" INTEGER,
    "detail_address" VARCHAR(255),
    "sex" INTEGER,
    "master" BOOLEAN,
    "post" VARCHAR(255),
    "parent_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contact_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_contact_tenant_id_idx" ON "crm_contact"("tenant_id");

-- CrmContactBusiness（源框架导入）
CREATE TABLE "crm_contact_business" (
    "id" TEXT NOT NULL,
    "contact_id" BIGINT,
    "business_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contact_business_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_contact_business_tenant_id_idx" ON "crm_contact_business"("tenant_id");

-- CrmContract（源框架导入）
CREATE TABLE "crm_contract" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "no" VARCHAR(255),
    "customer_id" BIGINT,
    "business_id" BIGINT,
    "contact_last_time" TIMESTAMP(3),
    "owner_user_id" BIGINT,
    "process_instance_id" VARCHAR(255),
    "audit_status" INTEGER,
    "order_date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "total_product_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "sign_contact_id" BIGINT,
    "sign_user_id" BIGINT,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_contract_tenant_id_idx" ON "crm_contract"("tenant_id");

-- CrmContractConfig（源框架导入）
CREATE TABLE "crm_contract_config" (
    "id" TEXT NOT NULL,
    "notify_enabled" BOOLEAN,
    "notify_days" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_contract_config_tenant_id_idx" ON "crm_contract_config"("tenant_id");

-- CrmContractProduct（源框架导入）
CREATE TABLE "crm_contract_product" (
    "id" TEXT NOT NULL,
    "contract_id" BIGINT,
    "product_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "contract_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_contract_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_contract_product_tenant_id_idx" ON "crm_contract_product"("tenant_id");

-- CrmCustomer（源框架导入）
CREATE TABLE "crm_customer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "follow_up_status" BOOLEAN,
    "contact_last_time" TIMESTAMP(3),
    "contact_last_content" VARCHAR(255),
    "contact_next_time" TIMESTAMP(3),
    "owner_user_id" BIGINT,
    "owner_time" TIMESTAMP(3),
    "lock_status" BOOLEAN,
    "deal_status" BOOLEAN,
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "qq" VARCHAR(255),
    "wechat" VARCHAR(255),
    "email" VARCHAR(255),
    "area_id" INTEGER,
    "detail_address" VARCHAR(255),
    "industry_id" INTEGER,
    "level" INTEGER,
    "source" INTEGER,
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_customer_tenant_id_idx" ON "crm_customer"("tenant_id");

-- CrmCustomerLimitConfig（源框架导入）
CREATE TABLE "crm_customer_limit_config" (
    "id" TEXT NOT NULL,
    "type" INTEGER,
    "user_ids" TEXT,
    "dept_ids" TEXT,
    "max_count" INTEGER,
    "deal_count_enabled" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_limit_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_customer_limit_config_tenant_id_idx" ON "crm_customer_limit_config"("tenant_id");

-- CrmCustomerPoolConfig（源框架导入）
CREATE TABLE "crm_customer_pool_config" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN,
    "contact_expire_days" INTEGER,
    "deal_expire_days" INTEGER,
    "notify_enabled" BOOLEAN,
    "notify_days" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_customer_pool_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_customer_pool_config_tenant_id_idx" ON "crm_customer_pool_config"("tenant_id");

-- CrmFollowUpRecord（源框架导入）
CREATE TABLE "crm_follow_up_record" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "next_time" TIMESTAMP(3),
    "pic_urls" TEXT,
    "file_urls" TEXT,
    "business_ids" TEXT,
    "contact_ids" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_follow_up_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_follow_up_record_tenant_id_idx" ON "crm_follow_up_record"("tenant_id");

-- CrmOwnerRecord（源框架导入）
CREATE TABLE "crm_owner_record" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "pre_owner_user_id" BIGINT,
    "post_owner_user_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_owner_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_owner_record_tenant_id_idx" ON "crm_owner_record"("tenant_id");

-- CrmPerformanceConfig（源框架导入）
CREATE TABLE "crm_performance_config" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "object_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_performance_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_performance_config_tenant_id_idx" ON "crm_performance_config"("tenant_id");

-- CrmPermission（源框架导入）
CREATE TABLE "crm_permission" (
    "id" TEXT NOT NULL,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "user_id" BIGINT,
    "level" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_permission_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_permission_tenant_id_idx" ON "crm_permission"("tenant_id");

-- CrmProduct（源框架导入）
CREATE TABLE "crm_product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "no" VARCHAR(255),
    "unit" INTEGER NOT NULL,
    "price" DECIMAL(18,2),
    "status" INTEGER,
    "category_id" BIGINT,
    "description" VARCHAR(255),
    "owner_user_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_product_tenant_id_idx" ON "crm_product"("tenant_id");

-- CrmProductCategory（源框架导入）
CREATE TABLE "crm_product_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "parent_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_product_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_product_category_tenant_id_idx" ON "crm_product_category"("tenant_id");

-- CrmReceivable（源框架导入）
CREATE TABLE "crm_receivable" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "plan_id" BIGINT,
    "customer_id" BIGINT,
    "contract_id" BIGINT,
    "owner_user_id" BIGINT,
    "return_time" TIMESTAMP(3),
    "return_type" INTEGER,
    "price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "process_instance_id" VARCHAR(255),
    "audit_status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_receivable_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_receivable_tenant_id_idx" ON "crm_receivable"("tenant_id");

-- CrmReceivablePlan（源框架导入）
CREATE TABLE "crm_receivable_plan" (
    "id" TEXT NOT NULL,
    "period" INTEGER,
    "customer_id" BIGINT,
    "contract_id" BIGINT,
    "owner_user_id" BIGINT,
    "return_time" TIMESTAMP(3),
    "return_type" INTEGER,
    "price" DECIMAL(18,2),
    "receivable_id" BIGINT,
    "remind_days" INTEGER,
    "remind_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "crm_receivable_plan_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "crm_receivable_plan_tenant_id_idx" ON "crm_receivable_plan"("tenant_id");
