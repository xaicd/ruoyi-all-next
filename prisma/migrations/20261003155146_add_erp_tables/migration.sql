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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_account_pkey" PRIMARY KEY ("id")
);
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_customer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_customer_tenant_id_idx" ON "erp_customer"("tenant_id");

-- ERP 付款单
CREATE TABLE IF NOT EXISTS "erp_finance_payment" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "payment_time" TIMESTAMP(3),
    "finance_user_id" BIGINT,
    "supplier_id" BIGINT,
    "account_id" BIGINT,
    "total_price" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "payment_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_payment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_finance_payment_tenant_id_idx" ON "erp_finance_payment"("tenant_id");

-- ERP 付款项
CREATE TABLE IF NOT EXISTS "erp_finance_payment_item" (
    "id" TEXT NOT NULL,
    "payment_id" BIGINT,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "biz_no" VARCHAR(255),
    "total_price" DECIMAL(18,2),
    "paid_price" DECIMAL(18,2),
    "payment_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_payment_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_finance_payment_item_tenant_id_idx" ON "erp_finance_payment_item"("tenant_id");

-- ERP 收款单
CREATE TABLE IF NOT EXISTS "erp_finance_receipt" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "receipt_time" TIMESTAMP(3),
    "finance_user_id" BIGINT,
    "customer_id" BIGINT,
    "account_id" BIGINT,
    "total_price" DECIMAL(18,2),
    "discount_price" DECIMAL(18,2),
    "receipt_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_receipt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_finance_receipt_tenant_id_idx" ON "erp_finance_receipt"("tenant_id");

-- ERP 收款项
CREATE TABLE IF NOT EXISTS "erp_finance_receipt_item" (
    "id" TEXT NOT NULL,
    "receipt_id" BIGINT,
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "biz_no" VARCHAR(255),
    "total_price" DECIMAL(18,2),
    "receipted_price" DECIMAL(18,2),
    "receipt_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_finance_receipt_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_finance_receipt_item_tenant_id_idx" ON "erp_finance_receipt_item"("tenant_id");

-- ERP 产品
CREATE TABLE IF NOT EXISTS "erp_product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "bar_code" VARCHAR(255),
    "category_id" BIGINT,
    "unit_id" BIGINT,
    "status" INTEGER,
    "standard" VARCHAR(255),
    "remark" VARCHAR(255),
    "expiry_day" INTEGER,
    "weight" DECIMAL(18,2),
    "purchase_price" DECIMAL(18,2),
    "sale_price" DECIMAL(18,2),
    "min_price" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_product_tenant_id_idx" ON "erp_product"("tenant_id");

-- ERP 产品分类
CREATE TABLE IF NOT EXISTS "erp_product_category" (
    "id" TEXT NOT NULL,
    "parent_id" BIGINT,
    "name" VARCHAR(255),
    "code" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_product_category_tenant_id_idx" ON "erp_product_category"("tenant_id");

-- ERP 产品单位
CREATE TABLE IF NOT EXISTS "erp_product_unit" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_product_unit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_product_unit_tenant_id_idx" ON "erp_product_unit"("tenant_id");

-- ERP 采购入库
CREATE TABLE IF NOT EXISTS "erp_purchase_in" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" BIGINT,
    "account_id" BIGINT,
    "in_time" TIMESTAMP(3),
    "order_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_in_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_in_tenant_id_idx" ON "erp_purchase_in"("tenant_id");

-- ERP 采购入库项
CREATE TABLE IF NOT EXISTS "erp_purchase_in_items" (
    "id" TEXT NOT NULL,
    "in_id" BIGINT,
    "order_item_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_in_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_in_items_tenant_id_idx" ON "erp_purchase_in_items"("tenant_id");

-- ERP 采购订单
CREATE TABLE IF NOT EXISTS "erp_purchase_order" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" BIGINT,
    "account_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_order_tenant_id_idx" ON "erp_purchase_order"("tenant_id");

-- ERP 采购订单项
CREATE TABLE IF NOT EXISTS "erp_purchase_order_items" (
    "id" TEXT NOT NULL,
    "order_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "in_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_order_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_order_items_tenant_id_idx" ON "erp_purchase_order_items"("tenant_id");

-- ERP 采购退货
CREATE TABLE IF NOT EXISTS "erp_purchase_return" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "supplier_id" BIGINT,
    "account_id" BIGINT,
    "return_time" TIMESTAMP(3),
    "order_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_return_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_return_tenant_id_idx" ON "erp_purchase_return"("tenant_id");

-- ERP 采购退货项
CREATE TABLE IF NOT EXISTS "erp_purchase_return_items" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "order_item_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_purchase_return_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_purchase_return_items_tenant_id_idx" ON "erp_purchase_return_items"("tenant_id");

-- ERP 销售订单
CREATE TABLE IF NOT EXISTS "erp_sale_order" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" BIGINT,
    "account_id" BIGINT,
    "sale_user_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_order_tenant_id_idx" ON "erp_sale_order"("tenant_id");

-- ERP 销售订单项
CREATE TABLE IF NOT EXISTS "erp_sale_order_items" (
    "id" TEXT NOT NULL,
    "order_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "out_count" DECIMAL(18,2),
    "return_count" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_order_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_order_items_tenant_id_idx" ON "erp_sale_order_items"("tenant_id");

-- ERP 销售出库
CREATE TABLE IF NOT EXISTS "erp_sale_out" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" BIGINT,
    "account_id" BIGINT,
    "sale_user_id" BIGINT,
    "out_time" TIMESTAMP(3),
    "order_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_out_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_out_tenant_id_idx" ON "erp_sale_out"("tenant_id");

-- ERP 销售出库项
CREATE TABLE IF NOT EXISTS "erp_sale_out_items" (
    "id" TEXT NOT NULL,
    "out_id" BIGINT,
    "order_item_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_out_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_out_items_tenant_id_idx" ON "erp_sale_out_items"("tenant_id");

-- ERP 销售退货
CREATE TABLE IF NOT EXISTS "erp_sale_return" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "customer_id" BIGINT,
    "account_id" BIGINT,
    "sale_user_id" BIGINT,
    "return_time" TIMESTAMP(3),
    "order_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_return_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_return_tenant_id_idx" ON "erp_sale_return"("tenant_id");

-- ERP 销售退货项
CREATE TABLE IF NOT EXISTS "erp_sale_return_items" (
    "id" TEXT NOT NULL,
    "return_id" BIGINT,
    "order_item_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "tax_percent" DECIMAL(18,2),
    "tax_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_sale_return_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_sale_return_items_tenant_id_idx" ON "erp_sale_return_items"("tenant_id");

-- ERP 产品库存
CREATE TABLE IF NOT EXISTS "erp_stock" (
    "id" TEXT NOT NULL,
    "product_id" BIGINT,
    "warehouse_id" BIGINT,
    "count" DECIMAL(18,2),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_pkey" PRIMARY KEY ("id")
);
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_check_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_check_tenant_id_idx" ON "erp_stock_check"("tenant_id");

-- ERP 库存盘点单项
CREATE TABLE IF NOT EXISTS "erp_stock_check_item" (
    "id" TEXT NOT NULL,
    "check_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "stock_count" DECIMAL(18,2),
    "actual_count" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_check_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_check_item_tenant_id_idx" ON "erp_stock_check_item"("tenant_id");

-- ERP 其它入库单
CREATE TABLE IF NOT EXISTS "erp_stock_in" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "supplier_id" BIGINT,
    "in_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_in_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_in_tenant_id_idx" ON "erp_stock_in"("tenant_id");

-- ERP 其它入库单项
CREATE TABLE IF NOT EXISTS "erp_stock_in_item" (
    "id" TEXT NOT NULL,
    "in_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_in_item_pkey" PRIMARY KEY ("id")
);
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_move_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_move_tenant_id_idx" ON "erp_stock_move"("tenant_id");

-- ERP 库存调拨单项
CREATE TABLE IF NOT EXISTS "erp_stock_move_item" (
    "id" TEXT NOT NULL,
    "move_id" BIGINT,
    "from_warehouse_id" BIGINT,
    "to_warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_move_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_move_item_tenant_id_idx" ON "erp_stock_move_item"("tenant_id");

-- ERP 其它出库单
CREATE TABLE IF NOT EXISTS "erp_stock_out" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "customer_id" BIGINT,
    "out_time" TIMESTAMP(3),
    "total_count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "file_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_out_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_out_tenant_id_idx" ON "erp_stock_out"("tenant_id");

-- ERP 其它出库单项
CREATE TABLE IF NOT EXISTS "erp_stock_out_item" (
    "id" TEXT NOT NULL,
    "out_id" BIGINT,
    "warehouse_id" BIGINT,
    "product_id" BIGINT,
    "product_unit_id" BIGINT,
    "product_price" DECIMAL(18,2),
    "count" DECIMAL(18,2),
    "total_price" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_out_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_stock_out_item_tenant_id_idx" ON "erp_stock_out_item"("tenant_id");

-- ERP 产品库存明细
CREATE TABLE IF NOT EXISTS "erp_stock_record" (
    "id" TEXT NOT NULL,
    "product_id" BIGINT,
    "warehouse_id" BIGINT,
    "count" DECIMAL(18,2),
    "total_count" DECIMAL(18,2),
    "biz_type" INTEGER,
    "biz_id" BIGINT,
    "biz_item_id" BIGINT,
    "biz_no" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_stock_record_pkey" PRIMARY KEY ("id")
);
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_supplier_pkey" PRIMARY KEY ("id")
);
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "erp_warehouse_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "erp_warehouse_tenant_id_idx" ON "erp_warehouse"("tenant_id");
