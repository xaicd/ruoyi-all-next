-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/mall-source-tables.ts#MALL_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 商品品牌
CREATE TABLE IF NOT EXISTS "product_brand" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "sort" INTEGER,
    "description" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_brand_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_brand_tenant_id_idx" ON "product_brand"("tenant_id");

-- 商品浏览记录
CREATE TABLE IF NOT EXISTS "product_browse_history" (
    "id" TEXT NOT NULL,
    "spu_id" BIGINT,
    "user_id" BIGINT,
    "user_deleted" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_browse_history_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_browse_history_tenant_id_idx" ON "product_browse_history"("tenant_id");

-- 商品分类
CREATE TABLE IF NOT EXISTS "product_category" (
    "id" TEXT NOT NULL,
    "parent_id" BIGINT,
    "name" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_category_tenant_id_idx" ON "product_category"("tenant_id");

-- 商品评论
CREATE TABLE IF NOT EXISTS "product_comment" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "user_nickname" VARCHAR(255),
    "user_avatar" VARCHAR(255),
    "anonymous" BOOLEAN,
    "order_id" BIGINT,
    "order_item_id" BIGINT,
    "spu_id" BIGINT,
    "spu_name" VARCHAR(255),
    "sku_id" BIGINT,
    "sku_pic_url" VARCHAR(255),
    "sku_properties" TEXT,
    "visible" BOOLEAN,
    "scores" INTEGER,
    "description_scores" INTEGER,
    "benefit_scores" INTEGER,
    "content" VARCHAR(255),
    "pic_urls" TEXT,
    "reply_status" BOOLEAN,
    "reply_user_id" BIGINT,
    "reply_content" VARCHAR(255),
    "reply_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_comment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_comment_tenant_id_idx" ON "product_comment"("tenant_id");

-- 商品收藏
CREATE TABLE IF NOT EXISTS "product_favorite" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "spu_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_favorite_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_favorite_tenant_id_idx" ON "product_favorite"("tenant_id");

-- 商品属性项
CREATE TABLE IF NOT EXISTS "product_property" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_property_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_property_tenant_id_idx" ON "product_property"("tenant_id");

-- 商品属性值
CREATE TABLE IF NOT EXISTS "product_property_value" (
    "id" TEXT NOT NULL,
    "property_id" BIGINT,
    "name" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_property_value_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_property_value_tenant_id_idx" ON "product_property_value"("tenant_id");

-- 商品 SKU
CREATE TABLE IF NOT EXISTS "product_sku" (
    "id" TEXT NOT NULL,
    "spu_id" BIGINT,
    "properties" TEXT,
    "price" INTEGER,
    "market_price" INTEGER,
    "cost_price" INTEGER,
    "bar_code" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "stock" INTEGER,
    "weight" DECIMAL(18,2),
    "volume" DECIMAL(18,2),
    "first_brokerage_price" INTEGER,
    "second_brokerage_price" INTEGER,
    "sales_count" INTEGER,
    "property_id" BIGINT,
    "property_name" VARCHAR(255),
    "value_id" BIGINT,
    "value_name" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_sku_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_sku_tenant_id_idx" ON "product_sku"("tenant_id");

-- 商品 SPU
CREATE TABLE IF NOT EXISTS "product_spu" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "keyword" VARCHAR(255),
    "introduction" VARCHAR(255),
    "description" VARCHAR(255),
    "category_id" BIGINT,
    "brand_id" BIGINT,
    "pic_url" VARCHAR(255),
    "slider_pic_urls" TEXT,
    "sort" INTEGER,
    "status" INTEGER,
    "spec_type" BOOLEAN,
    "price" INTEGER,
    "market_price" INTEGER,
    "cost_price" INTEGER,
    "stock" INTEGER,
    "delivery_types" TEXT,
    "delivery_template_id" BIGINT,
    "give_integral" INTEGER,
    "sub_commission_type" BOOLEAN,
    "sales_count" INTEGER,
    "virtual_sales_count" INTEGER,
    "browse_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_spu_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_spu_tenant_id_idx" ON "product_spu"("tenant_id");

-- 商品统计
CREATE TABLE IF NOT EXISTS "product_statistics" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3),
    "spu_id" BIGINT,
    "browse_count" INTEGER,
    "browse_user_count" INTEGER,
    "favorite_count" INTEGER,
    "cart_count" INTEGER,
    "order_count" INTEGER,
    "order_pay_count" INTEGER,
    "order_pay_price" INTEGER,
    "after_sale_count" INTEGER,
    "after_sale_refund_price" INTEGER,
    "browse_convert_percent" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_statistics_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "product_statistics_tenant_id_idx" ON "product_statistics"("tenant_id");

-- 文章管理
CREATE TABLE IF NOT EXISTS "promotion_article" (
    "id" TEXT NOT NULL,
    "category_id" BIGINT,
    "spu_id" BIGINT,
    "title" VARCHAR(255),
    "author" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "introduction" VARCHAR(255),
    "browse_count" INTEGER,
    "sort" INTEGER,
    "status" INTEGER,
    "recommend_hot" BOOLEAN,
    "recommend_banner" BOOLEAN,
    "content" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_article_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_article_tenant_id_idx" ON "promotion_article"("tenant_id");

-- 文章分类
CREATE TABLE IF NOT EXISTS "promotion_article_category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "status" INTEGER,
    "sort" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_article_category_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_article_category_tenant_id_idx" ON "promotion_article_category"("tenant_id");

-- banner
CREATE TABLE IF NOT EXISTS "promotion_banner" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255),
    "url" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "position" INTEGER,
    "memo" VARCHAR(255),
    "browse_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_banner_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_banner_tenant_id_idx" ON "promotion_banner"("tenant_id");

-- 砍价活动
CREATE TABLE IF NOT EXISTS "promotion_bargain_activity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "status" INTEGER,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "bargain_first_price" INTEGER,
    "bargain_min_price" INTEGER,
    "stock" INTEGER,
    "total_stock" INTEGER,
    "help_max_count" INTEGER,
    "bargain_count" INTEGER,
    "total_limit_count" INTEGER,
    "random_min_price" INTEGER,
    "random_max_price" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_bargain_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_bargain_activity_tenant_id_idx" ON "promotion_bargain_activity"("tenant_id");

-- 砍价助力
CREATE TABLE IF NOT EXISTS "promotion_bargain_help" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "record_id" BIGINT,
    "user_id" BIGINT,
    "reduce_price" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_bargain_help_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_bargain_help_tenant_id_idx" ON "promotion_bargain_help"("tenant_id");

-- 砍价记录 DO TO
CREATE TABLE IF NOT EXISTS "promotion_bargain_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "activity_id" BIGINT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "bargain_first_price" INTEGER,
    "bargain_price" INTEGER,
    "status" INTEGER,
    "end_time" TIMESTAMP(3),
    "order_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_bargain_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_bargain_record_tenant_id_idx" ON "promotion_bargain_record"("tenant_id");

-- 拼团活动
CREATE TABLE IF NOT EXISTS "promotion_combination_activity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "spu_id" BIGINT,
    "total_limit_count" INTEGER,
    "single_limit_count" INTEGER,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "user_size" INTEGER,
    "virtual_group" BOOLEAN,
    "status" INTEGER,
    "limit_duration" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_combination_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_combination_activity_tenant_id_idx" ON "promotion_combination_activity"("tenant_id");

-- 拼团商品
CREATE TABLE IF NOT EXISTS "promotion_combination_product" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "combination_price" INTEGER,
    "activity_status" INTEGER,
    "activity_start_time" TIMESTAMP(3),
    "activity_end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_combination_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_combination_product_tenant_id_idx" ON "promotion_combination_product"("tenant_id");

-- 拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人的拼团记录，通过 关联
CREATE TABLE IF NOT EXISTS "promotion_combination_record" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "combination_price" INTEGER,
    "spu_id" BIGINT,
    "spu_name" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "sku_id" BIGINT,
    "count" INTEGER,
    "user_id" BIGINT,
    "nickname" VARCHAR(255),
    "avatar" VARCHAR(255),
    "head_id" BIGINT,
    "status" INTEGER,
    "order_id" BIGINT,
    "user_size" INTEGER,
    "user_count" INTEGER,
    "virtual_group" BOOLEAN,
    "expire_time" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_combination_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_combination_record_tenant_id_idx" ON "promotion_combination_record"("tenant_id");

-- 优惠劵
CREATE TABLE IF NOT EXISTS "promotion_coupon" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "name" VARCHAR(255),
    "status" INTEGER,
    "user_id" BIGINT,
    "take_type" INTEGER,
    "use_price" INTEGER,
    "valid_start_time" TIMESTAMP(3),
    "valid_end_time" TIMESTAMP(3),
    "product_scope" INTEGER,
    "product_scope_values" TEXT,
    "discount_type" INTEGER,
    "discount_percent" INTEGER,
    "discount_price" INTEGER,
    "discount_limit_price" INTEGER,
    "use_order_id" BIGINT,
    "use_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_coupon_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_coupon_tenant_id_idx" ON "promotion_coupon"("tenant_id");

-- 优惠劵模板 DO当用户领取时，会生成 优惠劵
CREATE TABLE IF NOT EXISTS "promotion_coupon_template" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "status" INTEGER,
    "total_count" INTEGER,
    "take_limit_count" INTEGER,
    "take_type" INTEGER,
    "use_price" INTEGER,
    "product_scope" INTEGER,
    "product_scope_values" TEXT,
    "validity_type" INTEGER,
    "valid_start_time" TIMESTAMP(3),
    "valid_end_time" TIMESTAMP(3),
    "fixed_start_term" INTEGER,
    "fixed_end_term" INTEGER,
    "discount_type" INTEGER,
    "discount_percent" INTEGER,
    "discount_price" INTEGER,
    "discount_limit_price" INTEGER,
    "take_count" INTEGER,
    "use_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_coupon_template_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_coupon_template_tenant_id_idx" ON "promotion_coupon_template"("tenant_id");

-- 限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；
CREATE TABLE IF NOT EXISTS "promotion_discount_activity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_discount_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_discount_activity_tenant_id_idx" ON "promotion_discount_activity"("tenant_id");

-- 限时折扣商品
CREATE TABLE IF NOT EXISTS "promotion_discount_product" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "discount_type" INTEGER,
    "discount_percent" INTEGER,
    "discount_price" INTEGER,
    "activity_name" VARCHAR(255),
    "activity_status" INTEGER,
    "activity_start_time" TIMESTAMP(3),
    "activity_end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_discount_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_discount_product_tenant_id_idx" ON "promotion_discount_product"("tenant_id");

-- 装修页面
CREATE TABLE IF NOT EXISTS "promotion_diy_page" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "name" VARCHAR(255),
    "remark" VARCHAR(255),
    "preview_pic_urls" TEXT,
    "property" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_diy_page_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_diy_page_tenant_id_idx" ON "promotion_diy_page"("tenant_id");

-- 装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个
CREATE TABLE IF NOT EXISTS "promotion_diy_template" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "used" BOOLEAN,
    "used_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "preview_pic_urls" TEXT,
    "property" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_diy_template_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_diy_template_tenant_id_idx" ON "promotion_diy_template"("tenant_id");

-- 客服会话
CREATE TABLE IF NOT EXISTS "promotion_kefu_conversation" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "last_message_time" TIMESTAMP(3),
    "last_message_content" VARCHAR(255),
    "last_message_content_type" INTEGER,
    "admin_pinned" BOOLEAN,
    "user_deleted" BOOLEAN,
    "admin_deleted" BOOLEAN,
    "admin_unread_message_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_kefu_conversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_kefu_conversation_tenant_id_idx" ON "promotion_kefu_conversation"("tenant_id");

-- 客服消息
CREATE TABLE IF NOT EXISTS "promotion_kefu_message" (
    "id" TEXT NOT NULL,
    "conversation_id" BIGINT,
    "sender_id" BIGINT,
    "sender_type" INTEGER,
    "receiver_id" BIGINT,
    "receiver_type" INTEGER,
    "content_type" INTEGER,
    "content" VARCHAR(255),
    "read_status" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_kefu_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_kefu_message_tenant_id_idx" ON "promotion_kefu_message"("tenant_id");

-- 积分商城活动
CREATE TABLE IF NOT EXISTS "promotion_point_activity" (
    "id" TEXT NOT NULL,
    "spu_id" BIGINT,
    "status" INTEGER,
    "remark" VARCHAR(255),
    "sort" INTEGER,
    "stock" INTEGER,
    "total_stock" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_point_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_point_activity_tenant_id_idx" ON "promotion_point_activity"("tenant_id");

-- 积分商城商品
CREATE TABLE IF NOT EXISTS "promotion_point_product" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "count" INTEGER,
    "point" INTEGER,
    "price" INTEGER,
    "stock" INTEGER,
    "activity_status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_point_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_point_product_tenant_id_idx" ON "promotion_point_product"("tenant_id");

-- 满减送活动
CREATE TABLE IF NOT EXISTS "promotion_reward_activity" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" INTEGER,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
    "condition_type" INTEGER,
    "product_scope" INTEGER,
    "product_scope_values" TEXT,
    "rules" TEXT,
    "limit" INTEGER,
    "discount_price" INTEGER,
    "free_delivery" BOOLEAN,
    "point" INTEGER,
    "give_coupon_template_counts" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_reward_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_reward_activity_tenant_id_idx" ON "promotion_reward_activity"("tenant_id");

-- 秒杀活动
CREATE TABLE IF NOT EXISTS "promotion_seckill_activity" (
    "id" TEXT NOT NULL,
    "spu_id" BIGINT,
    "name" VARCHAR(255),
    "status" INTEGER,
    "remark" VARCHAR(255),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "sort" INTEGER,
    "config_ids" TEXT,
    "total_limit_count" INTEGER,
    "single_limit_count" INTEGER,
    "stock" INTEGER,
    "total_stock" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_seckill_activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_seckill_activity_tenant_id_idx" ON "promotion_seckill_activity"("tenant_id");

-- 秒杀时段
CREATE TABLE IF NOT EXISTS "promotion_seckill_config" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "start_time" VARCHAR(255),
    "end_time" VARCHAR(255),
    "slider_pic_urls" TEXT,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_seckill_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_seckill_config_tenant_id_idx" ON "promotion_seckill_config"("tenant_id");

-- 秒杀参与商品
CREATE TABLE IF NOT EXISTS "promotion_seckill_product" (
    "id" TEXT NOT NULL,
    "activity_id" BIGINT,
    "config_ids" TEXT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "seckill_price" INTEGER,
    "stock" INTEGER,
    "activity_status" INTEGER,
    "activity_start_time" TIMESTAMP(3),
    "activity_end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "promotion_seckill_product_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotion_seckill_product_tenant_id_idx" ON "promotion_seckill_product"("tenant_id");

-- 售后订单，用于处理 交易订单的退款退货流程
CREATE TABLE IF NOT EXISTS "trade_after_sale" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "status" INTEGER,
    "way" INTEGER,
    "type" INTEGER,
    "user_id" BIGINT,
    "apply_reason" VARCHAR(255),
    "apply_description" VARCHAR(255),
    "apply_pic_urls" TEXT,
    "order_id" BIGINT,
    "order_no" VARCHAR(255),
    "order_item_id" BIGINT,
    "spu_id" BIGINT,
    "spu_name" VARCHAR(255),
    "sku_id" BIGINT,
    "properties" TEXT,
    "pic_url" VARCHAR(255),
    "count" INTEGER,
    "audit_time" TIMESTAMP(3),
    "audit_user_id" BIGINT,
    "audit_reason" VARCHAR(255),
    "refund_price" INTEGER,
    "pay_refund_id" BIGINT,
    "refund_time" TIMESTAMP(3),
    "logistics_id" BIGINT,
    "logistics_no" VARCHAR(255),
    "delivery_time" TIMESTAMP(3),
    "receive_time" TIMESTAMP(3),
    "receive_reason" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_after_sale_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_after_sale_tenant_id_idx" ON "trade_after_sale"("tenant_id");

-- 交易售后日志
CREATE TABLE IF NOT EXISTS "trade_after_sale_log" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "user_type" INTEGER,
    "after_sale_id" BIGINT,
    "before_status" INTEGER,
    "after_status" INTEGER,
    "operate_type" INTEGER,
    "content" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_after_sale_log_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_after_sale_log_tenant_id_idx" ON "trade_after_sale_log"("tenant_id");

-- 佣金记录
CREATE TABLE IF NOT EXISTS "trade_brokerage_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "biz_id" VARCHAR(255),
    "biz_type" INTEGER,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "price" INTEGER,
    "total_price" INTEGER,
    "status" INTEGER,
    "frozen_days" INTEGER,
    "unfreeze_time" TIMESTAMP(3),
    "source_user_level" INTEGER,
    "source_user_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_brokerage_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_brokerage_record_tenant_id_idx" ON "trade_brokerage_record"("tenant_id");

-- 分销用户
CREATE TABLE IF NOT EXISTS "trade_brokerage_user" (
    "id" TEXT NOT NULL,
    "bind_user_id" BIGINT,
    "bind_user_time" TIMESTAMP(3),
    "brokerage_enabled" BOOLEAN,
    "brokerage_time" TIMESTAMP(3),
    "brokerage_price" INTEGER,
    "frozen_price" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_brokerage_user_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_brokerage_user_tenant_id_idx" ON "trade_brokerage_user"("tenant_id");

-- 佣金提现
CREATE TABLE IF NOT EXISTS "trade_brokerage_withdraw" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "price" INTEGER,
    "fee_price" INTEGER,
    "total_price" INTEGER,
    "type" INTEGER,
    "user_name" VARCHAR(255),
    "user_account" VARCHAR(255),
    "qr_code_url" VARCHAR(255),
    "bank_name" VARCHAR(255),
    "bank_address" VARCHAR(255),
    "status" INTEGER,
    "audit_reason" VARCHAR(255),
    "audit_time" TIMESTAMP(3),
    "remark" VARCHAR(255),
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
    CONSTRAINT "trade_brokerage_withdraw_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_brokerage_withdraw_tenant_id_idx" ON "trade_brokerage_withdraw"("tenant_id");

-- 购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联
CREATE TABLE IF NOT EXISTS "trade_cart" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "spu_id" BIGINT,
    "sku_id" BIGINT,
    "count" INTEGER,
    "selected" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_cart_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_cart_tenant_id_idx" ON "trade_cart"("tenant_id");

-- 交易中心配置
CREATE TABLE IF NOT EXISTS "trade_config" (
    "id" TEXT NOT NULL,
    "after_sale_refund_reasons" TEXT,
    "after_sale_return_reasons" TEXT,
    "delivery_express_free_enabled" BOOLEAN,
    "delivery_express_free_price" INTEGER,
    "delivery_pick_up_enabled" BOOLEAN,
    "brokerage_enabled" BOOLEAN,
    "brokerage_enabled_condition" INTEGER,
    "brokerage_bind_mode" INTEGER,
    "brokerage_poster_urls" TEXT,
    "brokerage_first_percent" INTEGER,
    "brokerage_second_percent" INTEGER,
    "brokerage_withdraw_min_price" INTEGER,
    "brokerage_withdraw_fee_percent" INTEGER,
    "brokerage_frozen_days" INTEGER,
    "brokerage_withdraw_types" TEXT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_config_tenant_id_idx" ON "trade_config"("tenant_id");

-- 快递公司
CREATE TABLE IF NOT EXISTS "trade_delivery_express" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "logo" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_delivery_express_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_delivery_express_tenant_id_idx" ON "trade_delivery_express"("tenant_id");

-- 快递运费模板
CREATE TABLE IF NOT EXISTS "trade_delivery_express_template" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "charge_mode" INTEGER,
    "sort" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_delivery_express_template_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_delivery_express_template_tenant_id_idx" ON "trade_delivery_express_template"("tenant_id");

-- 快递运费模板计费配置
CREATE TABLE IF NOT EXISTS "trade_delivery_express_template_charge" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "area_ids" TEXT,
    "charge_mode" INTEGER,
    "start_count" DECIMAL(18,2),
    "start_price" INTEGER,
    "extra_count" DECIMAL(18,2),
    "extra_price" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_delivery_express_template_charge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_delivery_express_template_charge_tenant_id_idx" ON "trade_delivery_express_template_charge"("tenant_id");

-- 快递运费模板包邮配置
CREATE TABLE IF NOT EXISTS "trade_delivery_express_template_free" (
    "id" TEXT NOT NULL,
    "template_id" BIGINT,
    "area_ids" TEXT,
    "free_price" INTEGER,
    "free_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_delivery_express_template_free_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_delivery_express_template_free_tenant_id_idx" ON "trade_delivery_express_template_free"("tenant_id");

-- 自提门店
CREATE TABLE IF NOT EXISTS "trade_delivery_pick_up_store" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "introduction" VARCHAR(255),
    "phone" VARCHAR(255),
    "area_id" INTEGER,
    "detail_address" VARCHAR(255),
    "logo" VARCHAR(255),
    "opening_time" VARCHAR(255),
    "closing_time" VARCHAR(255),
    "latitude" DECIMAL(18,2),
    "longitude" DECIMAL(18,2),
    "verify_user_ids" TEXT,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_delivery_pick_up_store_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_delivery_pick_up_store_tenant_id_idx" ON "trade_delivery_pick_up_store"("tenant_id");

-- 交易订单
CREATE TABLE IF NOT EXISTS "trade_order" (
    "id" TEXT NOT NULL,
    "no" VARCHAR(255),
    "type" INTEGER,
    "terminal" INTEGER,
    "user_id" BIGINT,
    "user_ip" VARCHAR(255),
    "user_remark" VARCHAR(255),
    "status" INTEGER,
    "product_count" INTEGER,
    "finish_time" TIMESTAMP(3),
    "cancel_time" TIMESTAMP(3),
    "cancel_type" INTEGER,
    "remark" VARCHAR(255),
    "comment_status" BOOLEAN,
    "brokerage_user_id" BIGINT,
    "pay_order_id" BIGINT,
    "pay_status" BOOLEAN,
    "pay_time" TIMESTAMP(3),
    "pay_channel_code" VARCHAR(255),
    "total_price" INTEGER,
    "discount_price" INTEGER,
    "delivery_price" INTEGER,
    "adjust_price" INTEGER,
    "pay_price" INTEGER,
    "delivery_type" INTEGER,
    "logistics_id" BIGINT,
    "logistics_no" VARCHAR(255),
    "delivery_time" TIMESTAMP(3),
    "receive_time" TIMESTAMP(3),
    "receiver_name" VARCHAR(255),
    "receiver_mobile" VARCHAR(255),
    "receiver_area_id" INTEGER,
    "receiver_detail_address" VARCHAR(255),
    "pick_up_store_id" BIGINT,
    "pick_up_verify_code" VARCHAR(255),
    "refund_status" INTEGER,
    "refund_price" INTEGER,
    "coupon_id" BIGINT,
    "coupon_price" INTEGER,
    "use_point" INTEGER,
    "point_price" INTEGER,
    "give_point" INTEGER,
    "refund_point" INTEGER,
    "vip_price" INTEGER,
    "give_coupon_template_counts" TEXT,
    "give_coupon_ids" TEXT,
    "seckill_activity_id" BIGINT,
    "bargain_activity_id" BIGINT,
    "bargain_record_id" BIGINT,
    "combination_activity_id" BIGINT,
    "combination_head_id" BIGINT,
    "combination_record_id" BIGINT,
    "point_activity_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_order_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_order_tenant_id_idx" ON "trade_order"("tenant_id");

-- 交易订单项
CREATE TABLE IF NOT EXISTS "trade_order_item" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "order_id" BIGINT,
    "cart_id" BIGINT,
    "spu_id" BIGINT,
    "spu_name" VARCHAR(255),
    "sku_id" BIGINT,
    "properties" TEXT,
    "pic_url" VARCHAR(255),
    "count" INTEGER,
    "comment_status" BOOLEAN,
    "price" INTEGER,
    "discount_price" INTEGER,
    "delivery_price" INTEGER,
    "adjust_price" INTEGER,
    "pay_price" INTEGER,
    "coupon_price" INTEGER,
    "point_price" INTEGER,
    "use_point" INTEGER,
    "give_point" INTEGER,
    "vip_price" INTEGER,
    "after_sale_id" BIGINT,
    "after_sale_status" INTEGER,
    "property_id" BIGINT,
    "property_name" VARCHAR(255),
    "value_id" BIGINT,
    "value_name" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_order_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_order_item_tenant_id_idx" ON "trade_order_item"("tenant_id");

-- 订单日志
CREATE TABLE IF NOT EXISTS "trade_order_log" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "user_type" INTEGER,
    "order_id" BIGINT,
    "before_status" INTEGER,
    "after_status" INTEGER,
    "operate_type" INTEGER,
    "content" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_order_log_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_order_log_tenant_id_idx" ON "trade_order_log"("tenant_id");

-- 交易统计 DO以天为维度，统计全部的数据
CREATE TABLE IF NOT EXISTS "trade_statistics" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3),
    "order_create_count" INTEGER,
    "order_pay_count" INTEGER,
    "order_pay_price" INTEGER,
    "after_sale_count" INTEGER,
    "after_sale_refund_price" INTEGER,
    "brokerage_settlement_price" INTEGER,
    "wallet_pay_price" INTEGER,
    "recharge_pay_count" INTEGER,
    "recharge_pay_price" INTEGER,
    "recharge_refund_count" INTEGER,
    "recharge_refund_price" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "trade_statistics_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "trade_statistics_tenant_id_idx" ON "trade_statistics"("tenant_id");
