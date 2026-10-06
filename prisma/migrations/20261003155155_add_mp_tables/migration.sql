-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/mp-source-tables.ts#MP_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 公众号账号
CREATE TABLE IF NOT EXISTS "mp_account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "account" VARCHAR(255),
    "app_id" TEXT,
    "app_secret" VARCHAR(255),
    "token" VARCHAR(255),
    "aes_key" VARCHAR(255),
    "qr_code_url" VARCHAR(255),
    "remark" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_account_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "account" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_account" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "app_secret" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "token" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "aes_key" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "qr_code_url" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_account" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_account" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_account_tenant_id_idx" ON "mp_account"("tenant_id");

-- 公众号消息自动回复
CREATE TABLE IF NOT EXISTS "mp_auto_reply" (
    "id" TEXT NOT NULL,
    "account_id" TEXT,
    "app_id" TEXT,
    "type" INTEGER,
    "request_keyword" VARCHAR(255),
    "request_match" INTEGER,
    "request_message_type" VARCHAR(255),
    "response_message_type" VARCHAR(255),
    "response_content" VARCHAR(255),
    "response_media_id" TEXT,
    "response_media_url" VARCHAR(255),
    "response_title" VARCHAR(255),
    "response_description" VARCHAR(255),
    "response_thumb_media_id" TEXT,
    "response_thumb_media_url" VARCHAR(255),
    "response_articles" TEXT,
    "response_music_url" VARCHAR(255),
    "response_hq_music_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_auto_reply_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_auto_reply" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_auto_reply" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "request_keyword" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "request_match" INTEGER;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "request_message_type" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_message_type" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_content" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_media_id" TEXT;
ALTER TABLE "mp_auto_reply" ALTER COLUMN "response_media_id" TYPE TEXT USING "response_media_id"::TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_media_url" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_title" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_description" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_thumb_media_id" TEXT;
ALTER TABLE "mp_auto_reply" ALTER COLUMN "response_thumb_media_id" TYPE TEXT USING "response_thumb_media_id"::TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_thumb_media_url" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_articles" TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_music_url" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "response_hq_music_url" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_auto_reply" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_auto_reply" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_auto_reply_tenant_id_idx" ON "mp_auto_reply"("tenant_id");

-- 公众号素材 DO1. a href=https://developers.wei
CREATE TABLE IF NOT EXISTS "mp_material" (
    "id" TEXT NOT NULL,
    "account_id" TEXT,
    "app_id" TEXT,
    "media_id" TEXT,
    "type" VARCHAR(255),
    "permanent" BOOLEAN,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "mp_url" VARCHAR(255),
    "title" VARCHAR(255),
    "introduction" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_material_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_material" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_material" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "media_id" TEXT;
ALTER TABLE "mp_material" ALTER COLUMN "media_id" TYPE TEXT USING "media_id"::TEXT;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "permanent" BOOLEAN;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "mp_url" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "introduction" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_material" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_material" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_material_tenant_id_idx" ON "mp_material"("tenant_id");

-- 公众号菜单
CREATE TABLE IF NOT EXISTS "mp_menu" (
    "id" TEXT NOT NULL,
    "account_id" TEXT,
    "app_id" TEXT,
    "name" VARCHAR(255),
    "menu_key" VARCHAR(255),
    "parent_id" TEXT,
    "type" VARCHAR(255),
    "url" VARCHAR(255),
    "mini_program_app_id" TEXT,
    "mini_program_page_path" VARCHAR(255),
    "article_id" TEXT,
    "reply_message_type" VARCHAR(255),
    "reply_content" VARCHAR(255),
    "reply_media_id" TEXT,
    "reply_media_url" VARCHAR(255),
    "reply_title" VARCHAR(255),
    "reply_description" VARCHAR(255),
    "reply_thumb_media_id" TEXT,
    "reply_thumb_media_url" VARCHAR(255),
    "reply_articles" TEXT,
    "reply_music_url" VARCHAR(255),
    "reply_hq_music_url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_menu_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "menu_key" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "parent_id" TYPE TEXT USING "parent_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "mini_program_app_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "mini_program_app_id" TYPE TEXT USING "mini_program_app_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "mini_program_page_path" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "article_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "article_id" TYPE TEXT USING "article_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_message_type" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_content" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_media_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "reply_media_id" TYPE TEXT USING "reply_media_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_media_url" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_title" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_description" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_thumb_media_id" TEXT;
ALTER TABLE "mp_menu" ALTER COLUMN "reply_thumb_media_id" TYPE TEXT USING "reply_thumb_media_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_thumb_media_url" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_articles" TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_music_url" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "reply_hq_music_url" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_menu" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_menu" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_menu_tenant_id_idx" ON "mp_menu"("tenant_id");

-- 公众号消息
CREATE TABLE IF NOT EXISTS "mp_message" (
    "id" TEXT NOT NULL,
    "msg_id" TEXT,
    "account_id" TEXT,
    "app_id" TEXT,
    "user_id" TEXT,
    "openid" VARCHAR(255),
    "type" VARCHAR(255),
    "send_from" INTEGER,
    "content" VARCHAR(255),
    "media_id" TEXT,
    "media_url" VARCHAR(255),
    "recognition" VARCHAR(255),
    "format" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "thumb_media_id" TEXT,
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
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "msg_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "msg_id" TYPE TEXT USING "msg_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "openid" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "send_from" INTEGER;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "media_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "media_id" TYPE TEXT USING "media_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "media_url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "recognition" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "format" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "description" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "thumb_media_id" TEXT;
ALTER TABLE "mp_message" ALTER COLUMN "thumb_media_id" TYPE TEXT USING "thumb_media_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "thumb_media_url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "location_x" DECIMAL(18,2);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "location_y" DECIMAL(18,2);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "scale" DECIMAL(18,2);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "label" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "articles" TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "music_url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "hq_music_url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "event" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "event_key" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "pic_url" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_message" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_message_tenant_id_idx" ON "mp_message"("tenant_id");

-- 公众号模版消息
CREATE TABLE IF NOT EXISTS "mp_message_template" (
    "id" TEXT NOT NULL,
    "account_id" TEXT,
    "app_id" TEXT,
    "template_id" TEXT,
    "title" VARCHAR(255),
    "content" VARCHAR(255),
    "example" VARCHAR(255),
    "primary_industry" VARCHAR(255),
    "deputy_industry" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_message_template_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_message_template" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_message_template" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "template_id" TEXT;
ALTER TABLE "mp_message_template" ALTER COLUMN "template_id" TYPE TEXT USING "template_id"::TEXT;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "example" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "primary_industry" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "deputy_industry" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_message_template" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_message_template" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_message_template_tenant_id_idx" ON "mp_message_template"("tenant_id");

-- 公众号标签
CREATE TABLE IF NOT EXISTS "mp_tag" (
    "id" TEXT NOT NULL,
    "tag_id" TEXT,
    "name" VARCHAR(255),
    "count" INTEGER,
    "account_id" TEXT,
    "app_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_tag_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "tag_id" TEXT;
ALTER TABLE "mp_tag" ALTER COLUMN "tag_id" TYPE TEXT USING "tag_id"::TEXT;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "count" INTEGER;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_tag" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_tag" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_tag" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_tag" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_tag_tenant_id_idx" ON "mp_tag"("tenant_id");

-- 微信公众号粉丝
CREATE TABLE IF NOT EXISTS "mp_user" (
    "id" TEXT NOT NULL,
    "openid" VARCHAR(255),
    "union_id" TEXT,
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
    "account_id" TEXT,
    "app_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "mp_user_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "openid" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "union_id" TEXT;
ALTER TABLE "mp_user" ALTER COLUMN "union_id" TYPE TEXT USING "union_id"::TEXT;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "subscribe_status" INTEGER;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "subscribe_time" TIMESTAMP(3);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "unsubscribe_time" TIMESTAMP(3);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "nickname" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "head_image_url" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "language" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "country" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "province" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "city" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "remark" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "tag_ids" TEXT;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "account_id" TEXT;
ALTER TABLE "mp_user" ALTER COLUMN "account_id" TYPE TEXT USING "account_id"::TEXT;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "app_id" TEXT;
ALTER TABLE "mp_user" ALTER COLUMN "app_id" TYPE TEXT USING "app_id"::TEXT;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "mp_user" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "mp_user" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "mp_user_tenant_id_idx" ON "mp_user"("tenant_id");
