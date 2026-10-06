-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/im-source-tables.ts#IM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消
CREATE TABLE IF NOT EXISTS "im_channel" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "code" VARCHAR(255);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "avatar" VARCHAR(255);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_channel" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_channel_tenant_id_idx" ON "im_channel"("tenant_id");

-- IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N 
CREATE TABLE IF NOT EXISTS "im_channel_material" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT,
    "type" INTEGER,
    "title" VARCHAR(255),
    "cover_url" VARCHAR(255),
    "summary" VARCHAR(255),
    "content" VARCHAR(255),
    "url" VARCHAR(255),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_material_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "channel_id" TEXT;
ALTER TABLE "im_channel_material" ALTER COLUMN "channel_id" TYPE TEXT USING "channel_id"::TEXT;
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "title" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "cover_url" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "summary" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_channel_material" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel_material" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_channel_material_tenant_id_idx" ON "im_channel_material"("tenant_id");

-- IM 频道消息 DO业务语义：- 一次推送 1 行； 为空表示全员- 冗余 便于
CREATE TABLE IF NOT EXISTS "im_channel_message" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT,
    "material_id" TEXT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "receiver_user_ids" TEXT,
    "send_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "channel_id" TEXT;
ALTER TABLE "im_channel_message" ALTER COLUMN "channel_id" TYPE TEXT USING "channel_id"::TEXT;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "material_id" TEXT;
ALTER TABLE "im_channel_message" ALTER COLUMN "material_id" TYPE TEXT USING "material_id"::TEXT;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "receiver_user_ids" TEXT;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "send_time" TIMESTAMP(3);
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_channel_message" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_channel_message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_channel_message_tenant_id_idx" ON "im_channel_message"("tenant_id");

-- IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 /
CREATE TABLE IF NOT EXISTS "im_conversation_read" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "conversation_type" INTEGER,
    "target_id" TEXT,
    "message_id" TEXT,
    "read_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_conversation_read_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_conversation_read" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "conversation_type" INTEGER;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "target_id" TEXT;
ALTER TABLE "im_conversation_read" ALTER COLUMN "target_id" TYPE TEXT USING "target_id"::TEXT;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "message_id" TEXT;
ALTER TABLE "im_conversation_read" ALTER COLUMN "message_id" TYPE TEXT USING "message_id"::TEXT;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "read_time" TIMESTAMP(3);
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_conversation_read" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_conversation_read" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_conversation_read_tenant_id_idx" ON "im_conversation_read"("tenant_id");

-- IM 表情包 DO（运营配置的系统表情包元数据）
CREATE TABLE IF NOT EXISTS "im_face_pack" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "icon" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_pack_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "icon" VARCHAR(255);
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_face_pack" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_pack" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_face_pack_tenant_id_idx" ON "im_face_pack"("tenant_id");

-- IM 表情包项 DO（系统表情包内的单张表情图）
CREATE TABLE IF NOT EXISTS "im_face_pack_item" (
    "id" TEXT NOT NULL,
    "pack_id" TEXT,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_pack_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "pack_id" TEXT;
ALTER TABLE "im_face_pack_item" ALTER COLUMN "pack_id" TYPE TEXT USING "pack_id"::TEXT;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "width" INTEGER;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_face_pack_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_pack_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_face_pack_item_tenant_id_idx" ON "im_face_pack_item"("tenant_id");

-- IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）
CREATE TABLE IF NOT EXISTS "im_face_user_item" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "sort" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_user_item_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_face_user_item" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "url" VARCHAR(255);
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "width" INTEGER;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "sort" INTEGER;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_face_user_item" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_face_user_item" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_face_user_item_tenant_id_idx" ON "im_face_user_item"("tenant_id");

-- IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（u
CREATE TABLE IF NOT EXISTS "im_friend" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "friend_user_id" TEXT,
    "silent" BOOLEAN,
    "display_name" VARCHAR(255),
    "add_source" INTEGER,
    "pinned" BOOLEAN,
    "blocked" BOOLEAN,
    "status" INTEGER,
    "add_time" TIMESTAMP(3),
    "delete_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_friend_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_friend" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "friend_user_id" TEXT;
ALTER TABLE "im_friend" ALTER COLUMN "friend_user_id" TYPE TEXT USING "friend_user_id"::TEXT;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "silent" BOOLEAN;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "display_name" VARCHAR(255);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "add_source" INTEGER;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "pinned" BOOLEAN;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "blocked" BOOLEAN;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "add_time" TIMESTAMP(3);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "delete_time" TIMESTAMP(3);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_friend" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_friend" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_friend_tenant_id_idx" ON "im_friend"("tenant_id");

-- IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接
CREATE TABLE IF NOT EXISTS "im_friend_request" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT,
    "to_user_id" TEXT,
    "apply_content" VARCHAR(255),
    "display_name" VARCHAR(255),
    "add_source" INTEGER,
    "handle_result" INTEGER,
    "handle_content" VARCHAR(255),
    "handle_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_friend_request_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "from_user_id" TEXT;
ALTER TABLE "im_friend_request" ALTER COLUMN "from_user_id" TYPE TEXT USING "from_user_id"::TEXT;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "to_user_id" TEXT;
ALTER TABLE "im_friend_request" ALTER COLUMN "to_user_id" TYPE TEXT USING "to_user_id"::TEXT;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "apply_content" VARCHAR(255);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "display_name" VARCHAR(255);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "add_source" INTEGER;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "handle_result" INTEGER;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "handle_content" VARCHAR(255);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "handle_time" TIMESTAMP(3);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_friend_request" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_friend_request" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_friend_request_tenant_id_idx" ON "im_friend_request"("tenant_id");

-- IM 群信息
CREATE TABLE IF NOT EXISTS "im_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "owner_user_id" TEXT,
    "avatar" VARCHAR(255),
    "notice" VARCHAR(255),
    "join_approval" BOOLEAN,
    "banned" BOOLEAN,
    "banned_reason" VARCHAR(255),
    "banned_time" TIMESTAMP(3),
    "status" INTEGER,
    "dissolved_time" TIMESTAMP(3),
    "muted_all" BOOLEAN,
    "pinned_message_ids" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "owner_user_id" TEXT;
ALTER TABLE "im_group" ALTER COLUMN "owner_user_id" TYPE TEXT USING "owner_user_id"::TEXT;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "avatar" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "notice" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "join_approval" BOOLEAN;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "banned" BOOLEAN;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "banned_reason" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "banned_time" TIMESTAMP(3);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "dissolved_time" TIMESTAMP(3);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "muted_all" BOOLEAN;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "pinned_message_ids" TEXT;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_group" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_group_tenant_id_idx" ON "im_group"("tenant_id");

-- IM 群成员
CREATE TABLE IF NOT EXISTS "im_group_member" (
    "id" TEXT NOT NULL,
    "group_id" TEXT,
    "user_id" TEXT,
    "display_user_name" VARCHAR(255),
    "group_remark" VARCHAR(255),
    "silent" BOOLEAN,
    "status" INTEGER,
    "role" INTEGER,
    "join_time" TIMESTAMP(3),
    "add_source" INTEGER,
    "inviter_user_id" TEXT,
    "quit_time" TIMESTAMP(3),
    "mute_end_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_member_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "im_group_member" ALTER COLUMN "group_id" TYPE TEXT USING "group_id"::TEXT;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_group_member" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "display_user_name" VARCHAR(255);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "group_remark" VARCHAR(255);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "silent" BOOLEAN;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "role" INTEGER;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "join_time" TIMESTAMP(3);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "add_source" INTEGER;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "inviter_user_id" TEXT;
ALTER TABLE "im_group_member" ALTER COLUMN "inviter_user_id" TYPE TEXT USING "inviter_user_id"::TEXT;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "quit_time" TIMESTAMP(3);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "mute_end_time" TIMESTAMP(3);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_group_member" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_member" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_group_member_tenant_id_idx" ON "im_group_member"("tenant_id");

-- IM 群聊消息
CREATE TABLE IF NOT EXISTS "im_group_message" (
    "id" TEXT NOT NULL,
    "client_message_id" TEXT,
    "sender_id" TEXT,
    "group_id" TEXT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "status" INTEGER,
    "send_time" TIMESTAMP(3),
    "receiver_user_ids" TEXT,
    "at_user_ids" TEXT,
    "receipt_status" INTEGER,
    "read_count" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "client_message_id" TEXT;
ALTER TABLE "im_group_message" ALTER COLUMN "client_message_id" TYPE TEXT USING "client_message_id"::TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "sender_id" TEXT;
ALTER TABLE "im_group_message" ALTER COLUMN "sender_id" TYPE TEXT USING "sender_id"::TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "im_group_message" ALTER COLUMN "group_id" TYPE TEXT USING "group_id"::TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "send_time" TIMESTAMP(3);
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "receiver_user_ids" TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "at_user_ids" TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "receipt_status" INTEGER;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "read_count" INTEGER;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_group_message" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_group_message_tenant_id_idx" ON "im_group_message"("tenant_id");

-- IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply
CREATE TABLE IF NOT EXISTS "im_group_request" (
    "id" TEXT NOT NULL,
    "group_id" TEXT,
    "user_id" TEXT,
    "inviter_user_id" TEXT,
    "apply_content" VARCHAR(255),
    "add_source" INTEGER,
    "handle_result" INTEGER,
    "handle_user_id" TEXT,
    "handle_content" VARCHAR(255),
    "handle_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_request_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "im_group_request" ALTER COLUMN "group_id" TYPE TEXT USING "group_id"::TEXT;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_group_request" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "inviter_user_id" TEXT;
ALTER TABLE "im_group_request" ALTER COLUMN "inviter_user_id" TYPE TEXT USING "inviter_user_id"::TEXT;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "apply_content" VARCHAR(255);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "add_source" INTEGER;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "handle_result" INTEGER;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "handle_user_id" TEXT;
ALTER TABLE "im_group_request" ALTER COLUMN "handle_user_id" TYPE TEXT USING "handle_user_id"::TEXT;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "handle_content" VARCHAR(255);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "handle_time" TIMESTAMP(3);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_group_request" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_group_request" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_group_request_tenant_id_idx" ON "im_group_request"("tenant_id");

-- IM 私聊消息
CREATE TABLE IF NOT EXISTS "im_private_message" (
    "id" TEXT NOT NULL,
    "client_message_id" TEXT,
    "sender_id" TEXT,
    "receiver_id" TEXT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "status" INTEGER,
    "receipt_status" INTEGER,
    "send_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_private_message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "client_message_id" TEXT;
ALTER TABLE "im_private_message" ALTER COLUMN "client_message_id" TYPE TEXT USING "client_message_id"::TEXT;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "sender_id" TEXT;
ALTER TABLE "im_private_message" ALTER COLUMN "sender_id" TYPE TEXT USING "sender_id"::TEXT;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "receiver_id" TEXT;
ALTER TABLE "im_private_message" ALTER COLUMN "receiver_id" TYPE TEXT USING "receiver_id"::TEXT;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "type" INTEGER;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "content" VARCHAR(255);
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "receipt_status" INTEGER;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "send_time" TIMESTAMP(3);
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_private_message" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_private_message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_private_message_tenant_id_idx" ON "im_private_message"("tenant_id");

-- IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED →
CREATE TABLE IF NOT EXISTS "im_rtc_call" (
    "id" TEXT NOT NULL,
    "room" VARCHAR(255),
    "conversation_type" INTEGER,
    "media_type" INTEGER,
    "inviter_user_id" TEXT,
    "group_id" TEXT,
    "status" INTEGER,
    "end_reason" INTEGER,
    "start_time" TIMESTAMP(3),
    "accept_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_rtc_call_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "room" VARCHAR(255);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "conversation_type" INTEGER;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "media_type" INTEGER;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "inviter_user_id" TEXT;
ALTER TABLE "im_rtc_call" ALTER COLUMN "inviter_user_id" TYPE TEXT USING "inviter_user_id"::TEXT;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "group_id" TEXT;
ALTER TABLE "im_rtc_call" ALTER COLUMN "group_id" TYPE TEXT USING "group_id"::TEXT;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "end_reason" INTEGER;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "start_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "accept_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_rtc_call" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_rtc_call" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_rtc_call_tenant_id_idx" ON "im_rtc_call"("tenant_id");

-- IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主
CREATE TABLE IF NOT EXISTS "im_rtc_participant" (
    "id" TEXT NOT NULL,
    "call_id" TEXT,
    "room" VARCHAR(255),
    "user_id" TEXT,
    "role" INTEGER,
    "status" INTEGER,
    "invite_time" TIMESTAMP(3),
    "accept_time" TIMESTAMP(3),
    "leave_time" TIMESTAMP(3),
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_rtc_participant_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "call_id" TEXT;
ALTER TABLE "im_rtc_participant" ALTER COLUMN "call_id" TYPE TEXT USING "call_id"::TEXT;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "room" VARCHAR(255);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "im_rtc_participant" ALTER COLUMN "user_id" TYPE TEXT USING "user_id"::TEXT;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "role" INTEGER;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "invite_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "accept_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "leave_time" TIMESTAMP(3);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_rtc_participant" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_rtc_participant" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_rtc_participant_tenant_id_idx" ON "im_rtc_participant"("tenant_id");

-- IM 敏感词
CREATE TABLE IF NOT EXISTS "im_sensitive_word" (
    "id" TEXT NOT NULL,
    "word" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" TEXT NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_sensitive_word_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "word" VARCHAR(255);
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "status" INTEGER;
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT NOT NULL;
ALTER TABLE "im_sensitive_word" ALTER COLUMN "tenant_id" TYPE TEXT USING "tenant_id"::TEXT;
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "created_by" VARCHAR(255);
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "updated_by" VARCHAR(255);
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "im_sensitive_word" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "im_sensitive_word_tenant_id_idx" ON "im_sensitive_word"("tenant_id");
