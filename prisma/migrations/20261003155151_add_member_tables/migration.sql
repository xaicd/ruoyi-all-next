-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/member-source-tables.ts#MEMBER_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- 用户收件地址
CREATE TABLE IF NOT EXISTS "member_address" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "name" VARCHAR(255),
    "mobile" VARCHAR(255),
    "area_id" BIGINT,
    "detail_address" VARCHAR(255),
    "default_status" BOOLEAN,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_address_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_address_tenant_id_idx" ON "member_address"("tenant_id");

-- 会员配置
CREATE TABLE IF NOT EXISTS "member_config" (
    "id" TEXT NOT NULL,
    "point_trade_deduct_enable" BOOLEAN,
    "point_trade_deduct_unit_price" INTEGER,
    "point_trade_deduct_max_price" INTEGER,
    "point_trade_give_point" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_config_tenant_id_idx" ON "member_config"("tenant_id");

-- 会员经验记录
CREATE TABLE IF NOT EXISTS "member_experience_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "biz_type" INTEGER,
    "biz_id" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "experience" INTEGER,
    "total_experience" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_experience_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_experience_record_tenant_id_idx" ON "member_experience_record"("tenant_id");

-- 用户分组
CREATE TABLE IF NOT EXISTS "member_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "remark" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_group_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_group_tenant_id_idx" ON "member_group"("tenant_id");

-- 会员等级 DO配置每个等级需要的积分
CREATE TABLE IF NOT EXISTS "member_level" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "level" INTEGER,
    "experience" INTEGER,
    "discount_percent" INTEGER,
    "icon" VARCHAR(255),
    "background_url" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_level_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_level_tenant_id_idx" ON "member_level"("tenant_id");

-- 会员等级记录 DO用户每次等级发生变更时，记录一条日志
CREATE TABLE IF NOT EXISTS "member_level_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "level_id" BIGINT,
    "level" INTEGER,
    "discount_percent" INTEGER,
    "experience" INTEGER,
    "user_experience" INTEGER,
    "remark" VARCHAR(255),
    "description" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_level_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_level_record_tenant_id_idx" ON "member_level_record"("tenant_id");

-- 用户积分记录
CREATE TABLE IF NOT EXISTS "member_point_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "biz_id" VARCHAR(255),
    "biz_type" INTEGER,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "point" INTEGER,
    "total_point" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_point_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_point_record_tenant_id_idx" ON "member_point_record"("tenant_id");

-- 签到规则
CREATE TABLE IF NOT EXISTS "member_sign_in_config" (
    "id" TEXT NOT NULL,
    "day" INTEGER,
    "point" INTEGER,
    "experience" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_sign_in_config_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_sign_in_config_tenant_id_idx" ON "member_sign_in_config"("tenant_id");

-- 签到记录
CREATE TABLE IF NOT EXISTS "member_sign_in_record" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "day" INTEGER,
    "point" INTEGER,
    "experience" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_sign_in_record_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_sign_in_record_tenant_id_idx" ON "member_sign_in_record"("tenant_id");

-- 会员标签
CREATE TABLE IF NOT EXISTS "member_tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_tag_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_tag_tenant_id_idx" ON "member_tag"("tenant_id");

-- 会员用户 DOuk_mobile 索引：基于 字段
CREATE TABLE IF NOT EXISTS "member_user" (
    "id" TEXT NOT NULL,
    "mobile" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "status" INTEGER,
    "register_ip" VARCHAR(255),
    "register_terminal" INTEGER,
    "login_ip" VARCHAR(255),
    "login_date" TIMESTAMP(3),
    "nickname" VARCHAR(255),
    "avatar" VARCHAR(255),
    "name" VARCHAR(255),
    "sex" INTEGER,
    "birthday" TIMESTAMP(3),
    "area_id" INTEGER,
    "mark" VARCHAR(255),
    "point" INTEGER,
    "tag_ids" TEXT,
    "level_id" BIGINT,
    "experience" INTEGER,
    "group_id" BIGINT,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "member_user_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "member_user_tenant_id_idx" ON "member_user"("tenant_id");
