-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/pay-source-tables.ts#PAY_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家等等不过一般来说，一个商户，只有一个应用哈~即 PayMerchantDO : PayAppDO = 1 : n
CREATE TABLE IF NOT EXISTS "pay_app" (
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
CREATE INDEX IF NOT EXISTS "pay_app_tenant_id_idx" ON "pay_app"("tenant_id");

-- 支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 PayAppDO : PayChannelDO = 1 : n
CREATE TABLE IF NOT EXISTS "pay_channel" (
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
CREATE INDEX IF NOT EXISTS "pay_channel_tenant_id_idx" ON "pay_channel"("tenant_id");

-- 示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款
CREATE TABLE IF NOT EXISTS "pay_demo_order" (
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
CREATE INDEX IF NOT EXISTS "pay_demo_order_tenant_id_idx" ON "pay_demo_order"("tenant_id");

-- 示例提现订单演示业务系统的转账业务
CREATE TABLE IF NOT EXISTS "pay_demo_withdraw" (
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
CREATE INDEX IF NOT EXISTS "pay_demo_withdraw_tenant_id_idx" ON "pay_demo_withdraw"("tenant_id");

-- 商户支付、退款等的通知 Log每次通知时，都会在该表中，记录一次 Log，方便排查问题
CREATE TABLE IF NOT EXISTS "pay_notify_log" (
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
CREATE INDEX IF NOT EXISTS "pay_notify_log_tenant_id_idx" ON "pay_notify_log"("tenant_id");

-- 支付通知在支付系统收到支付渠道的支付、退款的结果后，需要不断的通知到业务系统，直到成功。
CREATE TABLE IF NOT EXISTS "pay_notify_task" (
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
CREATE INDEX IF NOT EXISTS "pay_notify_task_tenant_id_idx" ON "pay_notify_task"("tenant_id");

-- 支付订单
CREATE TABLE IF NOT EXISTS "pay_order" (
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
CREATE INDEX IF NOT EXISTS "pay_order_tenant_id_idx" ON "pay_order"("tenant_id");

-- 支付订单拓展 DO每次调用支付渠道，都会生成一条对应记录
CREATE TABLE IF NOT EXISTS "pay_order_extension" (
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
CREATE INDEX IF NOT EXISTS "pay_order_extension_tenant_id_idx" ON "pay_order_extension"("tenant_id");

-- 支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO : PayRefundDO = 1 : n
CREATE TABLE IF NOT EXISTS "pay_refund" (
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
CREATE INDEX IF NOT EXISTS "pay_refund_tenant_id_idx" ON "pay_refund"("tenant_id");

-- 转账单
CREATE TABLE IF NOT EXISTS "pay_transfer" (
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
CREATE INDEX IF NOT EXISTS "pay_transfer_tenant_id_idx" ON "pay_transfer"("tenant_id");

-- 会员钱包
CREATE TABLE IF NOT EXISTS "pay_wallet" (
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
CREATE INDEX IF NOT EXISTS "pay_wallet_tenant_id_idx" ON "pay_wallet"("tenant_id");

-- 会员钱包充值
CREATE TABLE IF NOT EXISTS "pay_wallet_recharge" (
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
CREATE INDEX IF NOT EXISTS "pay_wallet_recharge_tenant_id_idx" ON "pay_wallet_recharge"("tenant_id");

-- 会员钱包充值套餐 DO通过充值套餐时，可以赠送一定金额；
CREATE TABLE IF NOT EXISTS "pay_wallet_recharge_package" (
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
CREATE INDEX IF NOT EXISTS "pay_wallet_recharge_package_tenant_id_idx" ON "pay_wallet_recharge_package"("tenant_id");

-- 会员钱包流水
CREATE TABLE IF NOT EXISTS "pay_wallet_transaction" (
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
CREATE INDEX IF NOT EXISTS "pay_wallet_transaction_tenant_id_idx" ON "pay_wallet_transaction"("tenant_id");
