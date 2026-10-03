-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/pay-source-tables.ts#PAY_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- PayApp（源框架导入）
CREATE TABLE "pay_app" (
    "id" TEXT NOT NULL,
    "app_key" VARCHAR(255),
    "name" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "order_notify_url" VARCHAR(255),
    "refund_notify_url" VARCHAR(255),
    "transfer_notify_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_app_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_app_tenant_id_idx" ON "pay_app"("tenant_id");

-- PayChannel（源框架导入）
CREATE TABLE "pay_channel" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "status" INTEGER,
    "fee_rate" DECIMAL(18,2),
    "remark" VARCHAR(255),
    "app_id" BIGINT,
    "config" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_channel_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_channel_tenant_id_idx" ON "pay_channel"("tenant_id");

-- PayDemoOrder（源框架导入）
CREATE TABLE "pay_demo_order" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "spu_id" BIGINT,
    "spu_name" VARCHAR(255),
    "price" INTEGER,
    "pay_status" BOOLEAN,
    "pay_order_id" BIGINT,
    "pay_time" TIMESTAMP(3),
    "pay_channel_code" VARCHAR(255),
    "pay_refund_id" BIGINT,
    "refund_price" INTEGER,
    "refund_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_demo_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_demo_order_tenant_id_idx" ON "pay_demo_order"("tenant_id");

-- PayDemoWithdraw（源框架导入）
CREATE TABLE "pay_demo_withdraw" (
    "id" TEXT NOT NULL,
    "subject" VARCHAR(255),
    "price" INTEGER,
    "user_account" VARCHAR(255),
    "user_name" VARCHAR(255),
    "type" INTEGER,
    "status" INTEGER,
    "pay_transfer_id" BIGINT,
    "transfer_channel_code" VARCHAR(255),
    "transfer_time" TIMESTAMP(3),
    "transfer_error_msg" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_demo_withdraw_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_demo_withdraw_tenant_id_idx" ON "pay_demo_withdraw"("tenant_id");

-- PayNotifyLog（源框架导入）
CREATE TABLE "pay_notify_log" (
    "id" TEXT NOT NULL,
    "task_id" BIGINT,
    "notify_times" INTEGER,
    "response" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_notify_log_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_notify_log_tenant_id_idx" ON "pay_notify_log"("tenant_id");

-- PayNotifyTask（源框架导入）
CREATE TABLE "pay_notify_task" (
    "id" TEXT NOT NULL,
    "app_id" BIGINT,
    "type" INTEGER,
    "data_id" BIGINT,
    "merchant_order_id" VARCHAR(255),
    "merchant_refund_id" VARCHAR(255),
    "merchant_transfer_id" VARCHAR(255),
    "status" INTEGER,
    "next_notify_time" TIMESTAMP(3),
    "last_execute_time" TIMESTAMP(3),
    "notify_times" INTEGER,
    "max_notify_times" INTEGER,
    "notify_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_notify_task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_notify_task_tenant_id_idx" ON "pay_notify_task"("tenant_id");

-- PayOrder（源框架导入）
CREATE TABLE "pay_order" (
    "id" TEXT NOT NULL,
    "app_id" BIGINT,
    "channel_id" BIGINT,
    "channel_code" VARCHAR(255),
    "user_id" BIGINT,
    "user_type" INTEGER,
    "merchant_order_id" VARCHAR(255),
    "subject" VARCHAR(255),
    "body" VARCHAR(255),
    "notify_url" VARCHAR(255),
    "price" INTEGER,
    "channel_fee_rate" DECIMAL(18,2),
    "channel_fee_price" INTEGER,
    "status" INTEGER,
    "user_ip" VARCHAR(255),
    "expire_time" TIMESTAMP(3),
    "success_time" TIMESTAMP(3),
    "extension_id" BIGINT,
    "no" VARCHAR(255),
    "refund_price" INTEGER,
    "channel_user_id" VARCHAR(255),
    "channel_order_no" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_order_tenant_id_idx" ON "pay_order"("tenant_id");

-- PayOrderExtension（源框架导入）
CREATE TABLE "pay_order_extension" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "order_id" BIGINT,
    "channel_id" BIGINT,
    "channel_code" VARCHAR(255),
    "user_ip" VARCHAR(255),
    "status" INTEGER,
    "channel_extras" TEXT,
    "channel_error_code" VARCHAR(255),
    "channel_error_msg" VARCHAR(255),
    "channel_notify_data" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_order_extension_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_order_extension_tenant_id_idx" ON "pay_order_extension"("tenant_id");

-- PayRefund（源框架导入）
CREATE TABLE "pay_refund" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "app_id" BIGINT,
    "channel_id" BIGINT,
    "channel_code" VARCHAR(255),
    "order_id" BIGINT,
    "order_no" VARCHAR(255),
    "user_id" BIGINT,
    "user_type" INTEGER,
    "merchant_order_id" VARCHAR(255),
    "merchant_refund_id" VARCHAR(255),
    "notify_url" VARCHAR(255),
    "status" INTEGER,
    "pay_price" INTEGER,
    "refund_price" INTEGER,
    "reason" VARCHAR(255),
    "user_ip" VARCHAR(255),
    "channel_order_no" VARCHAR(255),
    "channel_refund_no" VARCHAR(255),
    "success_time" TIMESTAMP(3),
    "channel_error_code" VARCHAR(255),
    "channel_error_msg" VARCHAR(255),
    "channel_notify_data" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_refund_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_refund_tenant_id_idx" ON "pay_refund"("tenant_id");

-- PayTransfer（源框架导入）
CREATE TABLE "pay_transfer" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "app_id" BIGINT,
    "channel_id" BIGINT,
    "channel_code" VARCHAR(255),
    "user_id" BIGINT,
    "user_type" INTEGER,
    "merchant_transfer_id" VARCHAR(255),
    "subject" VARCHAR(255),
    "price" INTEGER,
    "user_account" VARCHAR(255),
    "user_name" VARCHAR(255),
    "status" INTEGER,
    "success_time" TIMESTAMP(3),
    "notify_url" VARCHAR(255),
    "user_ip" VARCHAR(255),
    "channel_extras" TEXT,
    "channel_transfer_no" VARCHAR(255),
    "channel_error_code" VARCHAR(255),
    "channel_error_msg" VARCHAR(255),
    "channel_notify_data" VARCHAR(255),
    "channel_package_info" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_transfer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_transfer_tenant_id_idx" ON "pay_transfer"("tenant_id");

-- PayWallet（源框架导入）
CREATE TABLE "pay_wallet" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "user_type" INTEGER,
    "balance" INTEGER,
    "freeze_price" INTEGER,
    "total_expense" INTEGER,
    "total_recharge" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_wallet_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_wallet_tenant_id_idx" ON "pay_wallet"("tenant_id");

-- PayWalletRecharge（源框架导入）
CREATE TABLE "pay_wallet_recharge" (
    "id" TEXT NOT NULL,
    "wallet_id" BIGINT,
    "total_price" INTEGER,
    "pay_price" INTEGER,
    "bonus_price" INTEGER,
    "package_id" BIGINT,
    "pay_status" BOOLEAN,
    "pay_order_id" BIGINT,
    "pay_channel_code" VARCHAR(255),
    "pay_time" TIMESTAMP(3),
    "pay_refund_id" BIGINT,
    "refund_total_price" INTEGER,
    "refund_pay_price" INTEGER,
    "refund_bonus_price" INTEGER,
    "refund_time" TIMESTAMP(3),
    "refund_status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_wallet_recharge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_wallet_recharge_tenant_id_idx" ON "pay_wallet_recharge"("tenant_id");

-- PayWalletRechargePackage（源框架导入）
CREATE TABLE "pay_wallet_recharge_package" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "pay_price" INTEGER,
    "bonus_price" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_wallet_recharge_package_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_wallet_recharge_package_tenant_id_idx" ON "pay_wallet_recharge_package"("tenant_id");

-- PayWalletTransaction（源框架导入）
CREATE TABLE "pay_wallet_transaction" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "wallet_id" BIGINT,
    "biz_type" INTEGER,
    "biz_id" VARCHAR(255),
    "title" VARCHAR(255),
    "price" INTEGER,
    "balance" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pay_wallet_transaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "pay_wallet_transaction_tenant_id_idx" ON "pay_wallet_transaction"("tenant_id");
