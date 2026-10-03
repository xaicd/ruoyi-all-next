-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/im-source-tables.ts#IM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- ImChannel（源框架导入）
CREATE TABLE "im_channel" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "avatar" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_channel_tenant_id_idx" ON "im_channel"("tenant_id");

-- ImChannelMaterial（源框架导入）
CREATE TABLE "im_channel_material" (
    "id" TEXT NOT NULL,
    "channel_id" BIGINT,
    "type" INTEGER,
    "title" VARCHAR(255),
    "cover_url" VARCHAR(255),
    "summary" VARCHAR(255),
    "content" VARCHAR(255),
    "url" VARCHAR(255),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_material_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_channel_material_tenant_id_idx" ON "im_channel_material"("tenant_id");

-- ImChannelMessage（源框架导入）
CREATE TABLE "im_channel_message" (
    "id" TEXT NOT NULL,
    "channel_id" BIGINT,
    "material_id" BIGINT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "receiver_user_ids" TEXT,
    "send_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_channel_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_channel_message_tenant_id_idx" ON "im_channel_message"("tenant_id");

-- ImConversationRead（源框架导入）
CREATE TABLE "im_conversation_read" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "conversation_type" INTEGER,
    "target_id" BIGINT,
    "message_id" BIGINT,
    "read_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_conversation_read_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_conversation_read_tenant_id_idx" ON "im_conversation_read"("tenant_id");

-- ImFacePack（源框架导入）
CREATE TABLE "im_face_pack" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "icon" VARCHAR(255),
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_pack_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_face_pack_tenant_id_idx" ON "im_face_pack"("tenant_id");

-- ImFacePackItem（源框架导入）
CREATE TABLE "im_face_pack_item" (
    "id" TEXT NOT NULL,
    "pack_id" BIGINT,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "sort" INTEGER,
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_pack_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_face_pack_item_tenant_id_idx" ON "im_face_pack_item"("tenant_id");

-- ImFaceUserItem（源框架导入）
CREATE TABLE "im_face_user_item" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "url" VARCHAR(255),
    "name" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "sort" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_face_user_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_face_user_item_tenant_id_idx" ON "im_face_user_item"("tenant_id");

-- ImFriend（源框架导入）
CREATE TABLE "im_friend" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT,
    "friend_user_id" BIGINT,
    "silent" BOOLEAN,
    "display_name" VARCHAR(255),
    "add_source" INTEGER,
    "pinned" BOOLEAN,
    "blocked" BOOLEAN,
    "status" INTEGER,
    "add_time" TIMESTAMP(3),
    "delete_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_friend_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_friend_tenant_id_idx" ON "im_friend"("tenant_id");

-- ImFriendRequest（源框架导入）
CREATE TABLE "im_friend_request" (
    "id" TEXT NOT NULL,
    "from_user_id" BIGINT,
    "to_user_id" BIGINT,
    "apply_content" VARCHAR(255),
    "display_name" VARCHAR(255),
    "add_source" INTEGER,
    "handle_result" INTEGER,
    "handle_content" VARCHAR(255),
    "handle_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_friend_request_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_friend_request_tenant_id_idx" ON "im_friend_request"("tenant_id");

-- ImGroup（源框架导入）
CREATE TABLE "im_group" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "owner_user_id" BIGINT,
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
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_group_tenant_id_idx" ON "im_group"("tenant_id");

-- ImGroupMember（源框架导入）
CREATE TABLE "im_group_member" (
    "id" TEXT NOT NULL,
    "group_id" BIGINT,
    "user_id" BIGINT,
    "display_user_name" VARCHAR(255),
    "group_remark" VARCHAR(255),
    "silent" BOOLEAN,
    "status" INTEGER,
    "role" INTEGER,
    "join_time" TIMESTAMP(3),
    "add_source" INTEGER,
    "inviter_user_id" BIGINT,
    "quit_time" TIMESTAMP(3),
    "mute_end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_member_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_group_member_tenant_id_idx" ON "im_group_member"("tenant_id");

-- ImGroupMessage（源框架导入）
CREATE TABLE "im_group_message" (
    "id" TEXT NOT NULL,
    "client_message_id" VARCHAR(255),
    "sender_id" BIGINT,
    "group_id" BIGINT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "status" INTEGER,
    "send_time" TIMESTAMP(3),
    "receiver_user_ids" TEXT,
    "at_user_ids" TEXT,
    "receipt_status" INTEGER,
    "read_count" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_group_message_tenant_id_idx" ON "im_group_message"("tenant_id");

-- ImGroupRequest（源框架导入）
CREATE TABLE "im_group_request" (
    "id" TEXT NOT NULL,
    "group_id" BIGINT,
    "user_id" BIGINT,
    "inviter_user_id" BIGINT,
    "apply_content" VARCHAR(255),
    "add_source" INTEGER,
    "handle_result" INTEGER,
    "handle_user_id" BIGINT,
    "handle_content" VARCHAR(255),
    "handle_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_group_request_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_group_request_tenant_id_idx" ON "im_group_request"("tenant_id");

-- ImPrivateMessage（源框架导入）
CREATE TABLE "im_private_message" (
    "id" TEXT NOT NULL,
    "client_message_id" VARCHAR(255),
    "sender_id" BIGINT,
    "receiver_id" BIGINT,
    "type" INTEGER,
    "content" VARCHAR(255),
    "status" INTEGER,
    "receipt_status" INTEGER,
    "send_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_private_message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_private_message_tenant_id_idx" ON "im_private_message"("tenant_id");

-- ImRtcCall（源框架导入）
CREATE TABLE "im_rtc_call" (
    "id" TEXT NOT NULL,
    "room" VARCHAR(255),
    "conversation_type" INTEGER,
    "media_type" INTEGER,
    "inviter_user_id" BIGINT,
    "group_id" BIGINT,
    "status" INTEGER,
    "end_reason" INTEGER,
    "start_time" TIMESTAMP(3),
    "accept_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_rtc_call_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_rtc_call_tenant_id_idx" ON "im_rtc_call"("tenant_id");

-- ImRtcParticipant（源框架导入）
CREATE TABLE "im_rtc_participant" (
    "id" TEXT NOT NULL,
    "call_id" BIGINT,
    "room" VARCHAR(255),
    "user_id" BIGINT,
    "role" INTEGER,
    "status" INTEGER,
    "invite_time" TIMESTAMP(3),
    "accept_time" TIMESTAMP(3),
    "leave_time" TIMESTAMP(3),
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_rtc_participant_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_rtc_participant_tenant_id_idx" ON "im_rtc_participant"("tenant_id");

-- ImSensitiveWord（源框架导入）
CREATE TABLE "im_sensitive_word" (
    "id" TEXT NOT NULL,
    "word" VARCHAR(255),
    "status" INTEGER,
    "tenant_id" VARCHAR(64) NOT NULL,
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "im_sensitive_word_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "im_sensitive_word_tenant_id_idx" ON "im_sensitive_word"("tenant_id");
