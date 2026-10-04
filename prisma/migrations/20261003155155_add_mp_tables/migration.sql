-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/mp-source-tables.ts#MP_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 公众号账号
CREATE TABLE IF NOT EXISTS "mp_account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "account" VARCHAR(255),
    "app_id" VARCHAR(255),
    "app_secret" VARCHAR(255),
    "token" VARCHAR(255),
    "aes_key" VARCHAR(255),
    "qr_code_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_account_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_account_tenant_id_idx" ON "mp_account"("tenant_id");

-- 公众号消息自动回复
CREATE TABLE IF NOT EXISTS "mp_auto_reply" (
    "id" TEXT NOT NULL,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "type" INTEGER,
    "request_keyword" VARCHAR(255),
    "request_match" INTEGER,
    "request_message_type" VARCHAR(255),
    "response_message_type" VARCHAR(255),
    "response_content" VARCHAR(255),
    "response_media_id" VARCHAR(255),
    "response_media_url" VARCHAR(255),
    "response_title" VARCHAR(255),
    "response_description" VARCHAR(255),
    "response_thumb_media_id" VARCHAR(255),
    "response_thumb_media_url" VARCHAR(255),
    "response_articles" TEXT,
    "response_music_url" VARCHAR(255),
    "response_hq_music_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_auto_reply_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_auto_reply_tenant_id_idx" ON "mp_auto_reply"("tenant_id");

-- 公众号素材 DO1. a href=https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/New_temporary_
CREATE TABLE IF NOT EXISTS "mp_material" (
    "id" TEXT NOT NULL,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "media_id" VARCHAR(255),
    "type" VARCHAR(255),
    "permanent" BOOLEAN,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "mp_url" VARCHAR(255),
    "title" VARCHAR(255),
    "introduction" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_material_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_material_tenant_id_idx" ON "mp_material"("tenant_id");

-- 公众号菜单
CREATE TABLE IF NOT EXISTS "mp_menu" (
    "id" TEXT NOT NULL,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "name" VARCHAR(255),
    "menu_key" VARCHAR(255),
    "parent_id" BIGINT,
    "type" VARCHAR(255),
    "url" VARCHAR(255),
    "mini_program_app_id" VARCHAR(255),
    "mini_program_page_path" VARCHAR(255),
    "article_id" VARCHAR(255),
    "reply_message_type" VARCHAR(255),
    "reply_content" VARCHAR(255),
    "reply_media_id" VARCHAR(255),
    "reply_media_url" VARCHAR(255),
    "reply_title" VARCHAR(255),
    "reply_description" VARCHAR(255),
    "reply_thumb_media_id" VARCHAR(255),
    "reply_thumb_media_url" VARCHAR(255),
    "reply_articles" TEXT,
    "reply_music_url" VARCHAR(255),
    "reply_hq_music_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_menu_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_menu_tenant_id_idx" ON "mp_menu"("tenant_id");

-- 公众号消息
CREATE TABLE IF NOT EXISTS "mp_message" (
    "id" TEXT NOT NULL,
    "msg_id" BIGINT,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "user_id" BIGINT,
    "openid" VARCHAR(255),
    "type" VARCHAR(255),
    "send_from" INTEGER,
    "content" VARCHAR(255),
    "media_id" VARCHAR(255),
    "media_url" VARCHAR(255),
    "recognition" VARCHAR(255),
    "format" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "thumb_media_id" VARCHAR(255),
    "thumb_media_url" VARCHAR(255),
    "url" VARCHAR(255),
    "location_x" DECIMAL(18,2),
    "location_y" DECIMAL(18,2),
    "scale" DECIMAL(18,2),
    "label" VARCHAR(255),
    "articles" TEXT,
    "music_url" VARCHAR(255),
    "hq_music_url" VARCHAR(255),
    "event" VARCHAR(255),
    "event_key" VARCHAR(255),
    "pic_url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_message_tenant_id_idx" ON "mp_message"("tenant_id");

-- 公众号模版消息
CREATE TABLE IF NOT EXISTS "mp_message_template" (
    "id" TEXT NOT NULL,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "template_id" VARCHAR(255),
    "title" VARCHAR(255),
    "content" VARCHAR(255),
    "example" VARCHAR(255),
    "primary_industry" VARCHAR(255),
    "deputy_industry" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_message_template_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_message_template_tenant_id_idx" ON "mp_message_template"("tenant_id");

-- 公众号标签
CREATE TABLE IF NOT EXISTS "mp_tag" (
    "id" TEXT NOT NULL,
    "tag_id" BIGINT,
    "name" VARCHAR(255),
    "count" INTEGER,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_tag_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_tag_tenant_id_idx" ON "mp_tag"("tenant_id");

-- 微信公众号粉丝
CREATE TABLE IF NOT EXISTS "mp_user" (
    "id" TEXT NOT NULL,
    "openid" VARCHAR(255),
    "union_id" VARCHAR(255),
    "subscribe_status" INTEGER,
    "subscribe_time" TIMESTAMP(3),
    "unsubscribe_time" TIMESTAMP(3),
    "nickname" VARCHAR(255),
    "head_image_url" VARCHAR(255),
    "language" VARCHAR(255),
    "country" VARCHAR(255),
    "province" VARCHAR(255),
    "city" VARCHAR(255),
    "remark" VARCHAR(255),
    "tag_ids" TEXT,
    "account_id" BIGINT,
    "app_id" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_user_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "mp_user_tenant_id_idx" ON "mp_user"("tenant_id");
