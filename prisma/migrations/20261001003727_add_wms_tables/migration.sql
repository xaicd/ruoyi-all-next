-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/wms-tables.ts#WMS_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 智能仓库实体表
CREATE TABLE "wms_warehouse" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "capacity" INTEGER,
    "active" BOOLEAN NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_warehouse_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_warehouse_tenant_id_idx" ON "wms_warehouse"("tenant_id");

-- 物料与商品主数据表
CREATE TABLE "wms_item" (
    "id" TEXT NOT NULL,
    "item_code" VARCHAR(255) NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "category_id" VARCHAR(255),
    "brand_id" VARCHAR(255),
    "unit" VARCHAR(255),
    "spec" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_item_tenant_id_idx" ON "wms_item"("tenant_id");

-- 物料分类树表
CREATE TABLE "wms_item_category" (
    "id" TEXT NOT NULL,
    "parent_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "sort" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_item_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_item_category_tenant_id_idx" ON "wms_item_category"("tenant_id");

-- 物料品牌表
CREATE TABLE "wms_item_brand" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_item_brand_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_item_brand_tenant_id_idx" ON "wms_item_brand"("tenant_id");

-- 货主主数据表
CREATE TABLE "wms_merchant" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255),
    "contact_phone" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_merchant_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_merchant_tenant_id_idx" ON "wms_merchant"("tenant_id");

-- 入库单据表
CREATE TABLE "wms_receipt_order" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(255) NOT NULL,
    "receipt_type" VARCHAR(255) NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "merchant_id" VARCHAR(255),
    "total_qty" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_receipt_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_receipt_order_tenant_id_idx" ON "wms_receipt_order"("tenant_id");

-- 出库单据表
CREATE TABLE "wms_shipment_order" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(255) NOT NULL,
    "shipment_type" VARCHAR(255) NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "merchant_id" VARCHAR(255),
    "total_qty" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_shipment_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_shipment_order_tenant_id_idx" ON "wms_shipment_order"("tenant_id");

-- 移库单据表
CREATE TABLE "wms_movement_order" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(255) NOT NULL,
    "from_warehouse_id" VARCHAR(255) NOT NULL,
    "to_warehouse_id" VARCHAR(255) NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_movement_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_movement_order_tenant_id_idx" ON "wms_movement_order"("tenant_id");

-- 库存盘点单据表
CREATE TABLE "wms_check_order" (
    "id" TEXT NOT NULL,
    "order_no" VARCHAR(255) NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "check_type" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_check_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_check_order_tenant_id_idx" ON "wms_check_order"("tenant_id");

-- 实时库存主表
CREATE TABLE "wms_inventory" (
    "id" TEXT NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "merchant_id" VARCHAR(255),
    "qty" INTEGER NOT NULL,
    "locked_qty" INTEGER NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "update_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_inventory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_inventory_tenant_id_idx" ON "wms_inventory"("tenant_id");

-- 库存流水变动记录表
CREATE TABLE "wms_inventory_history" (
    "id" TEXT NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "change_type" VARCHAR(255) NOT NULL,
    "qty_change" INTEGER NOT NULL,
    "before_qty" INTEGER NOT NULL,
    "after_qty" INTEGER NOT NULL,
    "ref_order_no" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_inventory_history_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_inventory_history_tenant_id_idx" ON "wms_inventory_history"("tenant_id");

-- 入库单明细表
CREATE TABLE "wms_receipt_order_detail" (
    "id" TEXT NOT NULL,
    "receipt_order_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "plan_qty" INTEGER NOT NULL,
    "real_qty" INTEGER NOT NULL,
    "batch_no" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_receipt_order_detail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_receipt_order_detail_tenant_id_idx" ON "wms_receipt_order_detail"("tenant_id");

-- 出库单明细表
CREATE TABLE "wms_shipment_order_detail" (
    "id" TEXT NOT NULL,
    "shipment_order_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "plan_qty" INTEGER NOT NULL,
    "real_qty" INTEGER NOT NULL,
    "batch_no" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_shipment_order_detail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_shipment_order_detail_tenant_id_idx" ON "wms_shipment_order_detail"("tenant_id");

-- 移库单明细表
CREATE TABLE "wms_movement_order_detail" (
    "id" TEXT NOT NULL,
    "movement_order_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "qty" INTEGER NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_movement_order_detail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_movement_order_detail_tenant_id_idx" ON "wms_movement_order_detail"("tenant_id");

-- 盘点单明细表
CREATE TABLE "wms_check_order_detail" (
    "id" TEXT NOT NULL,
    "check_order_id" VARCHAR(255) NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "system_qty" INTEGER NOT NULL,
    "check_qty" INTEGER NOT NULL,
    "diff_qty" INTEGER NOT NULL,
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_check_order_detail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_check_order_detail_tenant_id_idx" ON "wms_check_order_detail"("tenant_id");

-- 物料SKU规格表
CREATE TABLE "wms_item_sku" (
    "id" TEXT NOT NULL,
    "item_id" VARCHAR(255) NOT NULL,
    "sku_code" VARCHAR(255) NOT NULL,
    "sku_name" VARCHAR(255) NOT NULL,
    "barcode" VARCHAR(255),
    "price" DECIMAL(18,4),
    "tenant_id" VARCHAR(64) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wms_item_sku_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "wms_item_sku_tenant_id_idx" ON "wms_item_sku"("tenant_id");
