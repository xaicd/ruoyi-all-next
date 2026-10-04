-- 由 scripts/generate-table-migration.ts 生成，请勿手改。
-- 来源: scripts/data/im-source-tables.ts#IM_TABLES
-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，
--       导致"仓储在查但无处创建"。本迁移补齐 DDL。
-- IM 频道 DO业务语义：- 频道是运营单向推送的主体；C 端用户不能向频道发消息- 是业务码（API / 字典外露），id 是数字主键给前端会话 targetId 用
CREATE TABLE IF NOT EXISTS "im_channel" (
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
CREATE INDEX IF NOT EXISTS "im_channel_tenant_id_idx" ON "im_channel"("tenant_id");

-- IM 频道素材 DO业务语义：- 运营素材库，可被反复推送- 一条素材 1:N 关联多条 - 富文本仅在素材详情接口按需返回，推送 payload 不带，避免压爆 WebSocket 通道
CREATE TABLE IF NOT EXISTS "im_channel_material" (
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
CREATE INDEX IF NOT EXISTS "im_channel_material_tenant_id_idx" ON "im_channel_material"("tenant_id");

-- IM 频道消息 DO业务语义：- 一次推送 1 行； 为空表示全员- 冗余 便于按频道检索- 存推送时 payload 的 JSON 快照（title / coverUrl / summa
CREATE TABLE IF NOT EXISTS "im_channel_message" (
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
CREATE INDEX IF NOT EXISTS "im_channel_message_tenant_id_idx" ON "im_channel_message"("tenant_id");

-- IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。
CREATE TABLE IF NOT EXISTS "im_conversation_read" (
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
CREATE INDEX IF NOT EXISTS "im_conversation_read_tenant_id_idx" ON "im_conversation_read"("tenant_id");

-- IM 表情包 DO（运营配置的系统表情包元数据）
CREATE TABLE IF NOT EXISTS "im_face_pack" (
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
CREATE INDEX IF NOT EXISTS "im_face_pack_tenant_id_idx" ON "im_face_pack"("tenant_id");

-- IM 表情包项 DO（系统表情包内的单张表情图）
CREATE TABLE IF NOT EXISTS "im_face_pack_item" (
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
CREATE INDEX IF NOT EXISTS "im_face_pack_item_tenant_id_idx" ON "im_face_pack_item"("tenant_id");

-- IM 用户私有表情 DO（个人表情包，对照微信「我的表情」）
CREATE TABLE IF NOT EXISTS "im_face_user_item" (
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
CREATE INDEX IF NOT EXISTS "im_face_user_item_tenant_id_idx" ON "im_face_user_item"("tenant_id");

-- IM 好友关系 DO业务语义：- 双向关系：A-B 互为好友会存 2 条记录（userId=A, friendUserId=B 和 userId=B, friendUserId=A）- 状态管理
CREATE TABLE IF NOT EXISTS "im_friend" (
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
CREATE INDEX IF NOT EXISTS "im_friend_tenant_id_idx" ON "im_friend"("tenant_id");

-- IM 好友申请记录 DO配合「申请 - 审批」流程：- 发起方调 apply 接口落库（handleResult=UNHANDLED）- 接收方调 agree / refuse 处理（更新 ha
CREATE TABLE IF NOT EXISTS "im_friend_request" (
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
CREATE INDEX IF NOT EXISTS "im_friend_request_tenant_id_idx" ON "im_friend_request"("tenant_id");

-- IM 群信息
CREATE TABLE IF NOT EXISTS "im_group" (
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
CREATE INDEX IF NOT EXISTS "im_group_tenant_id_idx" ON "im_group"("tenant_id");

-- IM 群成员
CREATE TABLE IF NOT EXISTS "im_group_member" (
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
CREATE INDEX IF NOT EXISTS "im_group_member_tenant_id_idx" ON "im_group_member"("tenant_id");

-- IM 群聊消息
CREATE TABLE IF NOT EXISTS "im_group_message" (
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
CREATE INDEX IF NOT EXISTS "im_group_message_tenant_id_idx" ON "im_group_message"("tenant_id");

-- IM 加群申请记录 DO配合「申请 - 审批」流程：用户主动申请：调 apply 接口落库（inviterUserId=null，handleResult=UNHANDLED），
CREATE TABLE IF NOT EXISTS "im_group_request" (
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
CREATE INDEX IF NOT EXISTS "im_group_request_tenant_id_idx" ON "im_group_request"("tenant_id");

-- IM 私聊消息
CREATE TABLE IF NOT EXISTS "im_private_message" (
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
CREATE INDEX IF NOT EXISTS "im_private_message_tenant_id_idx" ON "im_private_message"("tenant_id");

-- IM 通话记录 DO（房间级 / 主表）一通通话一行；状态机 CREATED → RUNNING → ENDED；和明细表 通过 关联
CREATE TABLE IF NOT EXISTS "im_rtc_call" (
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
CREATE INDEX IF NOT EXISTS "im_rtc_call_tenant_id_idx" ON "im_rtc_call"("tenant_id");

-- IM 通话参与者 DO（用户级 / 明细表）一通通话每个参与者一行；通过 关联主表 终态闭合：通话 ENDED 时所有明细 status 必属 LEFT / REJECTED / NO
CREATE TABLE IF NOT EXISTS "im_rtc_participant" (
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
CREATE INDEX IF NOT EXISTS "im_rtc_participant_tenant_id_idx" ON "im_rtc_participant"("tenant_id");

-- IM 敏感词
CREATE TABLE IF NOT EXISTS "im_sensitive_word" (
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
CREATE INDEX IF NOT EXISTS "im_sensitive_word_tenant_id_idx" ON "im_sensitive_word"("tenant_id");
