-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/erp-source-tables.ts#ERP_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- ERP 结算账户
CREATE TABLE IF NOT EXISTS "erp_account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "no" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" INTEGER,
    "sort" INTEGER,
    "default_status" BOOLEAN,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_account_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "default_status" BOOLEAN;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_account" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_account" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_account_tenant_id_idx" ON "erp_account"("tenant_id");

-- ERP 客户
CREATE TABLE IF NOT EXISTS "erp_customer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "contact" VARCHAR(255),
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "email" VARCHAR(255),
    "fax" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" INTEGER,
    "sort" INTEGER,
    "tax_no" VARCHAR(255),
    "tax_percent" DECIMAL(18,2),
    "bank_name" VARCHAR(255),
    "bank_account" VARCHAR(255),
    "bank_address" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_customer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "contact" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "fax" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "tax_no" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "bank_name" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "bank_account" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "bank_address" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_customer" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_customer" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_customer_tenant_id_idx" ON "erp_customer"("tenant_id");

-- ERP 付款单
CREATE TABLE IF NOT EXISTS "erp_finance_payment" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "payment_time" TIMESTAMP(3),
    "finance_user_id" TEXT,
    "supplier_id" TEXT,
    "account_id" TEXT,
    "total_price" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "payment_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_payment_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "payment_time" TIMESTAMP(3);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "finance_user_id" TEXT;
ALTER TABLE "erp_finance_payment" ALTER COLUMN "finance_user_id" TYPE TEXT USING "finance_user_id"::TEXT;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;
ALTER TABLE "erp_finance_payment" ALTER COLUMN "supplier_id" TYPE TEXT USING "supplier_id"::TEXT;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_finance_payment" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "payment_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_finance_payment" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_payment" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_finance_payment_tenant_id_idx" ON "erp_finance_payment"("tenant_id");

-- ERP 付款项
CREATE TABLE IF NOT EXISTS "erp_finance_payment_item" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT,
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "biz_no" VARCHAR(255),
    "total_price" DECIMAL(18,2),
    "paid_price" DECIMAL(18,2),
    "payment_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_payment_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "payment_id" TEXT;
ALTER TABLE "erp_finance_payment_item" ALTER COLUMN "payment_id" TYPE TEXT USING "payment_id"::TEXT;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "erp_finance_payment_item" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "biz_no" VARCHAR(255);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "paid_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "payment_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_finance_payment_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_payment_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_finance_payment_item_tenant_id_idx" ON "erp_finance_payment_item"("tenant_id");

-- ERP 收款单
CREATE TABLE IF NOT EXISTS "erp_finance_receipt" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "receipt_time" TIMESTAMP(3),
    "finance_user_id" TEXT,
    "customer_id" TEXT,
    "account_id" TEXT,
    "total_price" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "receipt_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_receipt_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "receipt_time" TIMESTAMP(3);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "finance_user_id" TEXT;
ALTER TABLE "erp_finance_receipt" ALTER COLUMN "finance_user_id" TYPE TEXT USING "finance_user_id"::TEXT;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "erp_finance_receipt" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_finance_receipt" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "receipt_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_finance_receipt" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_receipt" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_finance_receipt_tenant_id_idx" ON "erp_finance_receipt"("tenant_id");

-- ERP 收款项
CREATE TABLE IF NOT EXISTS "erp_finance_receipt_item" (
    "id" TEXT NOT NULL,
    "receipt_id" TEXT,
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "biz_no" VARCHAR(255),
    "total_price" DECIMAL(18,2),
    "receipted_price" DECIMAL(18,2),
    "receipt_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_receipt_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "receipt_id" TEXT;
ALTER TABLE "erp_finance_receipt_item" ALTER COLUMN "receipt_id" TYPE TEXT USING "receipt_id"::TEXT;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "erp_finance_receipt_item" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "biz_no" VARCHAR(255);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "receipted_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "receipt_price" DECIMAL(18,2);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_finance_receipt_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_finance_receipt_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_finance_receipt_item_tenant_id_idx" ON "erp_finance_receipt_item"("tenant_id");

-- ERP 产品
CREATE TABLE IF NOT EXISTS "erp_product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "bar_code" VARCHAR(255),
    "category_id" TEXT,
    "unit_id" TEXT,
    "status" INTEGER,
    "standard" VARCHAR(255),
    "remark" VARCHAR(255),
    "expiry_day" INTEGER,
    "weight" DECIMAL(18,2),
    "purchase_price" DECIMAL(18,2),
    "sale_price" DECIMAL(18,2),
    "min_price" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "bar_code" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "category_id" TEXT;
ALTER TABLE "erp_product" ALTER COLUMN "category_id" TYPE TEXT USING "category_id"::TEXT;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "unit_id" TEXT;
ALTER TABLE "erp_product" ALTER COLUMN "unit_id" TYPE TEXT USING "unit_id"::TEXT;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "standard" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "expiry_day" INTEGER;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "weight" DECIMAL(18,2);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "purchase_price" DECIMAL(18,2);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "sale_price" DECIMAL(18,2);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "min_price" DECIMAL(18,2);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_product" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_product_tenant_id_idx" ON "erp_product"("tenant_id");

-- ERP 产品分类
CREATE TABLE IF NOT EXISTS "erp_product_category" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT,
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_category_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
ALTER TABLE "erp_product_category" ALTER COLUMN "parent_id" TYPE TEXT USING "parent_id"::TEXT;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_product_category" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product_category" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_product_category_tenant_id_idx" ON "erp_product_category"("tenant_id");

-- ERP 产品单位
CREATE TABLE IF NOT EXISTS "erp_product_unit" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_unit_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_product_unit" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_product_unit" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_product_unit_tenant_id_idx" ON "erp_product_unit"("tenant_id");

-- ERP 采购入库
CREATE TABLE IF NOT EXISTS "erp_purchase_in" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" TEXT,
    "account_id" TEXT,
    "in_time" TIMESTAMP(3),
    "order_id" TEXT,
    "order_no" VARCHAR(255),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "payment_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "other_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_in_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;
ALTER TABLE "erp_purchase_in" ALTER COLUMN "supplier_id" TYPE TEXT USING "supplier_id"::TEXT;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_purchase_in" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "in_time" TIMESTAMP(3);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_purchase_in" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "order_no" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "payment_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "other_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_in" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_in" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_in_tenant_id_idx" ON "erp_purchase_in"("tenant_id");

-- ERP 采购入库项
CREATE TABLE IF NOT EXISTS "erp_purchase_in_items" (
    "id" TEXT NOT NULL,
    "in_id" TEXT,
    "order_item_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_in_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "in_id" TEXT;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "in_id" TYPE TEXT USING "in_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "order_item_id" TEXT;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "order_item_id" TYPE TEXT USING "order_item_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_in_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_in_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_in_items_tenant_id_idx" ON "erp_purchase_in_items"("tenant_id");

-- ERP 采购订单
CREATE TABLE IF NOT EXISTS "erp_purchase_order" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" TEXT,
    "account_id" TEXT,
    "order_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "deposit_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "in_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_order_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;
ALTER TABLE "erp_purchase_order" ALTER COLUMN "supplier_id" TYPE TEXT USING "supplier_id"::TEXT;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_purchase_order" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "order_time" TIMESTAMP(3);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "deposit_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "in_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "return_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_order" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_order" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_order_tenant_id_idx" ON "erp_purchase_order"("tenant_id");

-- ERP 采购订单项
CREATE TABLE IF NOT EXISTS "erp_purchase_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "in_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_order_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_purchase_order_items" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_purchase_order_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_purchase_order_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "in_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "return_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_order_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_order_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_order_items_tenant_id_idx" ON "erp_purchase_order_items"("tenant_id");

-- ERP 采购退货
CREATE TABLE IF NOT EXISTS "erp_purchase_return" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" TEXT,
    "account_id" TEXT,
    "return_time" TIMESTAMP(3),
    "order_id" TEXT,
    "order_no" VARCHAR(255),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "refund_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "other_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_return_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;
ALTER TABLE "erp_purchase_return" ALTER COLUMN "supplier_id" TYPE TEXT USING "supplier_id"::TEXT;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_purchase_return" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "return_time" TIMESTAMP(3);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_purchase_return" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "order_no" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "refund_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "other_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_return" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_return" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_return_tenant_id_idx" ON "erp_purchase_return"("tenant_id");

-- ERP 采购退货项
CREATE TABLE IF NOT EXISTS "erp_purchase_return_items" (
    "id" TEXT NOT NULL,
    "return_id" TEXT,
    "order_item_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_return_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "return_id" TEXT;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "return_id" TYPE TEXT USING "return_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "order_item_id" TEXT;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "order_item_id" TYPE TEXT USING "order_item_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_purchase_return_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_purchase_return_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_purchase_return_items_tenant_id_idx" ON "erp_purchase_return_items"("tenant_id");

-- ERP 销售订单
CREATE TABLE IF NOT EXISTS "erp_sale_order" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" TEXT,
    "account_id" TEXT,
    "sale_user_id" TEXT,
    "order_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "deposit_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "out_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_order_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "erp_sale_order" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_sale_order" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "sale_user_id" TEXT;
ALTER TABLE "erp_sale_order" ALTER COLUMN "sale_user_id" TYPE TEXT USING "sale_user_id"::TEXT;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "order_time" TIMESTAMP(3);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "deposit_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "out_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "return_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_order" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_order" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_order_tenant_id_idx" ON "erp_sale_order"("tenant_id");

-- ERP 销售订单项
CREATE TABLE IF NOT EXISTS "erp_sale_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "out_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_order_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_sale_order_items" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_sale_order_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_sale_order_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "out_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "return_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_order_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_order_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_order_items_tenant_id_idx" ON "erp_sale_order_items"("tenant_id");

-- ERP 销售出库
CREATE TABLE IF NOT EXISTS "erp_sale_out" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" TEXT,
    "account_id" TEXT,
    "sale_user_id" TEXT,
    "out_time" TIMESTAMP(3),
    "order_id" TEXT,
    "order_no" VARCHAR(255),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "receipt_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "other_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_out_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "erp_sale_out" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_sale_out" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "sale_user_id" TEXT;
ALTER TABLE "erp_sale_out" ALTER COLUMN "sale_user_id" TYPE TEXT USING "sale_user_id"::TEXT;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "out_time" TIMESTAMP(3);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_sale_out" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "order_no" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "receipt_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "other_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_out" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_out" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_out_tenant_id_idx" ON "erp_sale_out"("tenant_id");

-- ERP 销售出库项
CREATE TABLE IF NOT EXISTS "erp_sale_out_items" (
    "id" TEXT NOT NULL,
    "out_id" TEXT,
    "order_item_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_out_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "out_id" TEXT;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "out_id" TYPE TEXT USING "out_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "order_item_id" TEXT;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "order_item_id" TYPE TEXT USING "order_item_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_out_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_out_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_out_items_tenant_id_idx" ON "erp_sale_out_items"("tenant_id");

-- ERP 销售退货
CREATE TABLE IF NOT EXISTS "erp_sale_return" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" TEXT,
    "account_id" TEXT,
    "sale_user_id" TEXT,
    "return_time" TIMESTAMP(3),
    "order_id" TEXT,
    "order_no" VARCHAR(255),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "refund_price" DECIMAL(18,2),
    "total_product_price" DECIMAL(18,2),
    "total_tax_price" DECIMAL(18,2),
    "discount_percent" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "other_price" DECIMAL(18,2),
    "file_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_return_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "erp_sale_return" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "erp_sale_return" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "sale_user_id" TEXT;
ALTER TABLE "erp_sale_return" ALTER COLUMN "sale_user_id" TYPE TEXT USING "sale_user_id"::TEXT;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "return_time" TIMESTAMP(3);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "order_id" TEXT;
ALTER TABLE "erp_sale_return" ALTER COLUMN "order_id" TYPE TEXT USING "order_id"::TEXT;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "order_no" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "refund_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "total_product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "total_tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "discount_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "discount_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "other_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_return" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_return" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_return_tenant_id_idx" ON "erp_sale_return"("tenant_id");

-- ERP 销售退货项
CREATE TABLE IF NOT EXISTS "erp_sale_return_items" (
    "id" TEXT NOT NULL,
    "return_id" TEXT,
    "order_item_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_return_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "return_id" TEXT;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "return_id" TYPE TEXT USING "return_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "order_item_id" TEXT;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "order_item_id" TYPE TEXT USING "order_item_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "tax_price" DECIMAL(18,2);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_sale_return_items" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_sale_return_items" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_sale_return_items_tenant_id_idx" ON "erp_sale_return_items"("tenant_id");

-- ERP 产品库存
CREATE TABLE IF NOT EXISTS "erp_stock" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "warehouse_id" TEXT,
    "count" DECIMAL(18,2),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_stock" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_tenant_id_idx" ON "erp_stock"("tenant_id");

-- ERP 库存盘点单
CREATE TABLE IF NOT EXISTS "erp_stock_check" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "check_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_check_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "check_time" TIMESTAMP(3);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_check" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_check" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_check_tenant_id_idx" ON "erp_stock_check"("tenant_id");

-- ERP 库存盘点单项
CREATE TABLE IF NOT EXISTS "erp_stock_check_item" (
    "id" TEXT NOT NULL,
    "check_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "stock_count" DECIMAL(18,2),
    "actual_count" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_check_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "check_id" TEXT;
ALTER TABLE "erp_stock_check_item" ALTER COLUMN "check_id" TYPE TEXT USING "check_id"::TEXT;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_stock_check_item" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock_check_item" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_stock_check_item" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "stock_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "actual_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_check_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_check_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_check_item_tenant_id_idx" ON "erp_stock_check_item"("tenant_id");

-- ERP 其它入库单
CREATE TABLE IF NOT EXISTS "erp_stock_in" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "supplier_id" TEXT,
    "in_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_in_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;
ALTER TABLE "erp_stock_in" ALTER COLUMN "supplier_id" TYPE TEXT USING "supplier_id"::TEXT;
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "in_time" TIMESTAMP(3);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_in" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_in" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_in_tenant_id_idx" ON "erp_stock_in"("tenant_id");

-- ERP 其它入库单项
CREATE TABLE IF NOT EXISTS "erp_stock_in_item" (
    "id" TEXT NOT NULL,
    "in_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_in_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "in_id" TEXT;
ALTER TABLE "erp_stock_in_item" ALTER COLUMN "in_id" TYPE TEXT USING "in_id"::TEXT;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_stock_in_item" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock_in_item" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_stock_in_item" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_in_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_in_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_in_item_tenant_id_idx" ON "erp_stock_in_item"("tenant_id");

-- ERP 库存调拨单
CREATE TABLE IF NOT EXISTS "erp_stock_move" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "move_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_move_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "move_time" TIMESTAMP(3);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_move" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_move" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_move_tenant_id_idx" ON "erp_stock_move"("tenant_id");

-- ERP 库存调拨单项
CREATE TABLE IF NOT EXISTS "erp_stock_move_item" (
    "id" TEXT NOT NULL,
    "move_id" TEXT,
    "from_warehouse_id" TEXT,
    "to_warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_move_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "move_id" TEXT;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "move_id" TYPE TEXT USING "move_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "from_warehouse_id" TEXT;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "from_warehouse_id" TYPE TEXT USING "from_warehouse_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "to_warehouse_id" TEXT;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "to_warehouse_id" TYPE TEXT USING "to_warehouse_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_move_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_move_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_move_item_tenant_id_idx" ON "erp_stock_move_item"("tenant_id");

-- ERP 其它出库单
CREATE TABLE IF NOT EXISTS "erp_stock_out" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "customer_id" TEXT,
    "out_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_out_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "no" VARCHAR(255);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "customer_id" TEXT;
ALTER TABLE "erp_stock_out" ALTER COLUMN "customer_id" TYPE TEXT USING "customer_id"::TEXT;
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "out_time" TIMESTAMP(3);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "file_url" VARCHAR(255);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_out" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_out" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_out_tenant_id_idx" ON "erp_stock_out"("tenant_id");

-- ERP 其它出库单项
CREATE TABLE IF NOT EXISTS "erp_stock_out_item" (
    "id" TEXT NOT NULL,
    "out_id" TEXT,
    "warehouse_id" TEXT,
    "product_id" TEXT,
    "product_unit_id" TEXT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_out_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "out_id" TEXT;
ALTER TABLE "erp_stock_out_item" ALTER COLUMN "out_id" TYPE TEXT USING "out_id"::TEXT;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_stock_out_item" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock_out_item" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "product_unit_id" TEXT;
ALTER TABLE "erp_stock_out_item" ALTER COLUMN "product_unit_id" TYPE TEXT USING "product_unit_id"::TEXT;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "product_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "total_price" DECIMAL(18,2);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_out_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_out_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_out_item_tenant_id_idx" ON "erp_stock_out_item"("tenant_id");

-- ERP 产品库存明细
CREATE TABLE IF NOT EXISTS "erp_stock_record" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "warehouse_id" TEXT,
    "count" DECIMAL(18,2),
    "total_count" DECIMAL(18,2),
    "biz_type" INTEGER,
    "biz_id" TEXT,
    "biz_item_id" TEXT,
    "biz_no" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_record_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "product_id" TEXT;
ALTER TABLE "erp_stock_record" ALTER COLUMN "product_id" TYPE TEXT USING "product_id"::TEXT;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "warehouse_id" TEXT;
ALTER TABLE "erp_stock_record" ALTER COLUMN "warehouse_id" TYPE TEXT USING "warehouse_id"::TEXT;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "count" DECIMAL(18,2);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "total_count" DECIMAL(18,2);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "biz_type" INTEGER;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "biz_id" TEXT;
ALTER TABLE "erp_stock_record" ALTER COLUMN "biz_id" TYPE TEXT USING "biz_id"::TEXT;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "biz_item_id" TEXT;
ALTER TABLE "erp_stock_record" ALTER COLUMN "biz_item_id" TYPE TEXT USING "biz_item_id"::TEXT;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "biz_no" VARCHAR(255);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_stock_record" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_stock_record" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_stock_record_tenant_id_idx" ON "erp_stock_record"("tenant_id");

-- ERP 供应商
CREATE TABLE IF NOT EXISTS "erp_supplier" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "contact" VARCHAR(255),
    "mobile" VARCHAR(255),
    "telephone" VARCHAR(255),
    "email" VARCHAR(255),
    "fax" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" INTEGER,
    "sort" INTEGER,
    "tax_no" VARCHAR(255),
    "tax_percent" DECIMAL(18,2),
    "bank_name" VARCHAR(255),
    "bank_account" VARCHAR(255),
    "bank_address" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_supplier_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "contact" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "telephone" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "fax" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "tax_no" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "tax_percent" DECIMAL(18,2);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "bank_name" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "bank_account" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "bank_address" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_supplier" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_supplier" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_supplier_tenant_id_idx" ON "erp_supplier"("tenant_id");

-- ERP 仓库
CREATE TABLE IF NOT EXISTS "erp_warehouse" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "address" VARCHAR(255),
    "sort" BIGINT,
    "remark" VARCHAR(255),
    "principal" VARCHAR(255),
    "warehouse_price" DECIMAL(18,2),
    "truckage_price" DECIMAL(18,2),
    "status" INTEGER,
    "default_status" BOOLEAN,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_warehouse_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "sort" BIGINT;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "principal" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "warehouse_price" DECIMAL(18,2);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "truckage_price" DECIMAL(18,2);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "default_status" BOOLEAN;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "erp_warehouse" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "erp_warehouse" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "erp_warehouse_tenant_id_idx" ON "erp_warehouse"("tenant_id");
